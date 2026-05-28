import os  # <-- Tambahkan import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv  # <-- Tambahkan import load_dotenv

# Memuat variabel dari file .env
load_dotenv()

# Mengambil SECRET_KEY dari .env. Jika tidak ada, gunakan fallback default.
SECRET_KEY = os.getenv("SECRET_KEY", "kunci-rahasia-default-jika-env-lupa-diisi")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # Token aktif 1 hari

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    # Menggunakan datetime.utcnow() sesuai dengan kode awal Anda
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt