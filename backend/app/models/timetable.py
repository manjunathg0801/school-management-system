from sqlalchemy import Column, Integer, String, Time, Enum
from app.db.base_class import Base
import enum

class DayOfWeek(str, enum.Enum):
    MON = "Mon"
    TUE = "Tue"
    WED = "Wed"
    THU = "Thu"
    FRI = "Fri"
    SAT = "Sat"

class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(Integer, primary_key=True, index=True)
    class_grade = Column(String, nullable=False) # e.g., "1"
    section = Column(String, nullable=False) # e.g., "A"
    day_of_week = Column(String, nullable=False) # Storing as string or Enum
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    subject = Column(String, nullable=False)
    teacher = Column(String, nullable=True)
