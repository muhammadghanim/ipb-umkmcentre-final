import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Gunakan PostgreSQL, fallback ke SQLite untuk development lokal jika variabel environment tidak ada
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./preorder_umkm.db")

# Perbaikan untuk SQLAlchemy 1.4+: pastikan prefix menggunakan postgresql:// bukan postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Parameter check_same_thread hanya dibutuhkan untuk SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
