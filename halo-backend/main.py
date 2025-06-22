from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Import and include the VAPI webhook router
from api import vapi_webhook
app.include_router(vapi_webhook.router)

@app.get("/")
def root():
    return {"status": "API running"}