from fastapi import APIRouter, Request, HTTPException
import os
import hmac
import hashlib
import json

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
    # Example expected payload:
    # {
    #   "call_id": "abc123",
    #   "timestamp": "2025-06-21T14:34:12Z",
    #   "speaker": "caller",
    #   "text": "He hit me again... I'm bleeding. I'm hiding."
    # }
    print("Received VAPI transcript:", data)
    # TODO: Save to DB, publish to socket, trigger Orkes, etc.
    return {"status": "ok"}
