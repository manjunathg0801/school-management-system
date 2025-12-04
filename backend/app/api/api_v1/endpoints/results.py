from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.api_v1.endpoints.auth import get_db
from app.models.result import Result
from app.models.student import StudentProfile
from app.schemas.result import Result as ResultSchema, ResultCreate

router = APIRouter()

@router.get("/", response_model=List[ResultSchema])
def read_results(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    exam_title: Optional[str] = None,
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve results.
    """
    query = db.query(Result)
    
    if student_id:
        query = query.filter(Result.student_id == student_id)
    if exam_title:
        query = query.filter(Result.exam_title == exam_title)
    if subject:
        query = query.filter(Result.subject == subject)
        
    return query.offset(skip).limit(limit).all()

@router.post("/batch", response_model=List[ResultSchema])
def create_batch_results(
    results_in: List[ResultCreate],
    db: Session = Depends(get_db)
) -> Any:
    """
    Create or update results for multiple students.
    """
    created_results = []
    for result in results_in:
        # Check if result already exists for this student, exam, and subject
        existing = db.query(Result).filter(
            Result.student_id == result.student_id,
            Result.exam_title == result.exam_title,
            Result.subject == result.subject
        ).first()
        
        if existing:
            # Update existing
            for key, value in result.dict().items():
                setattr(existing, key, value)
            db.add(existing)
            created_results.append(existing)
        else:
            # Create new
            new_result = Result(**result.dict())
            db.add(new_result)
            created_results.append(new_result)
            
    db.commit()
    for result in created_results:
        db.refresh(result)
        
    return created_results
