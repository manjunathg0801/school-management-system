from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date

# Shared properties
class TeacherProfileBase(BaseModel):
    phone_number: Optional[str] = None
    address: Optional[str] = None
    qualification: Optional[str] = None
    subjects: Optional[str] = None
    date_of_joining: Optional[date] = None

class TeacherBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class TeacherCreate(TeacherBase):
    email: EmailStr
    password: str
    full_name: str
    profile: Optional[TeacherProfileBase] = None

# Properties to receive via API on update
class TeacherUpdate(TeacherBase):
    password: Optional[str] = None
    profile: Optional[TeacherProfileBase] = None

# Properties to return to client
class TeacherProfile(TeacherProfileBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True

class Teacher(TeacherBase):
    id: int
    role: str
    teacher_profile: Optional[TeacherProfile] = None

    class Config:
        orm_mode = True
