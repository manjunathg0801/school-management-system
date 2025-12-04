from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.api_v1.endpoints.auth import get_db
from app.models.attendance import Attendance
from app.models.student import StudentProfile
from app.schemas.attendance import Attendance as AttendanceSchema, AttendanceCreate

router = APIRouter()

@router.get("/", response_model=List[AttendanceSchema])
def read_attendance(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    class_grade: Optional[str] = None,
    section: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve attendance records.
    """
    query = db.query(Attendance)
    
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    if class_grade:
        query = query.filter(Attendance.class_grade == class_grade)
    if section:
        query = query.filter(Attendance.section == section)
    if date_from:
        query = query.filter(Attendance.date >= date_from)
    if date_to:
        query = query.filter(Attendance.date <= date_to)
        
    return query.offset(skip).limit(limit).all()

@router.post("/batch", response_model=List[AttendanceSchema])
def mark_batch_attendance(
    attendance_in: List[AttendanceCreate],
    db: Session = Depends(get_db)
) -> Any:
    """
    Mark attendance for multiple students.
    """
    created_records = []
    for record in attendance_in:
        # Check if attendance already exists for this student on this date
        existing = db.query(Attendance).filter(
            Attendance.student_id == record.student_id,
            Attendance.date == record.date
        ).first()
        
        if existing:
            # Update existing
            for key, value in record.dict().items():
                setattr(existing, key, value)
            db.add(existing)
            created_records.append(existing)
        else:
            # Create new
            new_record = Attendance(**record.dict())
            db.add(new_record)
            created_records.append(new_record)
            
    db.commit()
    for record in created_records:
        db.refresh(record)
        
    return created_records
