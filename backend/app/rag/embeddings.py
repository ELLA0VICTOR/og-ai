from __future__ import annotations

import math
import re
from collections import Counter
from typing import Any

from app.rag.knowledge_base import DOCS

STOPWORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'i', 'if',
    'in', 'into', 'is', 'it', 'my', 'of', 'on', 'or', 's', 'show', 'that', 'the',
    'this', 'to', 'use', 'what', 'when', 'with', 'you', 'your'
}

_TOKEN_RE = re.compile(r"[a-z0-9_./-]+")
_index: dict[str, Any] | None = None
_docs_ref: list[dict[str, Any]] | None = None


def tokenize(text: str) -> list[str]:
    tokens = _TOKEN_RE.findall(text.lower())
    return [token for token in tokens if len(token) > 2 and token not in STOPWORDS]



def build_embeddings() -> dict[str, Any]:
    global _index, _docs_ref

    doc_entries: list[dict[str, Any]] = []
    doc_freq: Counter[str] = Counter()

    for doc in DOCS:
        searchable_text = ' '.join([
            doc['title'],
            doc['section'],
            ' '.join(doc['tags']),
            doc['content'],
        ]).lower()
        tokens = tokenize(searchable_text)
        counts = Counter(tokens)
        doc_entries.append({
            'searchable_text': searchable_text,
            'token_counts': counts,
            'token_set': set(counts),
        })
        doc_freq.update(counts.keys())

    total_docs = max(1, len(DOCS))
    idf = {
        token: math.log((1 + total_docs) / (1 + freq)) + 1.0
        for token, freq in doc_freq.items()
    }

    _index = {
        'docs': doc_entries,
        'idf': idf,
    }
    _docs_ref = DOCS
    return _index



def get_embeddings() -> dict[str, Any]:
    global _index
    if _index is None or _docs_ref is not DOCS:
        build_embeddings()
    return _index



def is_embeddings_loaded() -> bool:
    return _index is not None
