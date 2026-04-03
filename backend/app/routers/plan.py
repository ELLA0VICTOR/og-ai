from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import get_response

router = APIRouter()


class PlanRequest(BaseModel):
    idea: str


@router.post("/plan")
async def plan_endpoint(body: PlanRequest):
    """Generate a structured build plan for an OpenGradient application."""
    try:
        result = get_response(body.idea, mode="plan")
        return result
    except Exception as e:
        return {
            "content": f"Error generating plan: {str(e)}",
            "payment_hash": None,
            "sources": [],
        }
