from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from domain import schemas
from repository.menu_repository import MenuRepository
from repository.user_repository import UserRepository
from database import get_db

router = APIRouter(prefix="/menus", tags=["Menus"])
menu_repo = MenuRepository()
user_repo = UserRepository()

def format_foto_url(foto_url: str, base_url: str) -> str:
    if foto_url and not foto_url.startswith("http") and not foto_url.startswith("data:") and not foto_url.startswith("blob:"):
        clean_path = foto_url.lstrip('/')
        return f"{base_url}{clean_path}"
    return foto_url

@router.post("/umkm/{umkm_id}", response_model=schemas.MenuResponse, status_code=201)
def create_menu(umkm_id: UUID, menu: schemas.MenuCreate, db: Session = Depends(get_db)):
    umkm = user_repo.get_umkm(db, umkm_id)
    if not umkm:
        raise HTTPException(status_code=404, detail="UMKM tidak ditemukan")
    return menu_repo.save(db=db, umkm_id=umkm_id, menu=menu)

@router.get("/umkm/{umkm_id}", response_model=List[schemas.MenuResponse])
def get_menus_by_umkm(umkm_id: UUID, request: Request, db: Session = Depends(get_db)):
    menus = menu_repo.get_by_umkm(db=db, umkm_id=umkm_id)
    
    # Ambil base URL secara dinamis dan tangani HTTPS di balik proxy (seperti Railway)
    base_url = str(request.base_url)
    if request.headers.get("x-forwarded-proto") == "https":
        base_url = base_url.replace("http://", "https://")
        
    result = []
    for m in menus:
        rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if getattr(m, 'ulasan', None) else 0.0
        foto_valid = format_foto_url(m.foto_url, base_url)
        
        # Buat copy dari dict agar foto_url bisa ditimpa dengan aman
        menu_data = {**m.__dict__}
        menu_data['foto_url'] = foto_valid
        
        result.append(schemas.MenuResponse(
            **menu_data, 
            nama_toko=m.umkm.nama_toko if getattr(m, 'umkm', None) else "Kantin Kampus",
            lokasi_toko=m.umkm.lokasi_toko if getattr(m, 'umkm', None) else None,
            rating_rata_rata=round(rating_avg, 1), 
            jumlah_ulasan=len(m.ulasan) if getattr(m, 'ulasan', None) else 0
        ))
    return result

@router.get("/{menu_id}", response_model=schemas.MenuResponse)
def get_menu(menu_id: UUID, request: Request, db: Session = Depends(get_db)):
    m = menu_repo.find_by_id(db=db, menu_id=menu_id)
    if not m:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")
    
    # Ambil base URL secara dinamis dan tangani HTTPS di balik proxy (seperti Railway)
    base_url = str(request.base_url)
    if request.headers.get("x-forwarded-proto") == "https":
        base_url = base_url.replace("http://", "https://")
        
    rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if getattr(m, 'ulasan', None) else 0.0
    foto_valid = format_foto_url(m.foto_url, base_url)
    
    # Buat copy dari dict agar foto_url bisa ditimpa dengan aman
    menu_data = {**m.__dict__}
    menu_data['foto_url'] = foto_valid
    
    return schemas.MenuResponse(
        **menu_data, 
        nama_toko=m.umkm.nama_toko if getattr(m, 'umkm', None) else "Kantin Kampus",
        lokasi_toko=m.umkm.lokasi_toko if getattr(m, 'umkm', None) else None,
        rating_rata_rata=round(rating_avg, 1), 
        jumlah_ulasan=len(m.ulasan) if getattr(m, 'ulasan', None) else 0
    )

@router.get("/", response_model=List[schemas.MenuResponse])
def get_all_menus(request: Request, db: Session = Depends(get_db)): 
    menus = menu_repo.get_all_menus(db)
    
    # Ambil base URL secara dinamis dan tangani HTTPS di balik proxy (seperti Railway)
    base_url = str(request.base_url) 
    if request.headers.get("x-forwarded-proto") == "https":
        base_url = base_url.replace("http://", "https://")
        
    result = []
    for m in menus:
        rating_avg = sum(u.rating for u in m.ulasan) / len(m.ulasan) if getattr(m, 'ulasan', None) else 0.0
        foto_valid = format_foto_url(m.foto_url, base_url)
        
        result.append(schemas.MenuResponse(
            id_menu=m.id_menu,
            id_umkm=m.id_umkm,
            nama_toko=m.umkm.nama_toko if getattr(m, 'umkm', None) else "Kantin Kampus",
            lokasi_toko=m.umkm.lokasi_toko if getattr(m, 'umkm', None) else None,
            nama_menu=m.nama_menu,
            deskripsi=m.deskripsi,
            harga=m.harga,
            kategori=m.kategori,
            stok=m.stok,
            is_available=m.is_available,
            foto_url=foto_valid, 
            rating_rata_rata=round(rating_avg, 1),
            jumlah_ulasan=len(m.ulasan) if getattr(m, 'ulasan', None) else 0
        ))
    return result

@router.put("/{menu_id}", response_model=schemas.MenuResponse)
def update_menu(menu_id: UUID, menu: schemas.MenuCreate, db: Session = Depends(get_db)):
    updated_menu = menu_repo.update(db=db, menu_id=menu_id, menu_data=menu)
    if not updated_menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")
    
    rating_avg = sum(u.rating for u in updated_menu.ulasan) / len(updated_menu.ulasan) if getattr(updated_menu, 'ulasan', None) else 0.0
    return schemas.MenuResponse(
        **updated_menu.__dict__, 
        nama_toko=updated_menu.umkm.nama_toko if getattr(updated_menu, 'umkm', None) else "Kantin Kampus",
        lokasi_toko=updated_menu.umkm.lokasi_toko if getattr(updated_menu, 'umkm', None) else None,
        rating_rata_rata=round(rating_avg, 1), 
        jumlah_ulasan=len(updated_menu.ulasan) if getattr(updated_menu, 'ulasan', None) else 0
    )

@router.delete("/{menu_id}", status_code=status.HTTP_200_OK)
def delete_menu_endpoint(menu_id: UUID, db: Session = Depends(get_db)):
    result = menu_repo.delete_menu(db, menu_id)
    
    if result["action"] == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Menu tidak ditemukan"
        )
        
    if result["action"] == "soft_disabled":
        return {
            "status": "success",
            "message": "Menu tidak bisa dihapus permanen karena memiliki riwayat transaksi. Status menu diubah menjadi tidak tersedia."
        }
        
    return {
        "status": "success", 
        "message": "Menu berhasil dihapus secara permanen dari sistem."
    }