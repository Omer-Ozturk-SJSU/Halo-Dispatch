# POST endpoint for Orkes urgency agent

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.ai_prompts import ai_service

router = APIRouter()

class TranscriptRequest(BaseModel):
    call_id: str
    transcript: str

class UrgencyResponse(BaseModel):
    call_id: str
    score: int

@router.post("/api/ai/urgency-score", response_model=UrgencyResponse)
async def get_urgency_score(request: TranscriptRequest):
    """
    Endpoint for Orkes urgency agent to get an urgency score for a 911 call transcript.
    Returns a score from 1 (not urgent) to 10 (life-threatening emergency).
    """
    try:
        score = await ai_service.get_urgency_score(request.transcript)
        return UrgencyResponse(call_id=request.call_id, score=score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
