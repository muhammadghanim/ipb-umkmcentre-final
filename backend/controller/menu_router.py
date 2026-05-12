from fastapi import APIRouter, Depends, HTTPException, Request
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
def get_all_menus(request: Request, db: Session = Depends(get_db)): # <-- Tambahkan parameter request
    menus = menu_repo.get_all_menus(db)
    result = []
    
    # Ambil base URL secara dinamis (akan menjadi http://localhost:8000)
    base_url = str(request.base_url) 
    
    for m in menus:
        rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if m.ulasan else 0.0
        
        # --- PERBAIKAN LOGIKA URL GAMBAR ---
        foto_valid = m.foto_url
        if foto_valid and not foto_valid.startswith("http"):
            # Hapus garis miring di awal jika ada, lalu gabungkan dengan base URL
            # Contoh: "uploads/martabak.png" menjadi "http://localhost:8000/uploads/martabak.png"
            clean_path = foto_valid.lstrip('/')
            foto_valid = f"{base_url}{clean_path}"
        # -----------------------------------
        
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
            foto_url=foto_valid, # <-- Gunakan variabel foto_valid yang sudah diformat
            rating_rata_rata=round(rating_avg, 1),
            jumlah_ulasan=len(m.ulasan) if m.ulasan else 0
        ))
    return result