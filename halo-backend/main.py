from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from typing import List

# Load environment variables from .env
load_dotenv()

app = FastAPI()

# Import and include the VAPI webhook router
from api import vapi_webhook
app.include_router(vapi_webhook.router)

# Import the database models and engine
from db.models import Base, engine, User, get_db
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

if __name__ == "__main__":
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")