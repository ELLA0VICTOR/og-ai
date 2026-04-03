import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.rag.retrieval import retrieve
from app.services.llm_service import get_response, stream_response

router = APIRouter()


class AskRequest(BaseModel):
    question: str
    mode: str = 'ask'  # ask | debug | plan | snippet
    history: list = Field(default_factory=list)
    stream: bool = True


@router.post('/ask')
async def ask_endpoint(body: AskRequest):
    if body.stream:
        chunks_for_sources = retrieve(body.question)
        sources_data = [
            {
                'id': c['id'],
                'title': c['title'],
                'url': c['url'],
                'section': c['section'],
            }
            for c in chunks_for_sources
        ]

        async def event_stream():
            yield f"data: {json.dumps({'type': 'sources', 'sources': sources_data})}\n\n"
            try:
                async for text in stream_response(body.question, body.mode, body.history):
                    yield f"data: {json.dumps({'type': 'chunk', 'content': text})}\n\n"
            except Exception as exc:
                yield f"data: {json.dumps({'type': 'error', 'message': str(exc)})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        return StreamingResponse(
            event_stream(),
            media_type='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no',
                'Connection': 'keep-alive',
            },
        )

    try:
        return await get_response(body.question, body.mode, body.history)
    except Exception as exc:
        return {
            'content': f'Error generating response: {str(exc)}',
            'payment_hash': None,
            'sources': [],
        }
