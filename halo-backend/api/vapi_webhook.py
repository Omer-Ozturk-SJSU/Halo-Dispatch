from fastapi import APIRouter, Request, HTTPException, Depends
import os
import hmac
import hashlib
import json
from datetime import datetime
from sqlalchemy.orm import Session
from db.models import get_db, Call, Transcript, User

router = APIRouter()

VAPI_WEBHOOK_SECRET = os.getenv("VAPI_WEBHOOK_SECRET")
DISPATCHER_PHONE_NUMBER = os.getenv("DISPATCHER_PHONE_NUMBER", "+1234567890")  # Set your dispatcher's number

@router.post("/webhook/vapi")
async def vapi_webhook(request: Request, db: Session = Depends(get_db)):
    # Verify webhook signature if provided by Vapi.ai
    signature = request.headers.get("X-Vapi-Signature")
    body = await request.body()
    if VAPI_WEBHOOK_SECRET and signature:
        expected = hmac.new(VAPI_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    data = json.loads(body)
    print("Received VAPI webhook:", data)
    
    message_type = data.get("message", {}).get("type")
    
    if message_type == "function-call":
        # Handle function calls (for call forwarding setup)
        return await handle_function_call(data, db)
    elif message_type == "transcript":
        # Handle live transcription
        return await handle_transcript(data, db)
    elif message_type == "call-start":
        # Handle call start
        return await handle_call_start(data, db)
    elif message_type == "call-end":
        # Handle call end
        return await handle_call_end(data, db)
    else:
        print(f"Unhandled message type: {message_type}")
        return {"status": "ok"}

async def handle_function_call(data, db: Session):
    """Handle function calls - primarily for call forwarding"""
    function_call = data.get("message", {}).get("functionCall", {})
    function_name = function_call.get("name")
    
    if function_name == "transferCall":
        # Return call transfer instruction
        return {
            "results": [{
                "toolCallId": function_call.get("id"),
                "result": {
                    "forward_to": DISPATCHER_PHONE_NUMBER,
                    "message": "Transferring emergency call to dispatcher..."
                }
            }]
        }
    
    return {"status": "ok"}

async def handle_transcript(data, db: Session):
    """Handle live transcription data"""
    message = data.get("message", {})
    call_id = data.get("call", {}).get("id")
    
    # Extract transcript information
    transcript_data = message.get("transcript", {})
    speaker = "CALLER" if transcript_data.get("role") == "user" else "DISPATCHER"
    text = transcript_data.get("text", "")
    timestamp = datetime.now()
    
    if not text.strip():
        return {"status": "ok"}
    
    # Find or create call record
    db_call = db.query(Call).filter(Call.external_call_id == call_id).first()
    if not db_call:
        # Create a new call record
        # For now, create a generic user - in production you'd want to identify the caller
        user = db.query(User).first()
        if not user:
            user = User(name="Unknown Caller", address="Unknown")
            db.add(user)
            db.commit()
            db.refresh(user)
        
        db_call = Call(
            user_id=user.id,
            external_call_id=call_id,
            timestamp=timestamp,
            status="active"
        )
        db.add(db_call)
        db.commit()
        db.refresh(db_call)
    
    # Save transcript
    transcript = Transcript(
        call_id=db_call.id,
        speaker=speaker,
        timestamp=timestamp,
        text=text
    )
    db.add(transcript)
    db.commit()
    
    print(f"Saved transcript: {speaker}: {text}")
    
    # TODO: Trigger AI analysis via Orkes workflow
    # TODO: Publish to websocket for real-time updates
    
    return {"status": "ok"}

async def handle_call_start(data, db: Session):
    """Handle call start event"""
    call_data = data.get("call", {})
    call_id = call_data.get("id")
    
    print(f"Call started: {call_id}")
    
    # Immediate call forwarding instruction
    return {
        "assistant": {
            "name": "Emergency Dispatch Forwarder",
            "model": {
                "provider": "openai",
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": f"You are an emergency call forwarder. Immediately transfer this call to {DISPATCHER_PHONE_NUMBER} and start transcribing. Do not engage in conversation."
                    }
                ]
            },
            "voice": {
                "provider": "11labs",
                "voiceId": "rachel"
            },
            "functions": [
                {
                    "name": "transferCall",
                    "description": "Transfer the call to the dispatcher",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "reason": {
                                "type": "string",
                                "description": "Reason for transfer"
                            }
                        }
                    }
                }
            ],
            "firstMessage": f"Emergency services, transferring you to a dispatcher now..."
        }
    }

async def handle_call_end(data, db: Session):
    """Handle call end event"""
    call_data = data.get("call", {})
    call_id = call_data.get("id")
    
    # Update call status to completed
    db_call = db.query(Call).filter(Call.external_call_id == call_id).first()
    if db_call:
        db_call.status = "completed"
        db.commit()
    
    print(f"Call ended: {call_id}")
    return {"status": "ok"}
