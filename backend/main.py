from fastapi import FastAPI
from backend.database import engine, Base
from backend.controller import user_router, menu_router, pesanan_router, promo_router, pembayaran_router
from backend.domain import schemas
from backend.repository.user_repository import UserRepository
from backend.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

# Membuat tabel database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Pre-Order Makanan UMKM Kampus",
    description="Sistem backend untuk manajemen pre-order makanan mahasiswa",
    version="1.0.0"
)

# Menyertakan routers
app.include_router(user_router.router)
app.include_router(menu_router.router)
app.include_router(pesanan_router.router)
app.include_router(promo_router.router)
app.include_router(pembayaran_router.router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "metadata": "API Pre-Order UMKM Online",
        "status": "Running",
        "documentation": "/docs"
    }
