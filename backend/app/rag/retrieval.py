import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.rag.knowledge_base import DOCS
from app.rag.embeddings import get_embedding_model, get_embeddings
from app.config import settings


def retrieve(query: str, top_k: int = None) -> list[dict]:
    """Retrieve the most relevant documentation chunks for a query.
    
    Uses cosine similarity over sentence-transformer embeddings plus
    a small keyword-boost heuristic for tag/title matches.
    """
    k = top_k or settings.TOP_K_CHUNKS
    model = get_embedding_model()
    embeddings = get_embeddings()

    query_emb = model.encode([query], normalize_embeddings=True)
    scores = cosine_similarity(query_emb, embeddings)[0].copy()

    # Keyword boost: if meaningful query words appear in title/tags, boost score
    query_lower = query.lower()
    query_words = [w for w in query_lower.split() if len(w) > 3]
    for i, doc in enumerate(DOCS):
        tag_text = " ".join(doc["tags"]) + " " + doc["title"].lower() + " " + doc["section"].lower()
        if any(word in tag_text for word in query_words):
            scores[i] = min(1.0, scores[i] + 0.05)

    top_indices = np.argsort(scores)[::-1][:k]

    results = []
    for i in top_indices:
        if scores[i] > 0.15:  # minimum relevance threshold
            results.append({**DOCS[i], "score": float(scores[i])})

    return results
