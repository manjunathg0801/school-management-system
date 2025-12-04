from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth, users, events, fees, attendance, timetable, results, notifications, feed, dashboard, teachers, utils
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(timetable.router, prefix="/timetable", tags=["timetable"])
api_router.include_router(results.router, prefix="/results", tags=["results"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(feed.router, prefix="/feed", tags=["feed"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
