# OG AI

> The OpenGradient builder copilot. Docs-grounded. TEE-verified.

## What is OG AI?

OG AI is a production-ready developer copilot for the OpenGradient ecosystem. Every answer is:
- **Grounded** in the official OpenGradient documentation (RAG over real doc chunks)
- **Generated** through OpenGradient's own TEE LLM inference (`opengradient==0.9.0`)
- **Verified** on-chain via SETTLE_METADATA — every response produces a cryptographic attestation and Base Sepolia transaction hash

## Features

- **Ask Docs** — RAG-powered Q&A over official OG documentation
- **Debug Error** — Paste an error/traceback, get root cause + fix with doc citations
- **Build Planner** — Describe an app idea, receive a structured OG architecture plan
- **Snippet Mode** — Get minimal working code examples grounded in the 0.9.0 SDK
- Streaming responses via SSE
- Source citations with links to official docs
- Attestation badge on every AI message (TEE verified)
- On-chain payment hash via SETTLE_METADATA
- Recent question history

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 19 + TailwindCSS v3 |
| Backend | Python + FastAPI |
| AI Inference | `opengradient==0.9.0` (TEE LLM) |
| RAG | `sentence-transformers` (all-MiniLM-L6-v2) + cosine similarity |
| Streaming | `sse-starlette` (backend) + `ReadableStream` (frontend) |
| Payments | $OPG on Base Sepolia via x402 |
| Deploy | Vercel (frontend) + Render (backend) |

## Prerequisites

- Python 3.10+
- Node.js 18+
- An Ethereum wallet with $OPG testnet tokens on Base Sepolia
  - Get tokens: https://faucet.opengradient.ai/
  - $OPG token: `0x240b09731D96979f50B2C649C9CE10FcF9C7987F`

## Setup — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows (WSL): source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # Add your OG_PRIVATE_KEY
uvicorn app.main:app --reload
```

The backend will:
1. Initialize the OpenGradient client
2. Run `ensure_opg_approval(10.0)` — one-time Permit2 authorization
3. Build sentence-transformer embeddings for all 26 doc chunks

Backend runs at: http://localhost:8000

## Setup — Frontend

```bash
cd frontend
npm install
cp .env.example .env            # Set VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at: http://localhost:5173

## Environment Variables

### backend/.env

| Variable | Required | Description |
|----------|----------|-------------|
| `OG_PRIVATE_KEY` | Yes | `0x`-prefixed Ethereum private key, wallet funded with $OPG on Base Sepolia |
| `CORS_ORIGINS` | No | Comma-separated allowed origins. Default: `http://localhost:5173` |
| `OG_MODEL` | No | TEE LLM model key. Default: `GEMINI_2_5_FLASH` |
| `TOP_K_CHUNKS` | No | Number of RAG chunks to retrieve per query. Default: `5` |

### frontend/.env

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL. Default: `http://localhost:8000` |

## How It Works

```
User Query
    │
    ▼
RAG Retrieval (sentence-transformers cosine similarity)
    │
    ├─ Top 5 doc chunks retrieved from knowledge base
    │
    ▼
Prompt Construction (system + context + history + query)
    │
    ▼
og.client.llm.chat() → TEE Node (Intel TDX)
    │                        │
    │                        └─ Routes to: OpenAI / Anthropic / Google / xAI
    │
    ├─ Streaming chunks → SSE → Frontend ReadableStream
    │
    └─ payment_hash → Base Sepolia tx (SETTLE_METADATA)
                          │
                          └─ Attestation badge in UI
```

## Deployment

### Backend (Render)

1. Connect your GitHub repo to Render
2. Create a new **Web Service**
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `OG_PRIVATE_KEY`, `CORS_ORIGINS` (your Vercel URL)

> Note: First deploy downloads sentence-transformers model (~90MB) — may take 2-3 minutes.

### Frontend (Vercel)

1. Import the frontend folder to Vercel
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-render-service.onrender.com`

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/health` | GET | Backend health check |
| `POST /api/ask` | POST | Main Q&A (streaming SSE or non-streaming) |
| `POST /api/debug` | POST | Error debugging |
| `POST /api/plan` | POST | Build planning |
| `GET /api/sources` | GET | All knowledge base chunk summaries |

## Knowledge Base

26 documentation chunks covering:
- SDK installation and credentials
- LLM chat and completion APIs
- Streaming, tool calling, settlement modes
- TEE verification and supported models
- x402 Gateway (HTTP and JavaScript)
- ML inference and workflows (alpha testnet)
- Official workflow contract addresses
- Model Hub management
- MemSync memory layer
- Network info (RPC, explorer, faucet)
- LangChain integration
- Common errors and troubleshooting

## License

MIT
