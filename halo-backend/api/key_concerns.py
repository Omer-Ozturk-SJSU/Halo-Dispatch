# POST endpoint for Orkes key concerns agent

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.ai_prompts import ai_service

router = APIRouter()

class TranscriptRequest(BaseModel):
    call_id: str
    transcript: str

class ConcernsResponse(BaseModel):
    call_id: str
    concerns: List[str]

@router.post("/api/ai/key-concerns", response_model=ConcernsResponse)
async def get_key_concerns(request: TranscriptRequest):
    """
    Endpoint for Orkes key concerns agent to extract safety concerns from a 911 call transcript.
    Returns a list of concerns from a predefined set of categories.
    """
    try:
        concerns = await ai_service.get_key_concerns(request.transcript)
        return ConcernsResponse(call_id=request.call_id, concerns=concerns)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
