import os # <-- 1. Tambahkan import os
import traceback
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, get_db
from controller import user_router, menu_router, pesanan_router, promo_router, pembayaran_router, ulasan_router
from domain import schemas
from repository.user_repository import UserRepository
from sqlalchemy.orm import Session

# Membuat tabel database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Pre-Order IPB UMKM FOOD",
    description="Sistem backend untuk manajemen pre-order makanan mahasiswa",
    version="1.0.0"
)

# --- GLOBAL EXCEPTION HANDLER FOR CORS AND DEBUGGING ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "traceback": tb.split("\n")
        }
    )

@app.get("/debug-hash")
def debug_hash():
    from core.security import get_password_hash
    try:
        h = get_password_hash("test")
        return {"status": "ok", "hash": h}
    except Exception as e:
        return {"status": "error", "error": str(e), "traceback": traceback.format_exc()}

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

# --- PERBAIKAN CORS ---
# Pisahkan origins normal (localhost, dll) ke dalam list
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Baca dari environment variable ALLOWED_ORIGINS jika dikonfigurasi di Railway/Server
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    for origin in allowed_origins_env.split(","):
        clean_origin = origin.strip()
        if clean_origin and clean_origin not in origins:
            origins.append(clean_origin)
else:
    # Default fallback production domain jika env var kosong
    origins.append("https://adskelompok3-ipb-umkm-centre.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Menggunakan regex agar semua deployment preview dari Vercel (*.vercel.app) tetap diizinkan
    allow_origin_regex=r"https://.*\.vercel\.app", 
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