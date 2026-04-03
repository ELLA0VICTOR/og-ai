from typing import AsyncGenerator

import opengradient as og

from app.config import settings
from app.og_client import get_llm, get_model
from app.services.prompt_builder import build_messages
from app.rag.retrieval import retrieve

ENCODING_REPLACEMENTS = {
    'â€”': '-',
    'â€“': '-',
    'Â·': '-',
    'â†’': '->',
    'â€™': "'",
    'â€œ': '"',
    'â€': '"',
}

TEXT_REPLACEMENTS = [
    ('og.X402SettlementMode.', 'og.x402SettlementMode.'),
    ('og.SettlementMode.', 'og.x402SettlementMode.'),
    ('await llm.ensure_opg_approval(', 'llm.ensure_opg_approval('),
    ('await alpha.infer(', 'alpha.infer('),
    ('response.choices[0].message.content', "response.chat_output['content']"),
    ('response.chat_output.choices[0].message.content', "response.chat_output['content']"),
    ('response.chat_output.choices[0].delta.content', "response.chat_output['content']"),
    ('settlement_mode=', 'x402_settlement_mode='),
    ('x402_x402_settlement_mode=', 'x402_settlement_mode='),
    ('inputs=', 'model_input='),
    ('import og\n', 'import opengradient as og\n'),
    ('import og\r\n', 'import opengradient as og\r\n'),
]

STALE_NAMESPACE_TOKENS = ('client.llm', 'client.alpha', 'client.model_hub')
STALE_LINE_TOKENS = (
    'base_sepolia_rpc_url=',
    'og_testnet_rpc_url=',
    'alpha_testnet_rpc_url=',
    'OG_BASE_SEPOLIA_RPC_URL',
    'OG_ALPHA_TESTNET_RPC_URL',
)


def normalize_generated_text(text: str) -> str:
    if not text:
        return text

    normalized = text
    for old, new in ENCODING_REPLACEMENTS.items():
        normalized = normalized.replace(old, new)

    for old, new in TEXT_REPLACEMENTS:
        normalized = normalized.replace(old, new)

    removed_lines = False
    if any(token in normalized for token in STALE_LINE_TOKENS):
        filtered_lines = []
        for line in normalized.splitlines():
            if any(token in line for token in STALE_LINE_TOKENS):
                removed_lines = True
                continue
            filtered_lines.append(line)
        normalized = '\n'.join(filtered_lines).strip()

    if removed_lines:
        normalized += "\n\nNote: undocumented RPC/env lines were removed. Prefer the default SDK routing unless you intentionally verify a lower-level override."

    correction_notes = []
    if any(token in normalized for token in STALE_NAMESPACE_TOKENS):
        correction_notes.append("prefer `og.LLM(...)`, `og.Alpha(...)`, and `og.ModelHub(...)` rather than older `client.*` namespaces")

    if 'attestation_hash' in normalized:
        correction_notes.append("for text-generation metadata in this SDK shape, prefer `transaction_hash`, `payment_hash`, `tee_signature`, `tee_timestamp`, `tee_id`, `tee_endpoint`, and `tee_payment_address`")

    if 'alpha.ensure_opg_approval' in normalized:
        correction_notes.append("the installed `og.Alpha` surface here does not expose `ensure_opg_approval`; keep Alpha examples focused on `infer`, `new_workflow`, `run_workflow`, and `read_workflow_result`")

    if correction_notes:
        normalized += "\n\nCorrection: " + '; '.join(correction_notes) + '.'

    return normalized


