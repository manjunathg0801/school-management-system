from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship, backref
from app.db.base_class import Base
from app.models.user import User

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(User.id), unique=True, nullable=False)
    
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    qualification = Column(String, nullable=True)
    subjects = Column(String, nullable=True) # Comma separated list
    date_of_joining = Column(Date, nullable=True)

    user = relationship(User, backref=backref("teacher_profile", uselist=False))
