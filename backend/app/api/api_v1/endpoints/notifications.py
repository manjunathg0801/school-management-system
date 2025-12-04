from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.notification import Notification, NotificationBatch
from app.models.student import StudentProfile
from app.models.user import User
from app.schemas.notification import Notification as NotificationSchema, NotificationUpdate, NotificationCreate, NotificationBatch as NotificationBatchSchema
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[NotificationSchema])
def read_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve notifications for the current student.
    """
    if not current_user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    try:
        notifications = (
            db.query(Notification)
            .filter(
                (Notification.student_id == current_user.student_profile.id) | 
                (Notification.student_id == None)
            )
            .order_by(Notification.is_read.asc(), Notification.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return notifications
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{notification_id}/read", response_model=NotificationSchema)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mark a notification as read.
    """
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Ensure the notification belongs to the user (or is global)
    if notification.student_id and notification.student_id != current_user.student_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this notification")

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.get("/sent", response_model=List[NotificationBatchSchema])
def read_sent_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve sent notification batches with statistics.
    """
    # Ideally check for admin/teacher role
    
    batches = (
        db.query(NotificationBatch)
        .order_by(NotificationBatch.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    # Calculate stats for each batch
    # This could be optimized with a group by query, but loop is fine for now
    for batch in batches:
        total = db.query(Notification).filter(Notification.batch_id == batch.id).count()
        read = db.query(Notification).filter(Notification.batch_id == batch.id, Notification.is_read == True).count()
        batch.total_count = total
        batch.read_count = read
        
    return batches

@router.post("/", response_model=NotificationSchema)
def create_notification(
    notification_in: NotificationCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Create a new notification batch and individual notifications.
    """
    
    # Create Batch Record
    batch = NotificationBatch(
        title=notification_in.title,
        message=notification_in.message,
        target_grade=notification_in.grade,
        target_section=notification_in.section,
        target_student_id=notification_in.student_id,
        attachment_url=notification_in.attachment_url
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)
    
    created_notifications = []

    # Logic 1: Specific Student ID provided
    if notification_in.student_id:
        notification = Notification(
            title=notification_in.title,
            message=notification_in.message,
            student_id=notification_in.student_id,
            batch_id=batch.id,
            attachment_url=notification_in.attachment_url
        )
        db.add(notification)
        created_notifications.append(notification)

    # Logic 2: Grade and/or Section provided
    elif notification_in.grade or notification_in.section:
        from app.models.student import StudentProfile
        
        query = db.query(StudentProfile)
        if notification_in.grade:
            query = query.filter(StudentProfile.class_grade == notification_in.grade)
        if notification_in.section:
            query = query.filter(StudentProfile.section == notification_in.section)
            
        students = query.all()
        
        for student in students:
            notification = Notification(
                title=notification_in.title,
                message=notification_in.message,
                student_id=student.id,
                batch_id=batch.id,
                attachment_url=notification_in.attachment_url
            )
            db.add(notification)
            created_notifications.append(notification)

    # Logic 3: Global Notification (no student_id, no grade, no section)
    else:
        notification = Notification(
            title=notification_in.title,
            message=notification_in.message,
            student_id=None,
            batch_id=batch.id,
            attachment_url=notification_in.attachment_url
        )
        db.add(notification)
        created_notifications.append(notification)

    db.commit()
    
    # Return the first one or a dummy one linked to the batch
    if created_notifications:
        return created_notifications[0]
    else:
        return Notification(
            id=0, 
            title=notification_in.title, 
            message=notification_in.message, 
            student_id=None, 
            batch_id=batch.id,
            created_at=datetime.now()
        )
