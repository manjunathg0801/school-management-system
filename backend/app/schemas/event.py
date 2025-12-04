from typing import Optional
from pydantic import BaseModel
from datetime import date

class HolidayBase(BaseModel):
    name: str
    date: date
    type: str
    description: Optional[str] = None

class HolidayCreate(HolidayBase):
    pass

class Holiday(HolidayBase):
    id: int

    class Config:
        orm_mode = True
