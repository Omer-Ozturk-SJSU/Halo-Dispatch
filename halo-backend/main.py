from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Import and include the VAPI webhook router
from api import vapi_webhook, test_vapi
app.include_router(vapi_webhook.router)
app.include_router(test_vapi.router)

# Import the database models and engine
from db.models import Base, engine, User, get_db
from db.models import Transcript, AIInsight, Unit, Call
from db.models import SessionLocal
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    address: str = None
    medical_conditions: str = None
    allergies: str = None
    emergency_contact: str = None

class UserRead(BaseModel):
    id: int
    name: str
    address: str = None
    medical_conditions: str = None
    allergies: str = None
    emergency_contact: str = None
    class Config:
        orm_mode = True

@app.post("/users/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[UserRead])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}

@app.get("/")
def root():
    return {"status": "API running"}

class TranscriptRead(BaseModel):
    id: int
    call_id: int
    speaker: str
    timestamp: datetime
    text: str
    class Config:
        orm_mode = True

@app.get("/calls/{call_id}/transcripts", response_model=List[TranscriptRead])
def get_transcripts(call_id: int, db: Session = Depends(get_db)):
    transcripts = db.query(Transcript).filter(Transcript.call_id == call_id).order_by(Transcript.timestamp).all()
    return transcripts

class AIInsightRead(BaseModel):
    id: int
    call_id: int
    concern_tags: str
    urgency_score: int
    class Config:
        orm_mode = True

@app.get("/calls/{call_id}/ai-insights", response_model=AIInsightRead)
def get_ai_insight(call_id: int, db: Session = Depends(get_db)):
    insight = db.query(AIInsight).filter(AIInsight.call_id == call_id).order_by(AIInsight.id.desc()).first()
    if insight is None:
        raise HTTPException(status_code=404, detail="AI insight not found")
    return insight

class UnitRead(BaseModel):
    id: int
    call_id: int
    status: str
    eta: datetime = None
    location: str = None
    class Config:
        orm_mode = True

@app.get("/calls/{call_id}/units", response_model=List[UnitRead])
def get_units(call_id: int, db: Session = Depends(get_db)):
    units = db.query(Unit).filter(Unit.call_id == call_id).all()
    return units

class CallRead(BaseModel):
    id: int
    user_id: int
    timestamp: datetime
    current_score: int = None
    status: str
    class Config:
        orm_mode = True

@app.get("/calls/", response_model=List[CallRead])
def read_calls(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    calls = db.query(Call).offset(skip).limit(limit).all()
    return calls

@app.get("/calls/{call_id}", response_model=CallRead)
def read_call(call_id: int, db: Session = Depends(get_db)):
    call = db.query(Call).filter(Call.id == call_id).first()
    if call is None:
        raise HTTPException(status_code=404, detail="Call not found")
    return call

if __name__ == "__main__":
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # --- SEED DATA ---
    db = SessionLocal()
    # Create user
    user = User(
        name="Sarah Johnson",
        address="2495 Bancroft Way, Berkeley, CA",
        medical_conditions="Anxiety disorder; Previous concussion",
        allergies="Penicillin",
        emergency_contact="Linda Johnson (510) 555-6543"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create call
    call = Call(
        user_id=user.id,
        timestamp=datetime.now(),
        current_score=8,
        status="active"
    )
    db.add(call)
    db.commit()
    db.refresh(call)

    # Create transcripts
    transcript_data = [
        ("CALLER", "911, please help me...", 0),
        ("DISPATCHER", "911, what's your emergency?", 1),
        ("CALLER", "He hit me again... I think I'm bleeding. I'm hiding in the bathroom closet.", 2),
        ("DISPATCHER", "Stay calm. Where are you hurt?", 3)
    ]
    for i, (speaker, text, minutes) in enumerate(transcript_data):
        t = Transcript(
            call_id=call.id,
            speaker=speaker,
            timestamp=call.timestamp + timedelta(minutes=minutes),
            text=text
        )
        db.add(t)
    db.commit()

    # Create AI insight
    ai = AIInsight(
        call_id=call.id,
        concern_tags="Active domestic violence, Potential head injury, Perpetrator on scene",
        urgency_score=9
    )
    db.add(ai)
    db.commit()

    # Create a response unit
    unit = Unit(
        call_id=call.id,
        status="en_route",
        eta=call.timestamp + timedelta(minutes=5),
        location="37.8715,-122.2730"
    )
    db.add(unit)
    db.commit()
    print("Seed data inserted.")
    db.close()