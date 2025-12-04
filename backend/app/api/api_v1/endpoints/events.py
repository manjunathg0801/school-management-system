from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.event import Holiday
from app.schemas import event as event_schemas
from app.api.api_v1.endpoints.auth import get_db

router = APIRouter()

@router.get("/", response_model=List[event_schemas.Holiday])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve holidays and events.
    """
    events = db.query(Holiday).order_by(Holiday.date).offset(skip).limit(limit).all()
    return events

@router.post("/", response_model=event_schemas.Holiday)
def create_event(event_in: event_schemas.HolidayCreate, db: Session = Depends(get_db)):
    """
    Create a new event or holiday.
    """
    event = Holiday(**event_in.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
