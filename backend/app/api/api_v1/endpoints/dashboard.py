from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.api.api_v1.endpoints.auth import get_db
from app.models.user import User
from app.models.attendance import Attendance, AttendanceStatus
from app.models.event import Holiday
from app.models.notification import Notification
from app.schemas import dashboard as dashboard_schemas

router = APIRouter()

@router.get("/stats", response_model=dashboard_schemas.DashboardData)
def get_dashboard_stats(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get dashboard statistics.
    """
    # 1. Total Students
    total_students = db.query(User).filter(User.role == "student").count()

    # 2. Total Teachers
    total_teachers = db.query(User).filter(User.role == "teacher").count()

    # 3. Events This Month
    today = datetime.now().date()
    start_of_month = today.replace(day=1)
    # Simple logic for end of month
    if today.month == 12:
        end_of_month = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        end_of_month = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
    
    events_count = db.query(Holiday).filter(
        Holiday.date >= start_of_month,
        Holiday.date <= end_of_month
    ).count()

    # 4. Avg Attendance (Overall)
    # Calculate percentage of 'Present' vs Total records
    total_attendance_records = db.query(Attendance).count()
    if total_attendance_records > 0:
        present_count = db.query(Attendance).filter(Attendance.status == AttendanceStatus.PRESENT).count()
        # Half day counts as 0.5? For simplicity let's count Present as 1, Half Day as 0.5
        half_day_count = db.query(Attendance).filter(Attendance.status == AttendanceStatus.HALF_DAY).count()
        
        weighted_present = present_count + (half_day_count * 0.5)
        avg_attendance = (weighted_present / total_attendance_records) * 100
    else:
        avg_attendance = 0.0

    # 5. Recent Notices (Limit 3)
    recent_notices = db.query(Notification).order_by(Notification.created_at.desc()).limit(3).all()
    # Format for schema
    formatted_notices = []
    for notice in recent_notices:
        formatted_notices.append(dashboard_schemas.RecentNotice(
            id=notice.id,
            title=notice.title,
            message=notice.message,
            created_at=notice.created_at.strftime("%Y-%m-%d %H:%M") if notice.created_at else ""
        ))

    # 6. Upcoming Events (Limit 2)
    upcoming_events = db.query(Holiday).filter(
        Holiday.date >= today
    ).order_by(Holiday.date.asc()).limit(2).all()
    
    formatted_events = []
    for event in upcoming_events:
        formatted_events.append(dashboard_schemas.UpcomingEvent(
            id=event.id,
            title=event.name,
            description=event.description,
            start_time=event.date,
            location=None # Location not in Holiday model
        ))

    return dashboard_schemas.DashboardData(
        stats=dashboard_schemas.DashboardStats(
            total_students=total_students,
            total_teachers=total_teachers,
            events_this_month=events_count,
            avg_attendance=round(avg_attendance, 1)
        ),
        recent_notices=formatted_notices,
        upcoming_events=formatted_events
    )
