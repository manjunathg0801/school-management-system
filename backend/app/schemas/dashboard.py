from typing import List, Optional
from pydantic import BaseModel
from datetime import date

class DashboardStats(BaseModel):
    total_students: int
    total_teachers: int
    events_this_month: int
    avg_attendance: float

class RecentNotice(BaseModel):
    id: int
    title: str
    message: str
    created_at: str # Formatting date as string for frontend

class UpcomingEvent(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_time: date
    location: Optional[str] = None

class DashboardData(BaseModel):
    stats: DashboardStats
    recent_notices: List[RecentNotice]
    upcoming_events: List[UpcomingEvent]
