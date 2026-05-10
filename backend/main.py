from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware # 1. Tambahkan import ini
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"], # Port frontend Vite Anda
    allow_credentials=True,
    allow_methods=["*"], # Mengizinkan GET, POST, PUT, DELETE, dll
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
