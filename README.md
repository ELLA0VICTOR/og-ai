# OG AI

> OpenGradient builder copilot. Docs-grounded. TEE-backed. Deployment-ready.

## What It Is

OG AI is a specialized developer assistant for the OpenGradient ecosystem. It helps builders:
- ask questions about the docs
- debug integration and deployment issues
- plan OpenGradient-native app architectures
- generate current SDK snippets

The app uses:
- a local RAG layer over curated OpenGradient documentation
- OpenGradient TEE LLM inference through `opengradient==0.9.0`
- a React + Vite frontend
- a FastAPI backend

## Modes

- `Ask Docs`: docs-grounded Q&A over OpenGradient concepts and SDK usage
- `Debug Error`: troubleshooting for payment, deployment, CORS, DNS, approval, and runtime issues
- `Build Planner`: structured architecture plans for OpenGradient apps
- `Snippet Mode`: minimal working examples aligned to the current SDK surface

## Current SDK Surface

OG AI is intentionally biased toward the current direct-entrypoint SDK style:
- `llm = og.LLM(private_key=...)`
- `await llm.chat(...)`
- `await llm.completion(...)`
- `alpha = og.Alpha(private_key=...)`
- `alpha.infer(model_cid=..., inference_mode=..., model_input=...)`
- `hub = og.ModelHub(email=..., password=...)`

It is designed to correct stale `client.*` examples instead of reinforcing them.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React + Vite |
| Backend | FastAPI + Uvicorn |
| SDK | `opengradient==0.9.0` |
| Retrieval | `sentence-transformers` + cosine similarity |
| Streaming | SSE |
| Payments | $OPG on Base Sepolia via x402 |
| Deploy | Vercel + Render |

## Project Structure

```text
og-ai/
├─ backend/
│  ├─ app/
│  ├─ requirements.txt
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  └─ .env.example
└─ README.md
```

## Prerequisites

- Python 3.12 recommended
- Node.js 18+
- Base Sepolia wallet with:
  - `$OPG` for OpenGradient requests
  - Base Sepolia ETH for approval / gas when needed

## Local Development

### Backend

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
```

Backend URL:
- `http://localhost:8000`

Notes:
- use `python -m uvicorn ...` so the project venv is definitely used
- the backend will try a best-effort approval check at startup
- if Base Sepolia DNS or wallet state is unhealthy, startup should warn instead of crashing

### Frontend

```cmd
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## Environment Variables

### `backend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `OG_PRIVATE_KEY` | Yes | Backend wallet private key used for OpenGradient requests |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |
| `OG_MODEL` | No | Default TEE model value, e.g. `google/gemini-2.5-flash` |
| `OG_SETTLEMENT_MODE` | No | `PRIVATE`, `BATCH_HASHED`, or `INDIVIDUAL_FULL`. Default: `BATCH_HASHED` |
| `TOP_K_CHUNKS` | No | Number of retrieved docs chunks per query |
| `OG_LLM_SERVER_URL` | No | Optional low-level LLM endpoint override. Leave unset unless intentionally pinning a known endpoint |

### `frontend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | No | Backend base URL. Default: `http://localhost:8000` |

## Runtime Notes

- `BATCH_HASHED` is the safer default for normal OG AI testing because it is cheaper than forcing full settlement for every request.
- If live inference hits a real `402 Payment Required`, OG AI now returns a structured diagnostic answer instead of just surfacing the raw upstream error.
- The most common live failure buckets are:
  - insufficient `$OPG`
  - missing Permit2 approval
  - no Base Sepolia ETH for approval gas
  - stale `OG_LLM_SERVER_URL` override
  - deployed env / SDK / interpreter drift

## API

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | health check |
| `/api/ask` | `POST` | main docs / debug / planner / snippet route |
| `/api/sources` | `GET` | knowledge-base source summaries |

## Deployment

### Render Backend

Use these settings:
- Service type: `Web Service`
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Recommended Render env vars:

```env
OG_PRIVATE_KEY=0x...
CORS_ORIGINS=https://your-frontend.vercel.app
OG_MODEL=google/gemini-2.5-flash
OG_SETTLEMENT_MODE=BATCH_HASHED
TOP_K_CHUNKS=5
```

Optional only if intentionally pinned:

```env
OG_LLM_SERVER_URL=https://your-tee-endpoint
```

### Vercel Frontend

If deploying the full repo:
- Root directory: `frontend`
- Framework preset: `Vite`

Environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

## GitHub Push Checklist

Before pushing:
- make sure `.env` files are ignored
- make sure no private key is committed
- confirm `backend/.env.example` and `frontend/.env.example` are present
- confirm README matches current deployment flow

Typical commands:

```cmd
cd C:\Users\hp\Desktop\og-ai
git status
git add .
git commit -m "Finalize OG AI for deployment"
git push origin main
```

## Suggested Smoke Tests

After deployment, test these:
1. `Ask Docs`: `Explain when I should choose og.LLM vs og.Alpha vs og.ModelHub.`
2. `Snippet Mode`: `Show me a FastAPI route that calls og.LLM and returns content plus metadata.`
3. `Debug Error`: `My Render backend works locally but deployed requests fail with CORS in the browser.`
4. `Build Planner`: `I want to build a verifiable AI due diligence app on OpenGradient with React + FastAPI. What architecture should I use?`

## License

MIT
