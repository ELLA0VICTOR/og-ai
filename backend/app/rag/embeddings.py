from sentence_transformers import SentenceTransformer
import numpy as np
from app.rag.knowledge_base import DOCS

_model = None
_embeddings = None
_docs_ref = None


def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model


def build_embeddings() -> np.ndarray:
    global _embeddings, _docs_ref, _model
    _model = get_embedding_model()
    _docs_ref = DOCS
    texts = [
        f"{d['title']} {d['section']} {d['content']}"
        for d in DOCS
    ]
    _embeddings = _model.encode(texts, normalize_embeddings=True)
    return _embeddings


def get_embeddings() -> np.ndarray:
    global _embeddings
    if _embeddings is None:
        build_embeddings()
    return _embeddings


def is_embeddings_loaded() -> bool:
    return _embeddings is not None
