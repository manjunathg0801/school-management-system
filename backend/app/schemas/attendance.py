from typing import Optional
from pydantic import BaseModel
from datetime import date

class AttendanceBase(BaseModel):
    date: date
    status: str
    remarks: Optional[str] = None
    class_grade: Optional[str] = None
    section: Optional[str] = None
    absence_type: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    student_id: int

class Attendance(AttendanceBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True
