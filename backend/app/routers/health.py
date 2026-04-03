from fastapi import APIRouter
from app.og_client import get_llm
from app.rag.embeddings import is_embeddings_loaded
from app.rag.knowledge_base import DOCS

router = APIRouter()


@router.get("/health")
async def health_check():
    """Check backend health: OG client and embeddings status."""
    og_llm_ok = False
    try:
        llm = get_llm()
        og_llm_ok = llm is not None
    except Exception:
        og_llm_ok = False

    embeddings_ok = is_embeddings_loaded()

    status = "ok" if (og_llm_ok and embeddings_ok) else "degraded"

    return {
        "status": status,
        "og_llm": og_llm_ok,
        "embeddings_loaded": embeddings_ok,
        "chunk_count": len(DOCS),
    }

