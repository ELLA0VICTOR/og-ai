"""
OpenGradient documentation knowledge base.
All chunks are grounded in the official OpenGradient docs and SDK reference (opengradient==0.9.0).
"""

DOCS = [
    {
        "id": "overview-general",
        "title": "OpenGradient Developer Overview",
        "url": "https://docs.opengradient.ai/developers/overview",
        "section": "Overview",
        "tags": ["overview", "sdk", "x402", "memsync", "getting-started"],
        "content": """OpenGradient provides three main developer tools for building verifiable AI applications:

1. Python SDK (opengradient==0.9.0): The primary interface for most developers. Provides high-level abstractions for LLM inference, ML model inference, workflows, and the Model Hub. The SDK handles wallet management, payment authorization (Permit2), and streaming automatically.

2. x402 Gateway: A direct HTTP gateway at https://llm.opengradient.ai for LLM inference accessible from any programming language. Uses the x402 payment protocol (extending HTTP 402 Payment Required). Ideal for JavaScript, Go, Rust, or any stack that doesn't use Python. Requires manual EIP-712 signature handling unless using the @x402/fetch wrapper.

3. MemSync: A long-term memory layer REST API at https://api.memchat.io/v1. Enables AI agents to store, retrieve, and search memories across sessions. Built on top of OpenGradient's own TEE-verified inference for all memory processing.

Security guarantees across all tools:
- Decentralization: No single point of failure; inference routes through distributed TEE nodes.
- Censorship Resistance: Permissionless access — no account approval required (only a funded wallet).
- Verifiability: Every inference produces a cryptographic attestation and on-chain payment record when using INDIVIDUAL_FULL mode.
- Transparency: All transactions are visible on Base Sepolia and the OG block explorer.

Use the Python SDK for Python backends, automation, and data pipelines. Use the x402 Gateway for frontend applications, multi-language backends, or fine-grained payment control. Use MemSync for stateful AI agents that need persistent user context beyond the LLM context window.""",
    },
    {
        "id": "sdk-installation",
        "title": "SDK Installation",
        "url": "https://docs.opengradient.ai/developers/sdk",
        "section": "Python SDK",
        "tags": ["sdk", "install", "pip", "python", "wsl", "cli"],
        "content": """Install the OpenGradient Python SDK with pip:

    pip install opengradient==0.9.0

Important: Windows users must use WSL (Windows Subsystem for Linux). Native Windows installation is not fully supported yet — a fix is in progress. On macOS and Linux, install directly.

The SDK installs a CLI tool: opengradient. Verify installation:

    opengradient --version

Configuration commands:
- opengradient config init  — Interactive wizard to set private key, email, and password
- opengradient config show  — Display current configuration

Test inference from CLI:

    opengradient infer -m <model_cid> --mode VANILLA --input '{"num_input1": [1.0, 2.0]}'

The config init wizard guides you through setting up your private key for LLM inference and optional Model Hub credentials (email + password) for ML inference and model management.

Config is stored in ~/.opengradient/config (exact path may vary by OS). Always run opengradient config init before using the CLI for the first time.

Python version requirement: 3.10 or higher recommended. The sentence-transformers library used for RAG requires Python 3.8+ but 3.10+ is best for production.

After installation, verify the SDK works:

    python -c "import opengradient as og; print(og.__version__)"

This should print 0.9.0.""",
    },
    {
        "id": "sdk-credentials-llm",
        "title": "SDK Credentials — LLM Inference",
        "url": "https://docs.opengradient.ai/developers/sdk",
        "section": "Python SDK",
        "tags": ["sdk", "credentials", "private-key", "opg", "base-sepolia", "llm", "wallet"],
        "content": """For LLM inference, you need an Ethereum wallet with $OPG tokens on Base Sepolia.

Network details:
- Chain: Base Sepolia
- Chain ID: 84532
- $OPG Token Address: 0x240b09731D96979f50B2C649C9CE10FcF9C7987F
- Get tokens: https://faucet.opengradient.ai/

Initialize the client with just your private key for LLM inference:

    import opengradient as og
    import os

    llm = og.LLM(
        private_key=os.environ.get("OG_PRIVATE_KEY"),  # 0x-prefixed hex key
    )

Never hardcode private keys in source code. Always use environment variables (os.environ.get) or a .env file with python-dotenv.

Before your first LLM call, authorize the Permit2 contract to spend $OPG on your behalf:

    llm.ensure_opg_approval(opg_amount=10.0)

This is idempotent — it only creates an on-chain transaction if the current allowance is below the requested amount. Safe to call every time the application starts.

To add the wallet to MetaMask:
1. Open MetaMask > Add Network > Add a network manually
2. Network Name: Base Sepolia
3. RPC URL: https://sepolia.base.org
4. Chain ID: 84532
5. Currency symbol: ETH
6. Block explorer: https://sepolia.basescan.org

Then import your private key as a new account in MetaMask to view and manage the wallet.""",
    },
    {
        "id": "sdk-credentials-ml",
        "title": "SDK Credentials — ML Inference & Model Hub",
        "url": "https://docs.opengradient.ai/developers/sdk",
        "section": "Python SDK",
        "tags": ["sdk", "credentials", "model-hub", "email", "alpha", "ml", "password"],
        "content": """For ML inference, use og.Alpha(private_key=...). For Model Hub management, use og.ModelHub(email=..., password=...). These are separate SDK entrypoints in 0.9.0.

Create a Model Hub account at: https://hub.opengradient.ai

Initialize the correct SDK clients separately:

    import opengradient as og

    alpha = og.Alpha(
        private_key=os.environ.get("OG_PRIVATE_KEY"),
    )

    hub = og.ModelHub(
        email=os.environ.get("OG_MODEL_HUB_EMAIL"),
        password=os.environ.get("OG_MODEL_HUB_PASSWORD"),
    )

For alpha testnet ML inference, you also need an OpenGradient alpha account. The SDK will fall back to OG_PRIVATE_KEY if OG_ALPHA_PRIVATE_KEY is not set in the environment.

Environment variables:
- OG_PRIVATE_KEY: 0x-prefixed Ethereum private key (required for all features)
- OG_MODEL_HUB_EMAIL: Email used to register at hub.opengradient.ai (required for ML + Hub)
- OG_MODEL_HUB_PASSWORD: Password for Model Hub account (required for ML + Hub)
- OG_ALPHA_PRIVATE_KEY: Optional separate key for alpha testnet

Run the guided setup wizard to configure everything:

    opengradient config init

The wizard prompts for each credential in sequence and saves them to the local config file. Use Alpha for verifiable ML inference and ModelHub for uploads/listing.""",
    },
    {
        "id": "llm-chat-api",
        "title": "LLM Chat API — llm.chat()",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["llm", "chat", "api", "method", "sdk", "parameters", "messages"],
        "content": """The primary LLM inference method. Supports multi-turn conversations and is async in the 0.9.0 SDK.

Full method signature:

    result = await llm.chat(
        model=og.TEE_LLM.GEMINI_2_5_FLASH,    # Required: TEE_LLM enum or model string
        messages=[                              # Required: list of message dicts
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "How do I initialize the OG client?"},
        ],
        max_tokens=1000,                        # Maximum tokens to generate
        temperature=0.1,                        # 0.0 = deterministic, 1.0 = creative
        stop_sequence=None,                     # Optional: stop generation at this string
        tools=None,                             # Optional: list of tool definitions
        tool_choice=None,                       # Optional: force specific tool
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,  # Payment mode
        stream=False,                           # True for streaming response
    )

Non-streaming return type: TextGenerationOutput
    result.chat_output['content']   — the generated text
    result.payment_hash             — x402 transaction hash on Base Sepolia
    result.finish_reason            — "stop", "length", or "tool_calls"

Streaming return type (when stream=True): async generator of chunks
    chunk.choices[0].delta.content  — text chunk (may be None, always check)
    Note: payment_hash is NOT available on individual stream chunks.

Always check that content is not None when streaming:

    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)""",
    },
    {
        "id": "llm-completion-api",
        "title": "LLM Completion API — llm.completion()",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["llm", "completion", "api", "method", "sdk", "prompt"],
        "content": """Simple single-prompt completion (non-chat). Use when you do not need multi-turn conversation. This method is async in the 0.9.0 SDK.

Full method signature:

    result = await llm.completion(
        model=og.TEE_LLM.GEMINI_2_5_FLASH,
        prompt="Your prompt here",
        max_tokens=500,
        temperature=0.0,
        stop_sequence=None,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
    )

Return type: TextGenerationOutput
    result.completion_output   — the generated text string
    result.payment_hash        — x402 transaction hash on Base Sepolia

Use completion() for:
- Simple one-shot prompts
- Batch processing where you don't need conversation history
- Simpler use cases where system/user message structure isn't needed

Use chat() for:
- Multi-turn conversations with history
- System prompt + user message patterns
- Tool calling / function calling
- Streaming responses

Example:

    result = await llm.completion(
        model=og.TEE_LLM.GEMINI_2_5_FLASH,
        prompt="Summarize the OpenGradient SDK in one sentence.",
        max_tokens=100,
        temperature=0.0,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
    )
    print(result.completion_output)
    print(f"Payment: {result.payment_hash}")""",
    },
    {
        "id": "llm-permit2-approval",
        "title": "Permit2 Approval — ensure_opg_approval()",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["permit2", "approval", "opg", "allowance", "startup", "on-chain"],
        "content": """Before making any LLM inference calls, you must authorize the Permit2 contract to spend $OPG tokens from your wallet.

    result = llm.ensure_opg_approval(opg_amount=10.0)

Parameters:
    opg_amount (float): Amount of $OPG tokens to approve as allowance. Set higher to avoid frequent re-approvals.

Return value:
    result.allowance_before  — allowance before the call (in $OPG)
    result.allowance_after   — allowance after the call
    result.tx_hash           — transaction hash (None if no transaction was needed)

Important: This method is IDEMPOTENT. It only creates an on-chain transaction if the current Permit2 allowance is below the requested opg_amount. If the allowance is already sufficient, no transaction occurs and tx_hash is None.

Best practice: Call at application startup inside the lifespan event (FastAPI) or __main__ block. This ensures approval is in place before the first request arrives without blocking request handling.

    # In FastAPI lifespan:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        client = get_client()
        llm.ensure_opg_approval(opg_amount=10.0)
        yield

Common error: If you skip ensure_opg_approval() and try to call llm.chat() directly, you'll get a Permit2 not approved error. Fix: call ensure_opg_approval() first. The error message will mention allowance or permit2.

$OPG tokens available at: https://faucet.opengradient.ai/""",
    },
    {
        "id": "llm-streaming",
        "title": "LLM Streaming Responses",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["streaming", "stream", "llm", "realtime", "chunks", "sse"],
        "content": """Enable streaming by passing stream=True to llm.chat().

    stream = llm.chat(
        model=og.TEE_LLM.GEMINI_2_5_FLASH,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Explain TEE inference in detail."},
        ],
        max_tokens=1000,
        temperature=0.1,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
        stream=True,
    )

    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:  # ALWAYS check — content can be None
            print(content, end="", flush=True)

Key points:
- chunk.choices[0].delta.content may be None — always guard with if content check.
- The stream is an iterable of chunk objects following the OpenAI streaming format.
- payment_hash is NOT available on individual stream chunks. It is only available on the final result object of non-streaming calls.
- For server-sent events (SSE) in FastAPI, wrap the streaming generator with StreamingResponse.

SSE pattern for FastAPI backend:

    def event_stream():
        for text in generate_stream(question):
            yield f"data: {json.dumps({'type': 'chunk', 'content': text})}\\n\\n"
        yield f"data: {json.dumps({'type': 'done'})}\\n\\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

Frontend reading SSE with fetch ReadableStream:

    const reader = response.body.getReader()
    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        // parse SSE lines from decoded value
    }""",
    },
    {
        "id": "llm-tool-calling",
        "title": "LLM Tool Calling / Function Calling",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["tools", "function-calling", "tool-use", "llm", "json-schema"],
        "content": """Tool calling (function calling) lets the LLM invoke defined functions. Uses the OpenAI-compatible tool format.

Define tools as a list of function schemas:

    tools = [{
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "The city name"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["city", "unit"]
            }
        }
    }]

    result = await llm.chat(
        model=og.TEE_LLM.GEMINI_2_5_FLASH,
        messages=[{"role": "user", "content": "What's the weather in London?"}],
        tools=tools,
        max_tokens=300,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
    )

When the model calls a tool:
    result.chat_output                     — dict with tool_calls key
    result.chat_output['tool_calls']        — list of tool call objects
    result.finish_reason == "tool_calls"    — indicates tool call was made

Each tool call has:
    tool_call.function.name        — function name to invoke
    tool_call.function.arguments   — JSON string of arguments

Supported models for tool calling: Gemini models, GPT-4 models. Check model documentation for the latest tool support.

Use tool_choice to force a specific tool or "auto" for model to decide:
    tool_choice="auto"       — model decides whether to use tools
    tool_choice="required"   — model must call at least one tool""",
    },
    {
        "id": "llm-settlement-modes",
        "title": "Settlement Modes — SETTLE vs INDIVIDUAL_FULL vs BATCH_HASHED",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["settlement", "settle", "metadata", "batch", "on-chain", "privacy", "x402"],
        "content": """Three settlement modes control what on-chain data is recorded for each inference.

og.x402SettlementMode.SETTLE
- Most private option.
- No model information, input, or output stored on-chain.
- Payment is processed but no audit trail of the inference content.
- Use when: privacy is paramount, content is sensitive.

og.x402SettlementMode.INDIVIDUAL_FULL (RECOMMENDED for OG AI)
- Full on-chain record: model name, input prompt, and output are stored.
- Maximum transparency and verifiability.
- Produces a payment_hash that links to the full record on Base Sepolia.
- Use when: building agents that need an audit trail, DeFi applications, healthcare/legal use cases requiring proof of AI decisions, showcasing verifiable AI.
- Verify at: https://sepolia.basescan.org/tx/{payment_hash}

og.x402SettlementMode.BATCH_HASHED
- Batches multiple inferences together into a single transaction.
- Most cost-efficient option for high-volume use cases.
- Default mode if x402_settlement_mode is omitted.
- Trade-off: lower per-call cost but slightly delayed settlement.
- Use when: running many inferences and cost matters more than real-time proof.

x402 HTTP header equivalents:
- SETTLE → "X-SETTLEMENT-TYPE": "private"
- INDIVIDUAL_FULL → "X-SETTLEMENT-TYPE": "individual"
- BATCH_HASHED → "X-SETTLEMENT-TYPE": "batch"

For OG AI, always use INDIVIDUAL_FULL so every answer has a verifiable on-chain proof that can be shown to users.""",
    },
    {
        "id": "llm-tee-verification",
        "title": "TEE Verification — What It Is and Why It Matters",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["tee", "verification", "security", "attestation", "intel-tdx", "proof"],
        "content": """TEE stands for Trusted Execution Environment. All OpenGradient LLM inference runs inside Intel TDX (Trust Domain Extensions) hardware enclaves.

How it works:
1. Your prompt is sent to an OG TEE node.
2. The TEE node is isolated hardware — even the node operator cannot read the computation.
3. The TEE node routes the request to the target LLM API (OpenAI, Anthropic, Google, xAI).
4. The response is returned through the TEE, which produces a hardware attestation.
5. The attestation is anchored on-chain with the payment record.

What this provides:
- Privacy Protection: The model provider (OpenAI, etc.) cannot link your request to your identity through OG's routing.
- Verifiability: You can cryptographically prove that a specific prompt was run through a specific model at a specific time.
- Censorship Resistance: No central party can block your inference requests.
- Audit Trail: For INDIVIDUAL_FULL, the entire inference (model, prompt, output) is on-chain.

Use cases that benefit from TEE verification:
- DeFi risk assessments: Prove that a specific model made a trading decision.
- Healthcare: Audit trail of AI-assisted diagnoses.
- Finance: Regulatory compliance — prove AI was used as specified.
- Legal: Evidence that AI output was not tampered with.
- Agent transparency: Show end users exactly what AI is doing on their behalf.

Verify any inference at: https://explorer.opengradient.ai/
View payment transactions at: https://sepolia.basescan.org/tx/{payment_hash}""",
    },
    {
        "id": "llm-supported-models",
        "title": "Supported TEE LLM Models",
        "url": "https://docs.opengradient.ai/developers/llm-inference",
        "section": "LLM Inference",
        "tags": ["models", "tee", "openai", "anthropic", "google", "grok", "llm", "enum"],
        "content": """Representative current TEE LLM models in og.TEE_LLM include:

OpenAI models:
    og.TEE_LLM.GPT_4_1_2025_04_14   # GPT-4.1 (April 2025 version)
    og.TEE_LLM.O4_MINI              # o4-mini (reasoning model)

Anthropic models:

Google models:
    og.TEE_LLM.GEMINI_2_5_FLASH      # Gemini 2.5 Flash ← DEFAULT (fast + capable)
    og.TEE_LLM.GEMINI_2_5_PRO        # Gemini 2.5 Pro (highest capability)
    og.TEE_LLM.GEMINI_2_5_FLASH_LITE # Gemini 2.5 Flash Lite (most cost-efficient)

xAI models:
    og.TEE_LLM.GROK_4_1_FAST             # Grok 4.1 Fast
    og.TEE_LLM.GROK_4_1_FAST_NON_REASONING
    og.TEE_LLM.GROK_2_VISION_LATEST

Models can also be passed as strings (e.g. "openai/gpt-4o", "anthropic/claude-3-5-haiku-20241022") to the x402 HTTP gateway directly.

Recommendation: Use GEMINI_2_5_FLASH as the default — best balance of speed, cost, and capability for developer tools. Use GEMINI_2_5_PRO for complex reasoning tasks. Note: Model access may be periodically restricted; check docs.opengradient.ai for current availability.""",
    },
    {
        "id": "x402-gateway-overview",
        "title": "x402 Gateway — Direct HTTP Access",
        "url": "https://docs.opengradient.ai/developers/x402",
        "section": "x402 Gateway",
        "tags": ["x402", "http", "gateway", "universal", "javascript", "go", "rust", "any-language"],
        "content": """The x402 Gateway provides direct HTTP access to OpenGradient LLM inference without requiring the Python SDK.

Endpoint: https://llm.opengradient.ai
Routes:
- POST /v1/chat/completions  — OpenAI-compatible chat endpoint
- POST /v1/completions       — Simple completion endpoint

The x402 protocol extends HTTP 402 Payment Required for micropayments. Any language that can make HTTP requests can use it.

Settlement via X-SETTLEMENT-TYPE header:
- "private"    — SETTLE mode (no on-chain data)
- "individual" — INDIVIDUAL_FULL mode (full on-chain record)
- "batch"      — BATCH_HASHED mode (cost-efficient batching)

When to use x402 Gateway vs Python SDK:
- x402 Gateway: JavaScript/TypeScript frontends, Go microservices, Rust applications, any non-Python stack, fine-grained payment control, existing HTTP infrastructure.
- Python SDK: Python backends, auto payment handling (SDK manages Permit2), simpler API, ML inference and Model Hub.

Model string format for x402:
    "openai/gpt-4o"
    "anthropic/claude-3-5-haiku-20241022"
    "google/gemini-2.5-flash"

The gateway is fully compatible with OpenAI's API schema — you can point any OpenAI SDK client at https://llm.opengradient.ai and it will work with the x402 payment layer on top.""",
    },
    {
        "id": "x402-payment-protocol",
        "title": "x402 Payment Protocol — 4-Step Flow",
        "url": "https://docs.opengradient.ai/developers/x402/api-reference",
        "section": "x402 Gateway",
        "tags": ["x402", "payment", "eip-712", "signature", "protocol", "flow", "base-sepolia"],
        "content": """The x402 payment protocol is a 4-step process for paying per inference over HTTP.

Step 1: Initial Request (returns 402)
    POST https://llm.opengradient.ai/v1/chat/completions
    Header: X-SETTLEMENT-TYPE: individual
    Body: { "model": "openai/gpt-4o", "messages": [...], "max_tokens": 200 }
    
    Response: HTTP 402 with X-PAYMENT-REQUIRED header (base64 encoded JSON):
    {
      "scheme": "exact",
      "network": "base-sepolia",
      "maxAmountRequired": "1000000",  // in $OPG wei
      "payTo": "0x...",               // OG payment receiver address
      "asset": "0x240b09731D96979f50B2C649C9CE10FcF9C7987F",  // $OPG token
      "timeout": 1234567890
    }

Step 2: Parse Payment Requirements
    Decode the X-PAYMENT-REQUIRED header from base64 to JSON.
    Extract: amount, payTo address, asset address, timeout.

Step 3: Sign EIP-712 TransferWithAuthorization
    Sign with your wallet on Base Sepolia (Chain ID: 84532).
    Parameters: from, to, value, validAfter, validBefore, nonce.
    This is a gasless signature — no ETH needed, only $OPG.

Step 4: Submit with Payment Header
    Resubmit the original request with:
    Header: X-PAYMENT: <base64-encoded signed payment>
    
    Success response includes X-PAYMENT-RESPONSE:
    { "success": true, "txHash": "0x...", "chainId": "84532" }

The @x402/fetch npm package automates steps 2-4 entirely — recommended for JavaScript.""",
    },
    {
        "id": "x402-js-integration",
        "title": "x402 JavaScript / TypeScript Integration",
        "url": "https://docs.opengradient.ai/developers/x402/examples",
        "section": "x402 Gateway",
        "tags": ["x402", "javascript", "typescript", "npm", "fetch", "viem", "wallet"],
        "content": """JavaScript integration using the @x402/fetch package.

Install dependencies:
    npm install @x402/fetch @x402/evm viem

Basic usage with wrapped fetch:

    import { wrapFetch } from "@x402/fetch";
    import { privateKeyToAccount } from "viem/accounts";
    import { baseSepolia } from "viem/chains";
    import { createWalletClient, http } from "viem";

    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http(),
    });

    const x402Fetch = wrapFetch(fetch, {
        wallet: walletClient,
    });

    const response = await x402Fetch(
        "https://llm.opengradient.ai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-SETTLEMENT-TYPE": "individual",  // INDIVIDUAL_FULL equivalent
            },
            body: JSON.stringify({
                model: "openai/gpt-4o",
                messages: [{ role: "user", content: "Hello!" }],
                max_tokens: 200,
            }),
        }
    );

    const data = await response.json();
    const paymentTx = response.headers.get("X-PAYMENT-RESPONSE");

For axios, use the @x402/axios package for an interceptor-based approach. The wrapped client handles the full 402 → sign → resubmit flow automatically.""",
    },
    {
        "id": "ml-inference-overview",
        "title": "ML Inference — client.alpha.infer()",
        "url": "https://docs.opengradient.ai/developers/ml-inference",
        "section": "ML Inference",
        "tags": ["ml", "inference", "alpha", "onnx", "vanilla", "tee", "zkml", "alpha-testnet", "cid"],
        "content": """IMPORTANT: ML inference is ALPHA TESTNET ONLY — not available on the main OG testnet yet.

Run inference on ONNX models stored on the Model Hub:

    result = client.alpha.infer(
        model_cid='QmbUqS93oc4JTLMHwpVxsE39mhNxy6hpf6Py3r9oANr8aZ',
        model_input={
            "num_input1": [1.0, 2.0, 3.0],
            "num_input2": 10,
        },
        inference_mode=og.InferenceMode.VANILLA,
        max_retries=3,
    )
    print(result.model_output)        # dict of output tensors
    print(result.transaction_hash)    # on-chain tx hash

Inference modes:
    og.InferenceMode.VANILLA  — Fastest, no cryptographic proof. For testing.
    og.InferenceMode.TEE      — Runs inside TEE, hardware attestation provided.
    og.InferenceMode.ZKML     — Zero-knowledge proof of inference. Most verifiable but slower.

model_cid: The IPFS-style content ID (Blob ID) of your ONNX model, found in the Model Hub.

model_input: Dictionary mapping input tensor names to values. Values can be Python lists (converted to numpy arrays internally) or direct numpy arrays.

CLI equivalent:
    opengradient infer -m QmbUqS93... --mode VANILLA --input '{"num_input1": [1.0, 2.0]}'

Requires client initialized with email + password in addition to private_key.""",
    },
    {
        "id": "ml-workflows-overview",
        "title": "ML Workflows — Scheduled On-chain Inference",
        "url": "https://docs.opengradient.ai/developers/ml-inference/workflows",
        "section": "ML Inference",
        "tags": ["workflows", "scheduled", "oracle", "on-chain", "alpha", "defi", "price-data"],
        "content": """IMPORTANT: Workflows are ALPHA TESTNET ONLY.

Workflows deploy smart contracts that automatically run ML inference on a schedule, using live oracle price data as inputs. Ideal for DeFi applications, continuous prediction streams, and autonomous agents.

Deploy a new workflow:

    from opengradient.types import HistoricalInputQuery, CandleOrder, CandleType, SchedulerParams

    input_query = HistoricalInputQuery(
        base="ETH",
        quote="USD",
        total_candles=10,
        candle_duration_in_mins=30,
        order=CandleOrder.ASCENDING,
        candle_types=[CandleType.OPEN, CandleType.HIGH, CandleType.LOW, CandleType.CLOSE]
    )

    scheduler_params = SchedulerParams(
        frequency=3600,      # run every 3600 seconds (1 hour)
        duration_hours=720,  # run for 30 days total
    )

    contract_address = client.alpha.new_workflow(
        model_cid="QmRhcpDXfYCKsimTmJYrAVM4Bbvck59Zb2onj3MHv9Kw5N",
        input_query=input_query,
        input_tensor_name="open_high_low_close",
        scheduler_params=scheduler_params,
    )

Run workflow manually (on-demand):
    client.alpha.run_workflow(contract_address)

Read latest result:
    result = client.alpha.read_workflow_result(contract_address)

Use workflows for: continuous price prediction, automated risk scoring, DeFi protocol monitoring, on-chain ML oracles. Use one-off infer() for on-demand predictions.""",
    },
    {
        "id": "ml-workflows-official",
        "title": "Official OG Workflow Contracts",
        "url": "https://docs.opengradient.ai/developers/ml-inference/workflows",
        "section": "ML Inference",
        "tags": ["workflows", "contracts", "sui", "eth", "volatility", "returns", "addresses", "deployed"],
        "content": """Three official deployed workflow contracts are available on alpha testnet. You can call read_workflow_result() on these contracts without deploying your own.

1. og-1hour-volatility-ethusdt1
   Contract: 0xD5629A5b95dde11e4B5772B5Ad8a13B933e33845
   Model CID: QmRhcpDXfYCKsimTmJYrAVM4Bbvck59Zb2onj3MHv9Kw5N
   Function: Predicts 1-hour volatility of ETH/USDT pair
   Frequency: Hourly
   Input: 10 x 30-minute OHLC candles for ETH/USD

2. og-30min-return-suiusdt
   Contract: 0xD85BA71f5701dc4C5BDf9780189Db49C6F3708D2
   Model CID: QmY1RjD3s4XPbSeKi5TqMwbxegumenZ49t2q7TrK7Xdga4
   Function: Predicts 30-minute return of SUI/USDT pair
   Frequency: Every 30 minutes
   Input: Historical SUI/USDT OHLC candles

3. og-6h-return-suiusdt
   Contract: 0x3C2E4DbD653Bd30F1333d456480c1b7aB122e946
   Model CID: QmP4BeRjycVxfKBkFtwj5xAa7sCWyffMQznNsZnXgYHpFX
   Function: Predicts 6-hour return of SUI/USDT pair
   Frequency: Every 6 hours
   Input: Historical SUI/USDT OHLC candles

Read from any official contract:

    result = client.alpha.read_workflow_result(
        "0xD5629A5b95dde11e4B5772B5Ad8a13B933e33845"
    )
    print(result)  # latest ML prediction output

These contracts run on alpha testnet (Chain ID 10744). Use client initialized with alpha testnet credentials.""",
    },
    {
        "id": "model-hub-overview",
        "title": "OpenGradient Model Hub",
        "url": "https://hub.opengradient.ai",
        "section": "Model Hub",
        "tags": ["model-hub", "hub", "onnx", "upload", "discovery", "walrus", "decentralized", "browse"],
        "content": """The OpenGradient Model Hub at https://hub.opengradient.ai is a decentralized, permissionless repository for AI models — primarily ONNX models ready for on-chain inference.

Key characteristics:
- Decentralized storage: Models stored on Walrus, a decentralized blob storage network. Not hosted by any single party.
- Permissionless: Anyone can upload models without account approval.
- Content-addressed: Models identified by Blob ID (content hash) — immutable once uploaded.

Organization structure:
    Model Repository → Release (version, e.g. 1.00) → Files (ONNX and supporting files)

Features:
- Search and browse by task type, tags, author, or organization
- Filter by inference mode (VANILLA, TEE, ZKML)
- Sort by relevance, recency, popularity, or downloads
- Playground: Run inference directly in the browser
- Versioning: Major.minor versioning scheme (1.00, 1.01, 2.00)
- Organizations: Group models under a team/company namespace
- Community discussions: Comment on models and releases

ONNX models uploaded to the Hub are immediately inference-ready via the SDK or CLI. The model's Blob ID / CID is used as the model_cid parameter in client.alpha.infer().

For ZKML compatibility, check that your model uses ONNX opset 9-18 and numeric-only inputs. The Hub's playground can test VANILLA inference directly from your browser.""",
    },
    {
        "id": "model-hub-management",
        "title": "Model Hub — SDK & CLI Management",
        "url": "https://docs.opengradient.ai/developers/model-hub",
        "section": "Model Hub",
        "tags": ["model-hub", "create", "upload", "version", "sdk", "cli", "manage"],
        "content": """Manage models programmatically via the SDK or CLI.

SDK methods:

    # Initialize client with Hub credentials
    alpha = og.Alpha(
        private_key=os.environ.get("OG_PRIVATE_KEY"),
    )

    hub = og.ModelHub(
        email=os.environ.get("OG_MODEL_HUB_EMAIL"),
        password=os.environ.get("OG_MODEL_HUB_PASSWORD"),
    )

    # Create a new model repository (auto-creates v1.00)
    client.model_hub.create_model(
        "my-volatility-model",
        model_desc="ETH/USD 1h volatility predictor"
    )

    # Create a new version
    version = client.model_hub.create_version(
        "my-volatility-model",
        notes="Retrained on 2024 data, improved accuracy"
    )

    # Upload ONNX model file
    client.model_hub.upload(
        model_path="model.onnx",
        model_name="my-volatility-model",
        version=version
    )

    # List files in a version
    files = client.model_hub.list_files("my-volatility-model", version)

CLI equivalents:
    opengradient create-model-repo --repo "my_model" --description "desc"
    opengradient create-version --repo "my_model" --notes "notes"
    opengradient upload-file model.onnx --repo "my_model" --version "1.00"
    opengradient list-files --repo "my_model" --version "1.00"

Versioning rules:
- Minor version (1.00 → 1.01): Incremental updates, same architecture
- Major version (1.00 → 2.00): Breaking changes, new architecture
- Each version has its own Blob IDs — existing consumers of v1.00 are unaffected by v1.01 uploads""",
    },
    {
        "id": "model-restrictions",
        "title": "Model Restrictions — ONNX & ZKML Limits",
        "url": "https://docs.opengradient.ai/developers/model-hub/restrictions",
        "section": "Model Hub",
        "tags": ["onnx", "zkml", "restrictions", "format", "inference", "ezkl", "opset"],
        "content": """The Model Hub accepts any file format for storage, but on-chain inference has specific requirements.

For ML inference (VANILLA, TEE modes):
- Format: ONNX required
- Opset: ONNX opset 9-18 (recommended)
- Convert PyTorch/TensorFlow models with ONNX converter tools

For ZKML inference (zero-knowledge proofs via EZKL library):
Stricter restrictions apply:

1. ONNX opset 9-18 ONLY — newer opsets are not supported.
2. Numeric inputs only — inputs must be float or int tensors. String inputs are NOT supported for ZKML.
3. No mixed static/dynamic shaped inputs — all inputs must be either all static OR a single batched dynamic input.
4. Multiple static-shaped inputs: OK
5. Single dynamically-batched input: OK
6. Mix of static and dynamic: NOT supported — hard-code constants into the model as needed.

Converting models to ONNX:

    # PyTorch example
    import torch
    model = MyModel()
    dummy_input = torch.randn(1, 10)
    torch.onnx.export(model, dummy_input, "model.onnx", opset_version=17)

    # scikit-learn with skl2onnx
    from skl2onnx import convert_sklearn
    onnx_model = convert_sklearn(sklearn_model, initial_types=[...])

Common ZKML failures: using opset 19+, string inputs, mixed shapes. The Model Hub playground can test VANILLA inference — if that works, TEE should also work. ZKML is more restrictive.""",
    },
    {
        "id": "memsync-overview",
        "title": "MemSync — Long-term AI Memory Layer",
        "url": "https://docs.opengradient.ai/developers/memsync",
        "section": "MemSync",
        "tags": ["memsync", "memory", "semantic-search", "personalization", "embeddings", "long-term"],
        "content": """MemSync is OpenGradient's long-term memory layer for AI agents and chatbots, built on top of OG's own TEE-verified inference.

Base URL: https://api.memchat.io/v1
Authentication: X-API-Key header (get your API key from the MemSync dashboard)

Core capabilities:
- Memory extraction: Feed conversations, documents, or web pages — MemSync extracts structured memories automatically using TEE LLM inference.
- Semantic search: Search memories by meaning, not just keywords. Returns results ranked by semantic similarity.
- User profiles: Automatically builds a user profile (bio, preferences, insights) from accumulated memories.
- Memory types:
  - Semantic memories: Lasting facts (e.g., "User is a Python developer who prefers FastAPI")
  - Episodic memories: Time-bound events (e.g., "User was debugging a Permit2 error on 2024-01-15")

Why use MemSync:
- AI context windows are limited. MemSync extends memory indefinitely across sessions.
- Personalization without manual tracking.
- All memory AI processing (extraction, embedding) runs through OpenGradient TEE for verifiable privacy.
- Avoid re-explaining context on every new conversation.

Use MemSync when building: personalized coding assistants, customer service agents with history, long-term user relationship management, AI assistants that remember preferences.

Note: Memory extraction is asynchronous — it may take a few seconds after the POST /v1/memories call before results appear in search.""",
    },
    {
        "id": "memsync-api",
        "title": "MemSync API Usage",
        "url": "https://docs.opengradient.ai/developers/memsync",
        "section": "MemSync",
        "tags": ["memsync", "api", "store", "search", "profile", "memories", "rest"],
        "content": """MemSync REST API reference for storing and retrieving memories.

Store memories (POST /v1/memories):

    import httpx

    headers = {"X-API-Key": "your-memsync-api-key"}

    response = httpx.post(
        "https://api.memchat.io/v1/memories",
        headers=headers,
        json={
            "messages": [
                {"role": "user", "content": "I'm building a DeFi app on OpenGradient"},
                {"role": "assistant", "content": "I can help with that..."}
            ],
            "agent_id": "og-ai-assistant",
            "thread_id": "user-session-123",
            "source": "chat"
        }
    )

Search memories (POST /v1/memories/search):

    response = httpx.post(
        "https://api.memchat.io/v1/memories/search",
        headers=headers,
        json={
            "query": "OpenGradient DeFi project",
            "limit": 5,
            "rerank": True
        }
    )
    data = response.json()
    # data["user_bio"]   — user bio string
    # data["memories"]   — list of memory objects:
    #   memory["id"]             — unique memory ID
    #   memory["memory"]         — memory text
    #   memory["categories"]     — list of category tags
    #   memory["type"]           — "semantic" or "episodic"
    #   memory["vector_distance"] — semantic distance score
    #   memory["rerank_score"]   — reranker score (if rerank=True)

Get user profile (GET /v1/users/profile):
    response = httpx.get("https://api.memchat.io/v1/users/profile", headers=headers)
    profile = response.json()
    # profile["user_bio"]   — synthesized user bio
    # profile["profiles"]   — list of profile facets
    # profile["insights"]   — AI-generated insights about the user""",
    },
    {
        "id": "network-info",
        "title": "OpenGradient Network Info — RPC, Explorer, Faucet",
        "url": "https://docs.opengradient.ai/developers/networks",
        "section": "Networks",
        "tags": ["network", "rpc", "testnet", "chain-id", "explorer", "faucet", "metamask", "rpc-url"],
        "content": """OpenGradient operates multiple networks for different purposes.

OG Testnet (primary testnet for most features):
- RPC URL: https://ogevmdevnet.opengradient.ai
- Chain ID: 10740
- Explorer: https://explorer.opengradient.ai/
- Faucet: https://faucet.opengradient.ai/

Alpha Testnet (for ML inference and Workflows — currently being migrated):
- RPC URL: https://eth-devnet.opengradient.ai
- Chain ID: 10744
- Explorer: https://testnetv1.opengradient.ai/
- Note: ML inference features are alpha testnet only

Base Sepolia (for $OPG payment token):
- Chain ID: 84532
- $OPG Token: 0x240b09731D96979f50B2C649C9CE10FcF9C7987F
- Block Explorer: https://sepolia.basescan.org/
- LLM payments settle on Base Sepolia

Add OG Testnet to MetaMask:
1. Settings > Networks > Add a network manually
2. Network Name: OG Testnet
3. RPC URL: https://ogevmdevnet.opengradient.ai
4. Chain ID: 10740
5. Currency symbol: OG
6. Block explorer: https://explorer.opengradient.ai/

Get test tokens:
- $OPG for LLM inference: https://faucet.opengradient.ai/ (Base Sepolia)
- OG testnet tokens: same faucet URL, select OG Testnet

Model Hub: https://hub.opengradient.ai
LLM Gateway: https://llm.opengradient.ai
OG Explorer: https://explorer.opengradient.ai/""",
    },
    {
        "id": "langchain-integration",
        "title": "LangChain / LangGraph Agent Integration",
        "url": "https://docs.opengradient.ai/developers/sdk",
        "section": "Python SDK",
        "tags": ["langchain", "langgraph", "agent", "react-agent", "tools", "adapter", "agentic"],
        "content": """OpenGradient integrates with LangChain and LangGraph for building autonomous agents.

Create a LangChain-compatible LLM:

    import opengradient as og
    from langgraph.prebuilt import create_react_agent
    from langchain_core.tools import tool

    # Create OG LangChain adapter
    llm = og.agents.langchain_adapter(
        private_key=os.environ.get("OG_PRIVATE_KEY"),
        model_cid=og.TEE_LLM.GPT_4_1_2025_04_14,
        max_tokens=300,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
    )

Define tools using LangChain's @tool decorator:

    @tool
    def get_token_price(token: str) -> str:
        # Get current price for a crypto token.
        # Your implementation here
        return f"{token} price: $1234"

    @tool
    def check_wallet_balance(address: str) -> str:
        # Check OPG balance for an Ethereum address.
        # Your implementation here
        return f"Balance: 100 OPG"

Create and run a ReAct agent:

    # IMPORTANT: ensure Permit2 approval before running agent
    llm = og.LLM(private_key=os.environ.get("OG_PRIVATE_KEY"))
    llm.ensure_opg_approval(opg_amount=10.0)

    tools = [get_token_price, check_wallet_balance]
    agent = create_react_agent(llm, tools)

    result = agent.invoke({
        "messages": [{"role": "user", "content": "What is the OPG token price?"}]
    })

The adapter is fully compatible with LangChain's tool calling interface. The agent will automatically route calls through OpenGradient's TEE infrastructure.""",
    },
    {
        "id": "common-errors",
        "title": "Common Errors & Troubleshooting",
        "url": "https://docs.opengradient.ai/developers/sdk",
        "section": "Python SDK",
        "tags": ["errors", "troubleshooting", "debug", "wsl", "windows", "permit2", "funds", "zkml", "stream"],
        "content": """Common errors and how to fix them:

1. Windows installation fails
   Error: Various import errors or build failures on Windows
   Fix: Use WSL (Windows Subsystem for Linux). pip install opengradient==0.9.0 inside WSL.
   Status: Native Windows fix is in progress.

2. Permit2 not approved
   Error: "Permit2 allowance insufficient" or similar authorization error
   Fix: Call llm.ensure_opg_approval(opg_amount=10.0) before any LLM call.
   This must be called at least once. It is idempotent — safe to call every startup.

3. Insufficient $OPG funds
   Error: "Insufficient balance" or payment failure
   Fix: Get $OPG tokens from https://faucet.opengradient.ai/ on Base Sepolia.
   Check balance: view wallet in MetaMask connected to Base Sepolia (Chain ID 84532).

4. Alpha testnet inference failing
   Error: Connection refused or auth error on client.alpha.infer()
   Fix: Check OG_ALPHA_PRIVATE_KEY env var (falls back to OG_PRIVATE_KEY if not set).
   Also verify you have an alpha testnet account at hub.opengradient.ai.

5. Model Hub authentication failing
   Error: 401 Unauthorized when calling model_hub methods
   Fix: Verify email and password match your hub.opengradient.ai account.
   Re-run opengradient config init to reset credentials.

6. CLI not configured
   Error: "No configuration found" or similar
   Fix: Run opengradient config init — the guided wizard sets up all credentials.

7. ZKML inference failing
   Error: "Unsupported opset" or shape/type errors
   Fix: Ensure ONNX opset 9-18, numeric-only inputs, no mixed static/dynamic shapes.
   Test with VANILLA mode first to confirm the model loads correctly.

8. Stream not yielding content
   Error: Stream iterates but content is empty
   Fix: Check chunk.choices[0].delta.content is not None before yielding.
   The content field can be None on the first and last chunks.""",
    },
]

