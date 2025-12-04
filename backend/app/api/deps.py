from typing import Generator
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_active_user(
    db: Session = Depends(get_db),
) -> User:
    # For now, since we have fake auth, we'll return the admin user
    # In a real app, we would parse the JWT token here
    user = db.query(User).filter(User.email == "admin@school.com").first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
