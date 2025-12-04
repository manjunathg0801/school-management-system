from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.student import StudentProfile, ParentProfile, Address, EmergencyContact
from app.models.event import Holiday
from app.models.fee import Fee, FeeStatus
from app.models.attendance import Attendance, AttendanceStatus
from app.models.timetable import Timetable, DayOfWeek
from app.models.result import Result
from app.models.result import Result
from app.models.notification import Notification
from app.models.feed import Feed
from datetime import date, timedelta, time, datetime
from passlib.context import CryptContext

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_db():
    db = SessionLocal()
    try:
        # Check if user exists
        user = db.query(User).filter(User.email == "admin@school.com").first()
        if not user:
            print("Creating default user...")
            user = User(
                email="admin@school.com",
                hashed_password=get_password_hash("password123"),
                full_name="Admin User",
                role="admin",
                is_active=True # Kept from original, as instruction didn't explicitly remove it
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print("User created!")
            print("Email: admin@school.com")
            print("Password: password123")
        else:
            print("User admin@school.com already exists.")

        # Seed Profile
        # Check if a student profile already exists for this user
        # Assuming a one-to-one relationship or checking if user.student_profile is loaded
        # For simplicity, let's check if a profile exists linked to this user's ID
        existing_profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()

        if not existing_profile:
            print("Creating default profile...")
            profile = StudentProfile(
                user_id=user.id,
                admission_number="ADM001",
                date_of_birth=date(2015, 5, 20),
                gender="Male",
                blood_group="O+",
                class_grade="1",
                section="A",
                photo_url="http://192.168.0.110:8000/static/avatar.png"
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

            # Seed Address
            address = Address(
                student_profile_id=profile.id,
                street="123 School Lane",
                city="Education City",
                state="Knowledge State",
                zip_code="560001",
                country="India"
            )
            db.add(address)

            # Seed Parent
            parent = ParentProfile(
                student_profile_id=profile.id,
                father_name="Father Name",
                father_occupation="Engineer",
                father_phone="9876543210",
                mother_name="Mother Name",
                mother_occupation="Doctor",
                mother_phone="9876543211"
            )
            db.add(parent)
            
            # Seed Emergency Contact
            contact = EmergencyContact(
                student_profile_id=profile.id,
                contact_name="Uncle Name",
                relation_type="Uncle",
                phone_number="9876543212"
            )
            db.add(contact)
            db.commit()
            print("Profile created!")
        else:
            print("Profile already exists for this user.")
            profile = existing_profile

        # Seed Holidays
        if not db.query(Holiday).first():
            print("Seeding holidays...")
            holidays = [
                Holiday(name="Republic Day", date=date(2024, 1, 26), type="holiday", description="National Holiday"),
                Holiday(name="Sports Day", date=date(2024, 2, 15), type="event", description="Annual Sports Meet"),
                Holiday(name="Holi", date=date(2024, 3, 25), type="holiday", description="Festival of Colors"),
                Holiday(name="Annual Day", date=date(2024, 4, 10), type="event", description="School Annual Function"),
                Holiday(name="Summer Vacation", date=date(2024, 5, 1), type="holiday", description="Summer Break Starts"),
            ]
            db.add_all(holidays)
            # Seed Fees
            fees_data = [
                {
                    "academic_year": "2025 - 2026",
                    "fee_type": "Term 1 Fee",
                    "amount": 55000.00,
                    "due_date": date(2025, 11, 10),
                    "status": FeeStatus.PAID,
                    "payment_date": date(2025, 11, 5),
                    "receipt_number": "REC-1001",
                    "reference_number": "FR/JP/2025-26/6729"
                },
                {
                    "academic_year": "2025 - 2026",
                    "fee_type": "Term 2 Fee",
                    "amount": 55000.00,
                    "due_date": date(2025, 8, 10),
                    "status": FeeStatus.PAID,
                    "payment_date": date(2025, 8, 8),
                    "receipt_number": "REC-1045",
                    "reference_number": "FR/JP/2025-26/5011"
                },
                {
                    "academic_year": "2025 - 2026",
                    "fee_type": "Term 3 Fee",
                    "amount": 30300.00,
                    "due_date": date(2025, 6, 13),
                    "status": FeeStatus.PAID,
                    "payment_date": date(2025, 6, 10),
                    "receipt_number": "REC-1099",
                    "reference_number": "FR/JP/2025-26/3425"
                },
                {
                    "academic_year": "2025 - 2026",
                    "fee_type": "Annual Fee",
                    "amount": 55100.00,
                    "due_date": date(2025, 4, 11),
                    "status": FeeStatus.PAID,
                    "payment_date": date(2025, 4, 10),
                    "receipt_number": "REC-1150",
                    "reference_number": "FR/JP/2025-26/2520"
                },
                {
                    "academic_year": "2025 - 2026",
                    "fee_type": "Transport Fee",
                    "amount": 12000.00,
                    "due_date": date(2026, 1, 10),
                    "status": FeeStatus.PENDING,
                    "payment_date": None,
                    "receipt_number": None,
                    "reference_number": "FR/JP/2025-26/7001"
                }
            ]

            for fee_in in fees_data:
                fee = Fee(student_id=profile.id, **fee_in)
                db.add(fee)

            db.commit()
            print("Fees seeded!")

            # Seed Attendance (Last 30 days)
            print("Seeding attendance...")
            today = date.today()
            for i in range(30):
                current_date = today - timedelta(days=i)
                weekday = current_date.weekday() # 0=Mon, 6=Sun
                
                status = AttendanceStatus.PRESENT
                remarks = None

                if weekday == 5 or weekday == 6:
                    status = AttendanceStatus.WEEKEND
                elif i % 10 == 0: # Random absent
                    status = AttendanceStatus.ABSENT
                    remarks = "Sick Leave"
                    absence_type = "Full Day"
                elif i % 7 == 0: # Random half day
                    status = AttendanceStatus.HALF_DAY
                    remarks = "Doctor Appointment"
                    absence_type = "Morning" # Example: Morning leave
                elif i % 15 == 0: # Random holiday
                    status = AttendanceStatus.HOLIDAY
                    remarks = "Public Holiday"
                
                attendance = Attendance(
                    student_id=profile.id,
                    date=current_date,
                    status=status,
                    remarks=remarks,
                    class_grade=profile.class_grade,
                    section=profile.section,
                    absence_type=absence_type if status in [AttendanceStatus.ABSENT, AttendanceStatus.HALF_DAY] else None
                )
                db.add(attendance)
            
            db.commit()
            print("Attendance seeded!")

            # Seed Timetable
            print("Seeding timetable...")
            timetable_data = [
                # Monday
                {"day_of_week": "Mon", "start_time": time(9, 0), "end_time": time(9, 45), "subject": "Mathematics", "teacher": "Mr. Sharma"},
                {"day_of_week": "Mon", "start_time": time(9, 45), "end_time": time(10, 30), "subject": "English", "teacher": "Ms. Sarah"},
                {"day_of_week": "Mon", "start_time": time(10, 30), "end_time": time(10, 45), "subject": "Break", "teacher": ""},
                {"day_of_week": "Mon", "start_time": time(10, 45), "end_time": time(11, 30), "subject": "Science", "teacher": "Mrs. Gupta"},
                {"day_of_week": "Mon", "start_time": time(11, 30), "end_time": time(12, 15), "subject": "History", "teacher": "Mr. Rajesh"},
                
                # Tuesday
                {"day_of_week": "Tue", "start_time": time(9, 0), "end_time": time(9, 45), "subject": "Science", "teacher": "Mrs. Gupta"},
                {"day_of_week": "Tue", "start_time": time(9, 45), "end_time": time(10, 30), "subject": "Mathematics", "teacher": "Mr. Sharma"},
                {"day_of_week": "Tue", "start_time": time(10, 30), "end_time": time(10, 45), "subject": "Break", "teacher": ""},
                {"day_of_week": "Tue", "start_time": time(10, 45), "end_time": time(11, 30), "subject": "English", "teacher": "Ms. Sarah"},
                {"day_of_week": "Tue", "start_time": time(11, 30), "end_time": time(12, 15), "subject": "Geography", "teacher": "Mr. Rajesh"},

                # Wednesday
                {"day_of_week": "Wed", "start_time": time(9, 0), "end_time": time(9, 45), "subject": "Physical Ed.", "teacher": "Mr. John"},
                {"day_of_week": "Wed", "start_time": time(9, 45), "end_time": time(10, 30), "subject": "Science", "teacher": "Mrs. Gupta"},
                {"day_of_week": "Wed", "start_time": time(10, 30), "end_time": time(10, 45), "subject": "Break", "teacher": ""},
                {"day_of_week": "Wed", "start_time": time(10, 45), "end_time": time(11, 30), "subject": "Mathematics", "teacher": "Mr. Sharma"},
                {"day_of_week": "Wed", "start_time": time(11, 30), "end_time": time(12, 15), "subject": "Computer", "teacher": "Ms. Priya"},

                # Thursday
                {"day_of_week": "Thu", "start_time": time(9, 0), "end_time": time(9, 45), "subject": "Mathematics", "teacher": "Mr. Sharma"},
                {"day_of_week": "Thu", "start_time": time(9, 45), "end_time": time(10, 30), "subject": "English", "teacher": "Ms. Sarah"},
                {"day_of_week": "Thu", "start_time": time(10, 30), "end_time": time(10, 45), "subject": "Break", "teacher": ""},
                {"day_of_week": "Thu", "start_time": time(10, 45), "end_time": time(11, 30), "subject": "Science", "teacher": "Mrs. Gupta"},
                {"day_of_week": "Thu", "start_time": time(11, 30), "end_time": time(12, 15), "subject": "Art", "teacher": "Ms. Leela"},

                # Friday
                {"day_of_week": "Fri", "start_time": time(9, 0), "end_time": time(9, 45), "subject": "Science", "teacher": "Mrs. Gupta"},
                {"day_of_week": "Fri", "start_time": time(9, 45), "end_time": time(10, 30), "subject": "Mathematics", "teacher": "Mr. Sharma"},
                {"day_of_week": "Fri", "start_time": time(10, 30), "end_time": time(10, 45), "subject": "Break", "teacher": ""},
                {"day_of_week": "Fri", "start_time": time(10, 45), "end_time": time(11, 30), "subject": "English", "teacher": "Ms. Sarah"},
                {"day_of_week": "Fri", "start_time": time(11, 30), "end_time": time(12, 15), "subject": "Library", "teacher": "Mrs. Rao"},

                # Saturday
                {"day_of_week": "Sat", "start_time": time(9, 0), "end_time": time(9, 45), "subject": "Activity", "teacher": "All Staff"},
                {"day_of_week": "Sat", "start_time": time(9, 45), "end_time": time(10, 30), "subject": "Sports", "teacher": "Mr. John"},
                {"day_of_week": "Sat", "start_time": time(10, 30), "end_time": time(12, 30), "subject": "Half Day", "teacher": ""},
            ]

            for item in timetable_data:
                timetable_entry = Timetable(
                    class_grade=profile.class_grade,
                    section=profile.section,
                    **item
                )
                db.add(timetable_entry)
            
            db.commit()
            print("Timetable seeded!")

            # Seed Results
            print("Seeding results...")
            results_data = [
                # Periodic Test 1
                {"exam_title": "Periodic Test 1", "exam_date": date(2025, 7, 15), "subject": "Mathematics", "marks_obtained": 18, "total_marks": 20, "grade": "A1"},
                {"exam_title": "Periodic Test 1", "exam_date": date(2025, 7, 15), "subject": "Science", "marks_obtained": 19, "total_marks": 20, "grade": "A1"},
                {"exam_title": "Periodic Test 1", "exam_date": date(2025, 7, 16), "subject": "English", "marks_obtained": 17, "total_marks": 20, "grade": "A2"},
                {"exam_title": "Periodic Test 1", "exam_date": date(2025, 7, 16), "subject": "Social Studies", "marks_obtained": 18, "total_marks": 20, "grade": "A1"},
                {"exam_title": "Periodic Test 1", "exam_date": date(2025, 7, 17), "subject": "Computer", "marks_obtained": 20, "total_marks": 20, "grade": "A1"},

                # Mid-Term Examination
                {"exam_title": "Mid-Term Examination", "exam_date": date(2025, 9, 20), "subject": "Mathematics", "marks_obtained": 75, "total_marks": 80, "grade": "A1"},
                {"exam_title": "Mid-Term Examination", "exam_date": date(2025, 9, 20), "subject": "Science", "marks_obtained": 72, "total_marks": 80, "grade": "A1"},
                {"exam_title": "Mid-Term Examination", "exam_date": date(2025, 9, 22), "subject": "English", "marks_obtained": 68, "total_marks": 80, "grade": "A2"},
                {"exam_title": "Mid-Term Examination", "exam_date": date(2025, 9, 22), "subject": "Social Studies", "marks_obtained": 74, "total_marks": 80, "grade": "A1"},
                {"exam_title": "Mid-Term Examination", "exam_date": date(2025, 9, 24), "subject": "Computer", "marks_obtained": 78, "total_marks": 80, "grade": "A1"},
            ]

            for item in results_data:
                result = Result(
                    student_id=profile.id,
                    **item
                )
                db.add(result)
            
            db.commit()
            print("Results seeded!")

            # Seed Notifications
            print("Seeding notifications...")
            notifications_data = [
                {
                    "title": "Fee Payment Reminder",
                    "message": "Your Term 2 fee is due on 10th Oct 2025. Please pay to avoid late fees.",
                    "created_at": datetime.now() - timedelta(hours=2),
                    "is_read": False,
                    "student_id": profile.id
                },
                {
                    "title": "New Assignment Uploaded",
                    "message": "Math assignment for Chapter 5 has been uploaded. Due date: 15th Oct.",
                    "created_at": datetime.now() - timedelta(days=1),
                    "is_read": True,
                    "student_id": profile.id
                },
                {
                    "title": "Holiday Announcement",
                    "message": "School will remain closed on 2nd Oct for Gandhi Jayanti.",
                    "created_at": datetime.now() - timedelta(days=2),
                    "is_read": True,
                    "student_id": None # Global announcement
                },
                {
                    "title": "Exam Schedule Released",
                    "message": "The schedule for Mid-Term examinations has been released. Check the app for details.",
                    "created_at": datetime.now() - timedelta(days=5),
                    "is_read": True,
                    "student_id": None # Global announcement
                },
            ]

            for item in notifications_data:
                notification = Notification(**item)
                db.add(notification)
            
            db.commit()
            print("Notifications seeded!")

            # Seed Feeds
            print("Seeding feeds...")
            feeds_data = [
                {
                    "title": "Our Administrator on Sports as a Way of Life – National Sports Day",
                    "description": "In today’s world where convenience often keeps us indoors, it is more important than ever to engage with sports and physical activity. Sports not only build fitness but also shape character, discipline, and resilience. Through active participation, children and young adults learn teamwork, develop leadership qualities, and embrace the values of perseverance and fair play.",
                    "images": ["https://i.ibb.co/9hh6sMb/school-logo.png", "https://i.ibb.co/7YN6FQG/myschoolone.png"], # Using placeholders for now
                    "author": "Admin",
                    "created_at": datetime.now() - timedelta(days=1)
                },
                {
                    "title": "Kaira Baliga of 10B - Second Runners-Up, Vijayanagar District Table Tennis",
                    "description": "Game on! Whether it’s the court, the pool, or the table — our Sports Stars leap, splash, and smash their way to victory! We are so proud to celebrate the achievements of our students who continue to shine in every arena.",
                    "images": ["https://i.ibb.co/7YN6FQG/myschoolone.png"],
                    "author": "Sports Dept",
                    "created_at": datetime.now() - timedelta(days=3)
                }
            ]

            for item in feeds_data:
                feed = Feed(**item)
                db.add(feed)
            
            db.commit()
            print("Feeds seeded!")

            print("Database seeded successfully!")
        else:
            print("Holidays already exist.")

    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
