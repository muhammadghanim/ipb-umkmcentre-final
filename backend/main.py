import os # <-- 1. Tambahkan import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import engine, Base
from backend.controller import user_router, menu_router, pesanan_router, promo_router, pembayaran_router, ulasan_router
from backend.domain import schemas
from backend.repository.user_repository import UserRepository
from backend.database import get_db
from sqlalchemy.orm import Session

# Membuat tabel database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Pre-Order IPB UMKM FOOD",
    description="Sistem backend untuk manajemen pre-order makanan mahasiswa",
    version="1.0.0"
)

# --- 2. TAMBAHKAN BLOK KODE INI UNTUK MENANGANI FOLDER UPLOADS SECARA OTOMATIS ---
# Ambil lokasi absolut dari file main.py saat ini
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Gabungkan dengan nama folder 'uploads'
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

# Jika folder uploads belum ada di lokasi yang benar, Python akan otomatis membuatnya!
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

# Gunakan UPLOADS_DIR yang sudah berbentuk absolute path
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
# --------------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Menyertakan routers
app.include_router(user_router.router)
app.include_router(menu_router.router)
app.include_router(pesanan_router.router)
app.include_router(promo_router.router)
app.include_router(pembayaran_router.router)
app.include_router(ulasan_router.router) 

@app.get("/", tags=["Health Check"])
def root():
    return {
        "metadata": "API Pre-Order UMKM Online",
        "status": "Running",
        "documentation": "/docs"
    }