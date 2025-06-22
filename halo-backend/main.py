from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Import and include the VAPI webhook router
from api import vapi_webhook
app.include_router(vapi_webhook.router)

# Import the database models and engine
from db.models import Base, engine

@app.get("/")
def root():
    return {"status": "API running"}

if __name__ == "__main__":
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")