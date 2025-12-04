from typing import Optional
from pydantic import BaseModel
from datetime import date

# Shared properties
class AddressBase(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None

class ParentProfileBase(BaseModel):
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    father_phone: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    mother_phone: Optional[str] = None

class EmergencyContactBase(BaseModel):
    contact_name: Optional[str] = None
    relation_type: Optional[str] = None
    phone_number: Optional[str] = None

class StudentProfileBase(BaseModel):
    admission_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    class_grade: Optional[str] = None
    section: Optional[str] = None
    photo_url: Optional[str] = None

# Properties to receive via API on update
class StudentProfileUpdate(StudentProfileBase):
    address: Optional[AddressBase] = None
    parent_profile: Optional[ParentProfileBase] = None
    emergency_contact: Optional[EmergencyContactBase] = None

class StudentCreate(StudentProfileBase):
    email: str
    password: str
    full_name: str
    address: Optional[AddressBase] = None
    parent_profile: Optional[ParentProfileBase] = None
    emergency_contact: Optional[EmergencyContactBase] = None

# Properties to return to client
class Address(AddressBase):
    id: int
    class Config:
        orm_mode = True

class ParentProfile(ParentProfileBase):
    id: int
    class Config:
        orm_mode = True

class EmergencyContact(EmergencyContactBase):
    id: int
    class Config:
        orm_mode = True

class StudentProfile(StudentProfileBase):
    id: int
    user_id: int
    address: Optional[Address] = None
    parent_profile: Optional[ParentProfile] = None
    emergency_contact: Optional[EmergencyContact] = None

    class Config:
        orm_mode = True
