from fastapi import APIRouter, Request, HTTPException
import os
import hmac
import hashlib
import json
from db.models import SessionLocal, Transcript
from datetime import datetime

router = APIRouter()

VAPI_WEBHOOK_SECRET = os.getenv("VAPI_WEBHOOK_SECRET")

@router.post("/webhook/vapi")
async def vapi_webhook(request: Request):
    # Verify webhook signature if provided by Vapi.ai
    signature = request.headers.get("X-Vapi-Signature")
    body = await request.body()
    if VAPI_WEBHOOK_SECRET and signature:
        expected = hmac.new(VAPI_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            raise HTTPException(status_code=401, detail="Invalid signature")
    data = json.loads(body)
    # Save transcript to DB
    db = SessionLocal()
    transcript = Transcript(
        call_id=data["call_id"],
        speaker=data["speaker"],
        timestamp=datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00")),
        text=data["text"]
    )
    db.add(transcript)
    db.commit()
    db.close()
    print("Saved transcript:", data)
    return {"status": "ok"}
