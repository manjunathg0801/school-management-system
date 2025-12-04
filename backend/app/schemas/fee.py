from typing import Optional
from pydantic import BaseModel
from datetime import date

class FeeBase(BaseModel):
    academic_year: str
    fee_type: str
    amount: float
    due_date: date
    status: str
    payment_date: Optional[date] = None
    receipt_number: Optional[str] = None
    reference_number: str

class FeeCreate(FeeBase):
    student_id: int

class Fee(FeeBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True
