from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey, Float, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
import enum

# MySQL connection string from .env
MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_DB = os.getenv('MYSQL_DB', 'halo_dispatch')

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Example transcript model
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Call(Base):
    __tablename__ = "calls"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    timestamp = Column(DateTime)
    current_score = Column(Integer)
    status = Column(String(32))  # active/completed
    transcripts = relationship("Transcript", back_populates="call")
    ai_insights = relationship("AIInsight", back_populates="call")
    units = relationship("Unit", back_populates="call")

class Transcript(Base):
    __tablename__ = "transcripts"
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey('calls.id'))
    speaker = Column(String(32))
    timestamp = Column(DateTime)
    text = Column(Text)
    call = relationship("Call", back_populates="transcripts")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey('calls.id'))
    concern_tags = Column(Text)  # store as comma-separated or JSON string
    urgency_score = Column(Integer)
    call = relationship("Call", back_populates="ai_insights")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128))
    address = Column(String(256))
    medical_conditions = Column(Text)
    allergies = Column(Text)
    emergency_contact = Column(String(128))
    calls = relationship("Call", backref="user")

class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey('calls.id'))
    status = Column(String(32))  # en_route/arrived
    eta = Column(DateTime)
    location = Column(String(128))  # lat,lng or address
    call = relationship("Call", back_populates="units")