def build_live_402_help(mode: str) -> str:
    if mode == 'debug':
        return normalize_generated_text(
            """1. WHAT FAILED

OG AI could not complete the live OpenGradient inference because the backend request itself was rejected with `402 Payment Required` before the model returned an answer.

2. TOP 3 LIKELY CAUSES

1. The backend wallet does not currently have enough usable payment state.
This usually means insufficient `$OPG`, missing Permit2 approval, or no Base Sepolia ETH for the approval transaction.

2. The deployed environment is drifting from local.
Examples: wrong `OG_PRIVATE_KEY`, stale env vars, different SDK install, wrong interpreter / venv, or a host-specific runtime mismatch.

3. A stale low-level endpoint override is interfering with the normal SDK payment flow.
If `OG_LLM_SERVER_URL` or a manual `llm_server_url` pin is set to an outdated endpoint, the SDK can surface raw payment errors instead of completing the request cleanly.

3. HOW TO RULE EACH ONE OUT

- Wallet / approval state:
  - verify the backend wallet address derived from `OG_PRIVATE_KEY`
  - confirm it has `$OPG`
  - confirm it has Base Sepolia ETH for approval gas
  - restart the backend and watch `llm.ensure_opg_approval(...)` logs

- Runtime / SDK drift:
  - compare `python -m pip show opengradient` locally vs on Render
  - confirm Render is using the intended Python / venv
  - confirm the deployed env vars match local

- Endpoint override drift:
  - check `OG_LLM_SERVER_URL` and any `llm_server_url` wiring
  - if you did not intentionally pin a TEE endpoint, remove the override and let the SDK use default routing

4. MOST LIKELY FIX PATH

1. verify the deployed wallet address and balances
2. verify approval succeeded on startup
3. remove any stale manual LLM endpoint override
4. confirm the deployed SDK/runtime matches local
5. retry with a cheaper settlement mode such as `BATCH_HASHED` for local testing if full transparency is not required for every request

5. RELEVANT SOURCES

- OG AI Operational Notes | Common integration failures
- LLM Inference | Wallet and approval
- OpenGradient Python SDK | Core entrypoints
- OpenAI-Compatible LLM Inference API | Direct x402 flow"""
        )

    return normalize_generated_text(
        """OpenGradient rejected the live request with `402 Payment Required`, so OG AI could not complete the model call.

Most likely causes:
- insufficient `$OPG`
- missing Permit2 approval
- no Base Sepolia ETH for approval gas
- stale `OG_LLM_SERVER_URL` / `llm_server_url` override
- deployed SDK/runtime drift from local

Best next checks:
1. verify the backend wallet balance and approval state
2. remove any manual LLM endpoint override unless you intentionally pinned it
3. confirm the deployed SDK and interpreter match local
4. retry with a cheaper settlement mode like `BATCH_HASHED` if you only need normal app testing right now"""
    )


async def stream_response(
    question: str,
    mode: str,
    history: list | None = None,
) -> AsyncGenerator[str, None]:
    llm = get_llm()
    chunks = retrieve(question)
    messages = build_messages(question, chunks, mode, history)

    try:
        stream = await llm.chat(
            model=get_model(),
            messages=messages,
            max_tokens=1500,
            temperature=0.1,
            x402_settlement_mode=settings.settlement_mode,
            stream=True,
        )
    except Exception as exc:
        message = str(exc)
        if '402 Payment Required' in message or 'status 402' in message:
            yield build_live_402_help(mode)
            return
        raise

    try:
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield normalize_generated_text(content)
    except Exception as exc:
        message = str(exc)
        if '402 Payment Required' in message or 'status 402' in message:
            yield build_live_402_help(mode)
            return
        raise


async def get_response(
    question: str,
    mode: str,
    history: list | None = None,
) -> dict:
    llm = get_llm()
    chunks = retrieve(question)
    messages = build_messages(question, chunks, mode, history)

    try:
        result = await llm.chat(
            model=get_model(),
            messages=messages,
            max_tokens=1500,
            temperature=0.1,
            x402_settlement_mode=settings.settlement_mode,
        )
    except Exception as exc:
        message = str(exc)
        if '402 Payment Required' in message or 'status 402' in message:
            return {
                'content': build_live_402_help(mode),
                'payment_hash': None,
                'transaction_hash': None,
                'sources': [
                    {
                        'id': c['id'],
                        'title': c['title'],
                        'url': c['url'],
                        'section': c['section'],
                        'score': c.get('score', 0),
                    }
                    for c in chunks
                ],
            }
        raise

    return {
        'content': normalize_generated_text(result.chat_output['content']),
        'payment_hash': getattr(result, 'payment_hash', None),
        'transaction_hash': getattr(result, 'transaction_hash', None),
        'sources': [
            {
                'id': c['id'],
                'title': c['title'],
                'url': c['url'],
                'section': c['section'],
                'score': c.get('score', 0),
            }
            for c in chunks
        ],
    }
