from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"
    HALF_DAY = "Half Day"
    LATE = "Late"
    HOLIDAY = "Holiday"
    WEEKEND = "Weekend"

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False) # Storing as string
    remarks = Column(String, nullable=True)
    class_grade = Column(String, nullable=True)
    section = Column(String, nullable=True)
    absence_type = Column(String, nullable=True) # Morning, Afternoon, Full Day

    student = relationship("StudentProfile", backref="attendance_records")
