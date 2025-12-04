from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship, backref
from app.db.base_class import Base
from app.models.user import User

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(User.id), unique=True, nullable=False)
    admission_number = Column(String, unique=True, index=True)
    date_of_birth = Column(Date)
    gender = Column(String)
    blood_group = Column(String)
    class_grade = Column(String)
    section = Column(String)
    photo_url = Column(String, nullable=True)

    user = relationship(User, backref=backref("student_profile", uselist=False))
    parent_profile = relationship("ParentProfile", back_populates="student_profile", uselist=False)
    address = relationship("Address", back_populates="student_profile", uselist=False)
    emergency_contact = relationship("EmergencyContact", back_populates="student_profile", uselist=False)

class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id = Column(Integer, primary_key=True, index=True)
    student_profile_id = Column(Integer, ForeignKey("student_profiles.id"), unique=True, nullable=False)
    
    father_name = Column(String)
    father_occupation = Column(String)
    father_phone = Column(String)
    mother_name = Column(String)
    mother_occupation = Column(String)
    mother_phone = Column(String)

    student_profile = relationship("StudentProfile", back_populates="parent_profile")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    student_profile_id = Column(Integer, ForeignKey("student_profiles.id"), unique=True, nullable=False)
    
    street = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    country = Column(String)

    student_profile = relationship("StudentProfile", back_populates="address")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    student_profile_id = Column(Integer, ForeignKey("student_profiles.id"), unique=True, nullable=False)
    
    contact_name = Column(String)
    relation_type = Column(String)
    phone_number = Column(String)

    student_profile = relationship("StudentProfile", back_populates="emergency_contact")
