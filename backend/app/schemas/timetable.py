from typing import Optional
from pydantic import BaseModel
from datetime import time

class TimetableBase(BaseModel):
    day_of_week: str
    start_time: time
    end_time: time
    subject: str
    teacher: Optional[str] = None

class TimetableCreate(TimetableBase):
    class_grade: str
    section: str

class Timetable(TimetableBase):
    id: int
    class_grade: str
    section: str

    class Config:
        from_attributes = True
