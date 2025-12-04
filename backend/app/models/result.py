from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    exam_title = Column(String, nullable=False) # e.g., "Periodic Test 1"
    exam_date = Column(Date, nullable=False)
    subject = Column(String, nullable=False)
    marks_obtained = Column(Float, nullable=False)
    total_marks = Column(Float, nullable=False)
    grade = Column(String, nullable=False) # e.g., "A1", "B2"

    student = relationship("StudentProfile", backref="results")
