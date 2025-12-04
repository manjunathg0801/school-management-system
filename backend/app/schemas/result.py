from typing import Optional
from pydantic import BaseModel
from datetime import date

class ResultBase(BaseModel):
    exam_title: str
    exam_date: date
    subject: str
    marks_obtained: float
    total_marks: float
    grade: str

class ResultCreate(ResultBase):
    student_id: int

class Result(ResultBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True
