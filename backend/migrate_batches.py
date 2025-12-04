from app.db.session import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as connection:
        with connection.begin():
            print("Creating notification_batches table...")
            try:
                connection.execute(text("""
                    CREATE TABLE IF NOT EXISTS notification_batches (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR NOT NULL,
                        message VARCHAR NOT NULL,
                        target_grade VARCHAR,
                        target_section VARCHAR,
                        target_student_id INTEGER,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
                    );
                """))
                print("Created notification_batches table.")
            except Exception as e:
                print(f"Error creating table: {e}")

            print("Adding batch_id column to notifications...")
            try:
                connection.execute(text("ALTER TABLE notifications ADD COLUMN batch_id INTEGER REFERENCES notification_batches(id);"))
                print("Added batch_id column.")
            except Exception as e:
                print(f"Error adding batch_id column (might already exist): {e}")

if __name__ == "__main__":
    migrate()
