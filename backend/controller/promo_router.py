from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from domain import schemas
from repository.promo_repository import PromoRepository
from repository.user_repository import UserRepository
from database import get_db

router = APIRouter(prefix="/promo", tags=["Promo"])
promo_repo = PromoRepository()
user_repo = UserRepository()

@router.post("/umkm/{umkm_id}", response_model=schemas.PromoResponse, status_code=201)
def buat_promo(umkm_id: UUID, promo: schemas.PromoCreate, db: Session = Depends(get_db)):
    umkm = user_repo.get_umkm(db, umkm_id)
    if not umkm:
        raise HTTPException(status_code=404, detail="UMKM tidak ditemukan")
    
    # Validasi kode promo unik
    existing_promo = promo_repo.find_by_kode(db, promo.kode_promo)
    if existing_promo:
        raise HTTPException(status_code=400, detail="Kode promo sudah digunakan")

    return promo_repo.buatPromo(db=db, id_umkm=umkm_id, promo=promo)

# Tambahkan parameter id_umkm di fungsi validasi_promo
@router.get("/validasi/{kode_promo}")
def validasi_promo(kode_promo: str, id_umkm: UUID, db: Session = Depends(get_db)):
    # Kirimkan id_umkm ke repository
    is_valid, message, diskon = promo_repo.validasiMasaBerlaku(db=db, kode_promo=kode_promo, id_umkm=id_umkm)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)
    return {"is_valid": True, "message": message, "nominal_diskon": diskon}

@router.get("/umkm/{umkm_id}", response_model=list[schemas.PromoResponse])
def get_promo_umkm(umkm_id: UUID, db: Session = Depends(get_db)):
    from domain import models
    return db.query(models.Promo).filter(models.Promo.id_umkm == umkm_id).all()

# ==========================================
# RUTE BARU UNTUK HALAMAN MAHASISWA (FRONTEND)
# ==========================================
@router.get("/", response_model=list[schemas.PromoResponse])
def get_semua_promo_aktif(db: Session = Depends(get_db)):
    """
    Mengambil semua daftar promo yang masih berlaku (belum kadaluarsa)
    untuk ditampilkan di halaman Beranda -> Promo.
    """
    return promo_repo.get_all_active_promos(db)