from typing import AsyncGenerator

import opengradient as og

from app.og_client import get_llm, get_model
from app.services.prompt_builder import build_messages
from app.rag.retrieval import retrieve


async def stream_response(
    question: str,
    mode: str,
    history: list | None = None,
) -> AsyncGenerator[str, None]:
    """Yield text chunks from OpenGradient TEE LLM streaming."""
    llm = get_llm()
    chunks = retrieve(question)
    messages = build_messages(question, chunks, mode, history)

    stream = await llm.chat(
        model=get_model(),
        messages=messages,
        max_tokens=1500,
        temperature=0.1,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
        stream=True,
    )

    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content


async def get_response(
    question: str,
    mode: str,
    history: list | None = None,
) -> dict:
    """Non-streaming response with payment hash and sources."""
    llm = get_llm()
    chunks = retrieve(question)
    messages = build_messages(question, chunks, mode, history)

    result = await llm.chat(
        model=get_model(),
        messages=messages,
        max_tokens=1500,
        temperature=0.1,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
    )

    return {
        'content': result.chat_output['content'],
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
