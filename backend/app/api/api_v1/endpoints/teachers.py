from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.api.api_v1.endpoints.auth import get_db, get_password_hash
from app.models.user import User
from app.schemas import teacher as teacher_schemas

from app.models.teacher import TeacherProfile

router = APIRouter()

@router.get("/", response_model=List[teacher_schemas.Teacher])
def read_teachers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve teachers.
    """
    teachers = db.query(User).filter(User.role == "teacher").offset(skip).limit(limit).all()
    return teachers

@router.post("/", response_model=teacher_schemas.Teacher)
def create_teacher(
    *,
    db: Session = Depends(get_db),
    teacher_in: teacher_schemas.TeacherCreate,
) -> Any:
    """
    Create new teacher.
    """
    user = db.query(User).filter(User.email == teacher_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    hashed_password = get_password_hash(teacher_in.password)
    db_obj = User(
        email=teacher_in.email,
        hashed_password=hashed_password,
        full_name=teacher_in.full_name,
        role="teacher",
        is_active=teacher_in.is_active,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    if teacher_in.profile:
        profile_data = teacher_in.profile.dict()
        db_profile = TeacherProfile(
            user_id=db_obj.id,
            **profile_data
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)

    return db_obj

@router.get("/{teacher_id}", response_model=teacher_schemas.Teacher)
def read_teacher_by_id(
    teacher_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific teacher by id.
    """
    teacher = db.query(User).filter(User.id == teacher_id, User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.put("/{teacher_id}", response_model=teacher_schemas.Teacher)
def update_teacher(
    *,
    db: Session = Depends(get_db),
    teacher_id: int,
    teacher_in: teacher_schemas.TeacherUpdate,
) -> Any:
    """
    Update a teacher.
    """
    teacher = db.query(User).filter(User.id == teacher_id, User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    teacher_data = jsonable_encoder(teacher)
    update_data = teacher_in.dict(exclude_unset=True)
    
    # Handle profile update
    if "profile" in update_data:
        profile_data = update_data["profile"]
        del update_data["profile"]
        
        if teacher.teacher_profile:
            # Update existing profile
            for field, value in profile_data.items():
                setattr(teacher.teacher_profile, field, value)
        else:
            # Create new profile if it doesn't exist
            db_profile = TeacherProfile(user_id=teacher.id, **profile_data)
            db.add(db_profile)

    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        teacher.hashed_password = hashed_password

    for field in teacher_data:
        if field in update_data:
            setattr(teacher, field, update_data[field])
            
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher
