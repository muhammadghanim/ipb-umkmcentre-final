from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ..domain import schemas, models
from ..repository.user_repository import UserRepository
from ..database import get_db
from ..core.security import verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])
user_repo = UserRepository()

@router.post("/login")
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    # Cari user berdasarkan email
    user = db.query(models.User).filter(models.User.email == req.email).first()
    
    # Verifikasi password
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    
    # Generate Token
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    
    # Jika UMKM, ID-nya adalah id_umkm. Jika Mahasiswa, id. Kita standarisasi pengiriman ID.
    user_id = getattr(user, 'id_umkm', user.id) 

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": str(user_id)
    }

@router.post("/mahasiswa", response_model=schemas.MahasiswaResponse, status_code=201)
def create_mahasiswa(mhs: schemas.MahasiswaCreate, db: Session = Depends(get_db)):
    return user_repo.create_mahasiswa(db=db, mhs=mhs)

@router.get("/mahasiswa/{user_id}", response_model=schemas.MahasiswaResponse)
def get_mahasiswa(user_id: UUID, db: Session = Depends(get_db)):
    mhs = user_repo.get_mahasiswa(db=db, user_id=user_id)
    if not mhs:
        raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")
    return mhs

@router.post("/umkm", response_model=schemas.UMKMResponse, status_code=201)
def create_umkm(umkm: schemas.UMKMCreate, db: Session = Depends(get_db)):
    return user_repo.create_umkm(db=db, umkm=umkm)

@router.get("/umkm/{umkm_id}", response_model=schemas.UMKMResponse)
def get_umkm(umkm_id: UUID, db: Session = Depends(get_db)):
    umkm = user_repo.get_umkm(db=db, umkm_id=umkm_id)
    if not umkm:
        raise HTTPException(status_code=404, detail="UMKM tidak ditemukan")
    return umkm

@router.patch("/umkm/{umkm_id}/qris", response_model=schemas.UMKMResponse)
def update_qris_umkm(umkm_id: UUID, req: schemas.UMKMUpdateQRIS, db: Session = Depends(get_db)):
    umkm = user_repo.get_umkm(db=db, umkm_id=umkm_id)
    if not umkm:
        raise HTTPException(status_code=404, detail="UMKM tidak ditemukan")
    
    umkm.qris_url = req.qris_url
    db.commit()
    db.refresh(umkm)
    return umkm

@router.patch("/umkm/{umkm_id}/profile", response_model=schemas.UMKMResponse)
def update_profile_umkm(umkm_id: UUID, req: schemas.UMKMUpdateProfile, db: Session = Depends(get_db)):
    umkm = user_repo.get_umkm(db=db, umkm_id=umkm_id)
    if not umkm:
        raise HTTPException(status_code=404, detail="UMKM tidak ditemukan")
    
    umkm.nama_toko = req.nama_toko
    umkm.deskripsi = req.deskripsi
    umkm.no_whatsapp = req.no_whatsapp
    umkm.lokasi_toko = req.lokasi_toko
    db.commit()
    db.refresh(umkm)
    return umkm