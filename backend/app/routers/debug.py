from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import get_response

router = APIRouter()


class DebugRequest(BaseModel):
    error: str
    context: str = ""


@router.post("/debug")
async def debug_endpoint(body: DebugRequest):
    """Debug an OpenGradient integration error."""
    question = body.error
    if body.context:
        question = f"Error:\n{body.error}\n\nAdditional context:\n{body.context}"

    try:
        result = get_response(question, mode="debug")
        return result
    except Exception as e:
        return {
            "content": f"Error analyzing the error: {str(e)}",
            "payment_hash": None,
            "sources": [],
        }
