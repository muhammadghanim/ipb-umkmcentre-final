from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from backend.domain import schemas
from backend.repository.menu_repository import MenuRepository
from backend.repository.user_repository import UserRepository
from backend.database import get_db

router = APIRouter(prefix="/menus", tags=["Menus"])
menu_repo = MenuRepository()
user_repo = UserRepository()

@router.post("/umkm/{umkm_id}", response_model=schemas.MenuResponse, status_code=201)
def create_menu(umkm_id: UUID, menu: schemas.MenuCreate, db: Session = Depends(get_db)):
    umkm = user_repo.get_umkm(db, umkm_id)
    if not umkm:
        raise HTTPException(status_code=404, detail="UMKM tidak ditemukan")
    return menu_repo.save(db=db, umkm_id=umkm_id, menu=menu)

@router.get("/umkm/{umkm_id}", response_model=List[schemas.MenuResponse])
def get_menus_by_umkm(umkm_id: UUID, db: Session = Depends(get_db)):
    menus = menu_repo.get_by_umkm(db=db, umkm_id=umkm_id)
    result = []
    for m in menus:
        rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if m.ulasan else 0.0
        result.append(schemas.MenuResponse(
            **m.__dict__, 
            nama_toko=m.umkm.nama_toko if m.umkm else "Kantin Kampus",
            rating_rata_rata=round(rating_avg, 1), 
            jumlah_ulasan=len(m.ulasan) if m.ulasan else 0
        ))
    return result

@router.get("/{menu_id}", response_model=schemas.MenuResponse)
def get_menu(menu_id: UUID, db: Session = Depends(get_db)):
    m = menu_repo.find_by_id(db=db, menu_id=menu_id)
    if not m:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")
    
    rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if m.ulasan else 0.0
    return schemas.MenuResponse(
        **m.__dict__, 
        nama_toko=m.umkm.nama_toko if m.umkm else "Kantin Kampus",
        rating_rata_rata=round(rating_avg, 1), 
        jumlah_ulasan=len(m.ulasan) if m.ulasan else 0
    )

@router.get("/", response_model=List[schemas.MenuResponse])
def get_all_menus(db: Session = Depends(get_db)):
    menus = menu_repo.get_all_menus(db)
    result = []
    for m in menus:
        rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if m.ulasan else 0.0
        result.append(schemas.MenuResponse(
            id_menu=m.id_menu,
            id_umkm=m.id_umkm,
            nama_toko=m.umkm.nama_toko if m.umkm else "Kantin Kampus",
            nama_menu=m.nama_menu,
            deskripsi=m.deskripsi,
            harga=m.harga,
            kategori=m.kategori,
            stok=m.stok,
            is_available=m.is_available,
            foto_url=m.foto_url,
            rating_rata_rata=round(rating_avg, 1),
            jumlah_ulasan=len(m.ulasan) if m.ulasan else 0
        ))
    return result