from collections import Counter

from app.config import settings
from app.rag.embeddings import get_embeddings, tokenize
from app.rag.knowledge_base import DOCS


TITLE_WEIGHT = 1.5
SECTION_WEIGHT = 1.2
TAG_WEIGHT = 1.0
CONTENT_WEIGHT = 0.75
EXACT_PHRASE_BOOST = 2.0
PARTIAL_QUERY_BOOST = 1.0



def retrieve(query: str, top_k: int = None) -> list[dict]:
    """Retrieve the most relevant documentation chunks for a query.

    This uses a lightweight token-overlap and TF-IDF-style scorer so the app
    can run on small instances without loading a transformer embedding model.
    """
    k = top_k or settings.TOP_K_CHUNKS
    index = get_embeddings()
    query_text = query.lower().strip()
    query_tokens = tokenize(query_text)

    if not query_tokens:
        return []

    query_counts = Counter(query_tokens)
    idf = index['idf']
    results = []

    for i, doc in enumerate(DOCS):
        doc_index = index['docs'][i]
        token_counts = doc_index['token_counts']
        token_set = doc_index['token_set']

        overlap = len(set(query_tokens) & token_set)
        if overlap == 0 and query_text not in doc_index['searchable_text']:
            continue

        score = 0.0
        for token, query_count in query_counts.items():
            if token not in token_counts:
                continue
            token_weight = idf.get(token, 1.0)
            score += min(token_counts[token], query_count + 1) * token_weight

        title_text = doc['title'].lower()
        section_text = doc['section'].lower()
        tag_text = ' '.join(doc['tags']).lower()
        content_text = doc['content'].lower()

        for token in set(query_tokens):
            if token in title_text:
                score += TITLE_WEIGHT
            if token in section_text:
                score += SECTION_WEIGHT
            if token in tag_text:
                score += TAG_WEIGHT
            if token in content_text:
                score += CONTENT_WEIGHT

        if query_text and query_text in doc_index['searchable_text']:
            score += EXACT_PHRASE_BOOST
        elif overlap >= max(2, len(set(query_tokens)) // 2):
            score += PARTIAL_QUERY_BOOST

        results.append({**doc, 'score': round(score, 3)})

    results.sort(key=lambda item: item['score'], reverse=True)
    return results[:k]
