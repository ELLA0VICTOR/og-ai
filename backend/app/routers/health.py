from fastapi import APIRouter
from app.og_client import get_llm
from app.rag.embeddings import is_embeddings_loaded
from app.rag.knowledge_base import DOCS

router = APIRouter()


@router.get('/health')
async def health_check():
    """Check backend health and whether the lightweight retrieval index has warmed."""
    og_llm_ok = False
    try:
        llm = get_llm()
        og_llm_ok = llm is not None
    except Exception:
        og_llm_ok = False

    retrieval_index_loaded = is_embeddings_loaded()

    status = 'ok' if og_llm_ok else 'degraded'

    return {
        'status': status,
        'og_llm': og_llm_ok,
        'retrieval_index_loaded': retrieval_index_loaded,
        'chunk_count': len(DOCS),
    }
