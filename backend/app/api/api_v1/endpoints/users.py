from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.student import StudentProfile, ParentProfile, Address, EmergencyContact
from app.schemas import student as student_schemas
from app.api.api_v1.endpoints.auth import get_db
from app.core.security import get_password_hash

router = APIRouter()

# Helper to get current user (simplified for now, ideally use a proper dependency)
def get_current_user_id(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    return user.id

@router.get("/me/profile", response_model=student_schemas.StudentProfile)
def read_user_profile(email: str, db: Session = Depends(get_db)):
    """
    Get current user profile
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.student_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return user.student_profile

@router.put("/me/profile", response_model=student_schemas.StudentProfile)
def update_user_profile(
    email: str,
    profile_in: student_schemas.StudentProfileUpdate,
    db: Session = Depends(get_db)
):
    """
    Update current user profile
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    student_profile = user.student_profile
    if not student_profile:
        # Create if not exists
        student_profile = StudentProfile(user_id=user.id)
        db.add(student_profile)
        db.commit()
        db.refresh(student_profile)

    # Update basic fields
    profile_data = profile_in.dict(exclude_unset=True)
    for field in ["admission_number", "date_of_birth", "gender", "blood_group", "class_grade", "section"]:
        if field in profile_data and profile_data[field] is not None:
            setattr(student_profile, field, profile_data[field])

    # Update Relations
    if profile_in.address:
        if not student_profile.address:
            student_profile.address = Address(student_profile_id=student_profile.id)
        
        addr_data = profile_in.address.dict(exclude_unset=True)
        for k, v in addr_data.items():
            setattr(student_profile.address, k, v)

    if profile_in.parent_profile:
        if not student_profile.parent_profile:
            student_profile.parent_profile = ParentProfile(student_profile_id=student_profile.id)
        
        parent_data = profile_in.parent_profile.dict(exclude_unset=True)
        for k, v in parent_data.items():
            setattr(student_profile.parent_profile, k, v)

    if profile_in.emergency_contact:
        if not student_profile.emergency_contact:
            student_profile.emergency_contact = EmergencyContact(student_profile_id=student_profile.id)
        
        contact_data = profile_in.emergency_contact.dict(exclude_unset=True)
        for k, v in contact_data.items():
            setattr(student_profile.emergency_contact, k, v)

    db.commit()
    db.refresh(student_profile)
    db.commit()
    db.refresh(student_profile)
    db.refresh(student_profile)
    return student_profile

@router.get("/students", response_model=List[student_schemas.StudentProfile])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all students.
    """
    students = db.query(StudentProfile).offset(skip).limit(limit).all()
    return students

@router.post("/students", response_model=student_schemas.StudentProfile)
def create_student(
    student_in: student_schemas.StudentCreate,
    db: Session = Depends(get_db)
):
    """
    Create new student and user account.
    """
    # Check if user exists
    user = db.query(User).filter(User.email == student_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create User
    user = User(
        email=student_in.email,
        hashed_password=get_password_hash(student_in.password),
        full_name=student_in.full_name,
        role="student"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create Student Profile
    student_profile = StudentProfile(
        user_id=user.id,
        admission_number=student_in.admission_number,
        date_of_birth=student_in.date_of_birth,
        gender=student_in.gender,
        blood_group=student_in.blood_group,
        class_grade=student_in.class_grade,
        section=student_in.section,
        photo_url=student_in.photo_url
    )
    db.add(student_profile)
    db.commit()
    db.refresh(student_profile)

    # Create Relations
    if student_in.address:
        address = Address(
            student_profile_id=student_profile.id,
            **student_in.address.dict()
        )
        db.add(address)

    if student_in.parent_profile:
        parent = ParentProfile(
            student_profile_id=student_profile.id,
            **student_in.parent_profile.dict()
        )
        db.add(parent)

    if student_in.emergency_contact:
        contact = EmergencyContact(
            student_profile_id=student_profile.id,
            **student_in.emergency_contact.dict()
        )
        db.add(contact)

    db.commit()
    db.refresh(student_profile)
    return student_profile

@router.get("/students/{student_id}", response_model=student_schemas.StudentProfile)
def read_student(student_id: int, db: Session = Depends(get_db)):
    """
    Get student by ID.
    """
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=student_schemas.StudentProfile)
def update_student(
    student_id: int,
    profile_in: student_schemas.StudentProfileUpdate,
    db: Session = Depends(get_db)
):
    """
    Update student by ID.
    """
    student_profile = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student not found")

    # Update basic fields
    profile_data = profile_in.dict(exclude_unset=True)
    for field in ["admission_number", "date_of_birth", "gender", "blood_group", "class_grade", "section"]:
        if field in profile_data and profile_data[field] is not None:
            setattr(student_profile, field, profile_data[field])

    # Update Relations
    if profile_in.address:
        if not student_profile.address:
            student_profile.address = Address(student_profile_id=student_profile.id)
        
        addr_data = profile_in.address.dict(exclude_unset=True)
        for k, v in addr_data.items():
            setattr(student_profile.address, k, v)

    if profile_in.parent_profile:
        if not student_profile.parent_profile:
            student_profile.parent_profile = ParentProfile(student_profile_id=student_profile.id)
        
        parent_data = profile_in.parent_profile.dict(exclude_unset=True)
        for k, v in parent_data.items():
            setattr(student_profile.parent_profile, k, v)

    if profile_in.emergency_contact:
        if not student_profile.emergency_contact:
            student_profile.emergency_contact = EmergencyContact(student_profile_id=student_profile.id)
        
        contact_data = profile_in.emergency_contact.dict(exclude_unset=True)
        for k, v in contact_data.items():
            setattr(student_profile.emergency_contact, k, v)

    db.commit()
    db.refresh(student_profile)
    return student_profile
