from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from backend.domain import schemas
from backend.repository.pesanan_repository import PesananRepository
from backend.database import get_db

router = APIRouter(prefix="/pesanan", tags=["Pesanan"])
pesanan_repo = PesananRepository()

@router.post("/", response_model=schemas.PesananResponse, status_code=201)
def create_pesanan(pesanan: schemas.PesananCreate, db: Session = Depends(get_db)):
    try:
        return pesanan_repo.save(db=db, pesanan=pesanan)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{pesanan_id}", response_model=schemas.PesananResponse)
def get_pesanan(pesanan_id: UUID, db: Session = Depends(get_db)):
    pesanan = pesanan_repo.find_by_id(db=db, pesanan_id=pesanan_id)
    if not pesanan:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    return pesanan

@router.get("/umkm/{umkm_id}", response_model=List[schemas.PesananResponse])
def get_pesanan_by_umkm(umkm_id: UUID, db: Session = Depends(get_db)):
    return pesanan_repo.get_pesanan_by_umkm(db=db, umkm_id=umkm_id)

@router.get("/mahasiswa/{mahasiswa_id}", response_model=List[schemas.PesananResponse])
def get_pesanan_by_mahasiswa(mahasiswa_id: UUID, db: Session = Depends(get_db)):
    return pesanan_repo.get_pesanan_by_mahasiswa(db=db, mahasiswa_id=mahasiswa_id)

@router.patch("/{pesanan_id}/status", response_model=schemas.PesananResponse)
def update_pesanan_status(pesanan_id: UUID, status: str, db: Session = Depends(get_db)):
    pesanan = pesanan_repo.update_status(db=db, pesanan_id=pesanan_id, status=status)
    if not pesanan:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    return pesanan
