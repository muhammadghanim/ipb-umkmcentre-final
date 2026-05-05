from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from backend.domain import schemas
from backend.repository.user_repository import UserRepository
from backend.database import get_db

router = APIRouter(prefix="/users", tags=["Users"])
user_repo = UserRepository()

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
