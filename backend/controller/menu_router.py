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
    return menu_repo.get_by_umkm(db=db, umkm_id=umkm_id)

@router.get("/{menu_id}", response_model=schemas.MenuResponse)
def get_menu(menu_id: UUID, db: Session = Depends(get_db)):
    menu = menu_repo.find_by_id(db=db, menu_id=menu_id)
    if not menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")
    return menu
