from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.fee import Fee
from app.models.user import User
from app.schemas.fee import Fee as FeeSchema

router = APIRouter()

@router.get("/", response_model=List[FeeSchema])
def read_fees(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve fees for the current student.
    """
    if not current_user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    fees = (
        db.query(Fee)
        .filter(Fee.student_id == current_user.student_profile.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return fees
