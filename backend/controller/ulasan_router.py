from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..domain import schemas
from ..repository.ulasan_repository import UlasanRepository
from ..database import get_db

router = APIRouter(prefix="/ulasan", tags=["Ulasan"])
ulasan_repo = UlasanRepository()

@router.post("/", status_code=201)
def tambah_ulasan(ulasan: schemas.UlasanCreate, db: Session = Depends(get_db)):
    # Mahasiswa mengirim id mahasiswa lewat body, atau kita ubah parameter ke path spt sebelumnya
    pass # Kita timpa fungsi ini dengan yang di bawah

@router.post("/mahasiswa/{mahasiswa_id}", response_model=schemas.UlasanResponse, status_code=201)
def tambah_ulasan_mahasiswa(mahasiswa_id: UUID, ulasan: schemas.UlasanCreate, db: Session = Depends(get_db)):
    if ulasan.rating < 1 or ulasan.rating > 5:
        raise HTTPException(status_code=400, detail="Rating harus antara 1 hingga 5")
    return ulasan_repo.create_ulasan(db=db, mahasiswa_id=mahasiswa_id, ulasan=ulasan)

@router.get("/menu/{menu_id}")
def get_ulasan_menu(menu_id: UUID, db: Session = Depends(get_db)):
    ulasan_list = ulasan_repo.get_ulasan_by_menu(db=db, menu_id=menu_id)
    result = []
    for u in ulasan_list:
        result.append({
            "id_ulasan": u.id_ulasan,
            "id_mahasiswa": u.id_mahasiswa,
            "nama_mahasiswa": u.mahasiswa.nama_lengkap, # Diambil dari relasi
            "id_menu": u.id_menu,
            "rating": u.rating,
            "komentar": u.komentar,
            "balasan_umkm": u.balasan_umkm,
            "tgl_ulasan": u.tgl_ulasan
        })
    return result

@router.get("/umkm/{umkm_id}")
def get_ulasan_umkm(umkm_id: UUID, db: Session = Depends(get_db)):
    ulasan_list = ulasan_repo.get_ulasan_by_umkm(db=db, umkm_id=umkm_id)
    result = []
    for u in ulasan_list:
        result.append({
            "id_ulasan": u.id_ulasan,
            "id_mahasiswa": u.id_mahasiswa,
            "nama_mahasiswa": u.mahasiswa.nama_lengkap,
            "id_menu": u.id_menu,
            "nama_menu": u.menu.nama_menu,
            "rating": u.rating,
            "komentar": u.komentar,
            "balasan_umkm": u.balasan_umkm,
            "tgl_ulasan": u.tgl_ulasan
        })
    return result

@router.patch("/{ulasan_id}/balas", response_model=schemas.UlasanResponse)
def balas_ulasan(ulasan_id: UUID, reply: schemas.UlasanReply, db: Session = Depends(get_db)):
    ulasan = ulasan_repo.reply_ulasan(db=db, ulasan_id=ulasan_id, reply=reply)
    if not ulasan:
        raise HTTPException(status_code=404, detail="Ulasan tidak ditemukan")
    return ulasan