from fastapi import APIRouter
from app.rag.knowledge_base import DOCS

router = APIRouter()


@router.get("/sources")
async def get_sources():
    """Return all knowledge base chunk summaries."""
    return {
        "sources": [
            {
                "id": doc["id"],
                "title": doc["title"],
                "url": doc["url"],
                "section": doc["section"],
                "tags": doc["tags"],
            }
            for doc in DOCS
        ]
    }
