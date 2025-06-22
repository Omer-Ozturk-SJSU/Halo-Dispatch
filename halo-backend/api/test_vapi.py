from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.models import get_db, Call, Transcript
from datetime import datetime
import json

router = APIRouter()

@router.post("/test/vapi/call-start")
async def test_call_start(db: Session = Depends(get_db)):
    """Test endpoint to simulate a VAPI call start"""
    test_data = {
        "message": {
            "type": "call-start"
        },
        "call": {
            "id": "test_call_123",
            "from": "+1234567890", 
            "to": "+0987654321"
        }
    }
    
    # Import the webhook function
    from api.vapi_webhook import handle_call_start
    result = await handle_call_start(test_data, db)
    
    return {
        "status": "test_completed",
        "test_data": test_data,
        "webhook_response": result
    }

@router.post("/test/vapi/transcript")
async def test_transcript(db: Session = Depends(get_db)):
    """Test endpoint to simulate a VAPI transcript"""
    test_data = {
        "message": {
            "type": "transcript",
            "transcript": {
                "role": "user",
                "text": "Hello, I need help with an emergency!"
            }
        },
        "call": {
            "id": "test_call_123"
        }
    }
    
    # Import the webhook function  
    from api.vapi_webhook import handle_transcript
    result = await handle_transcript(test_data, db)
    
    return {
        "status": "test_completed", 
        "test_data": test_data,
        "webhook_response": result
    }

@router.get("/test/calls/{external_call_id}")
async def get_test_call(external_call_id: str, db: Session = Depends(get_db)):
    """Get call data by external VAPI call ID"""
    call = db.query(Call).filter(Call.external_call_id == external_call_id).first()
    if not call:
        return {"error": "Call not found"}
    
    transcripts = db.query(Transcript).filter(Transcript.call_id == call.id).all()
    
    return {
        "call": {
            "id": call.id,
            "external_call_id": call.external_call_id,
            "timestamp": call.timestamp,
            "status": call.status
        },
        "transcripts": [
            {
                "speaker": t.speaker,
                "text": t.text, 
                "timestamp": t.timestamp
            } for t in transcripts
        ]
    } 