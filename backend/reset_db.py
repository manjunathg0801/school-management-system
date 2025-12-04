from app.db.session import engine
from app.db.base_class import Base
from app.models.user import User
from app.models.student import StudentProfile, ParentProfile, Address, EmergencyContact
from app.models.event import Holiday
from app.models.fee import Fee
from app.models.attendance import Attendance
from app.models.timetable import Timetable
from app.models.result import Result
from app.models.notification import Notification
from app.models.feed import Feed

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset complete!")

if __name__ == "__main__":
    reset_db()
