from app.db.session import SessionLocal
from app.api.api_v1.endpoints.notifications import create_notification
from app.schemas.notification import NotificationCreate
from app.models.user import User
from app.models.student import StudentProfile

def test_create():
    db = SessionLocal()
    # Mock user
    user = db.query(User).first()
    if not user:
        print("No user found to test with.")
        return

    print(f"Testing with user: {user.email}")

    # Test Case 1: Global Notification without attachment
    print("Testing Global Notification...")
    try:
        payload = NotificationCreate(
            title="Test Global",
            message="This is a test message",
            student_id=None,
            grade=None,
            section=None,
            attachment_url=None
        )
        create_notification(payload, db, user)
        print("Global Notification Created Successfully.")
    except Exception as e:
        print(f"Global Notification Failed: {e}")
        import traceback
        traceback.print_exc()

    # Test Case 2: Notification with Attachment
    print("\nTesting Notification with Attachment...")
    try:
        payload = NotificationCreate(
            title="Test Attachment",
            message="Message with attachment",
            student_id=None,
            grade=None,
            section=None,
            attachment_url="http://example.com/file.pdf"
        )
        create_notification(payload, db, user)
        print("Notification with Attachment Created Successfully.")
    except Exception as e:
        print(f"Notification with Attachment Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_create()
