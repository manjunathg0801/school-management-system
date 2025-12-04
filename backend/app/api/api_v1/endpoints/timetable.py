from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.timetable import Timetable
from app.models.user import User
from app.schemas.timetable import Timetable as TimetableSchema

router = APIRouter()

@router.get("/", response_model=List[TimetableSchema])
def read_timetable(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve timetable for the current student's class and section.
    """
    if not current_user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    profile = current_user.student_profile
    
    timetable = (
        db.query(Timetable)
        .filter(
            Timetable.class_grade == profile.class_grade,
            Timetable.section == profile.section
        )
        .order_by(Timetable.day_of_week, Timetable.start_time)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return timetable
