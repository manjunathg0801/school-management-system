from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class FeeStatus(str, enum.Enum):
    PENDING = "Pending"
    PAID = "Paid"

class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    academic_year = Column(String, nullable=False)  # e.g., "2025-2026"
    fee_type = Column(String, nullable=False)  # e.g., "Term 1 Fee", "Transport Fee"
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String, default=FeeStatus.PENDING) # Storing as string for simplicity, or use Enum
    payment_date = Column(Date, nullable=True)
    receipt_number = Column(String, nullable=True)
    reference_number = Column(String, nullable=False) # e.g., "FR/JP/2025-26/6729"

    student = relationship("StudentProfile", backref="fees")
