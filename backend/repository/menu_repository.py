from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from ..domain import models, schemas

class MenuRepository:
    def get_all_menus(self, db: Session):
        # Mengambil semua menu dari semua UMKM yang sedang tersedia
        return db.query(models.Menu).filter(models.Menu.is_available == True).all()
    
    def find_by_id(self, db: Session, menu_id: UUID):
        return db.query(models.Menu).filter(models.Menu.id_menu == menu_id).first()

    def get_by_umkm(self, db: Session, umkm_id: UUID):
        return db.query(models.Menu).filter(models.Menu.id_umkm == umkm_id).all()

    def save(self, db: Session, umkm_id: UUID, menu: schemas.MenuCreate):
        db_menu = models.Menu(**menu.model_dump(), id_umkm=umkm_id)
        db.add(db_menu)
        db.commit()
        db.refresh(db_menu)
        return db_menu
        
    def update_stock(self, db: Session, menu_id: UUID, quantity_change: int):
        menu = self.find_by_id(db, menu_id)
        if menu:
            menu.stok += quantity_change
            if menu.stok < 0:
                menu.stok = 0
            db.commit()
            db.refresh(menu)
        return menu

    # --- FITUR BARU: UPDATE DATA MENU ---
    def update(self, db: Session, menu_id: UUID, menu_data: schemas.MenuCreate):
        db_menu = self.find_by_id(db, menu_id)
        if db_menu:
            for key, value in menu_data.model_dump().items():
                setattr(db_menu, key, value)
            db.commit()
            db.refresh(db_menu)
        return db_menu

    # --- FITUR BARU: HAPUS DATA MENU (Dengan Soft-Delete Fallback) ---
    def delete_menu(self, db: Session, menu_id: UUID) -> dict:
        db_menu = self.find_by_id(db, menu_id)
        if not db_menu:
            return {"success": False, "action": "not_found"}
        
        try:
            db.delete(db_menu)
            db.commit()
            return {"success": True, "action": "hard_deleted"}
        except IntegrityError:
            db.rollback()
            # Fallback: Jika gagal dihapus karena terikat riwayat pesanan (Foreign Key)
            db_menu.stok = 0
            db_menu.is_available = False
            db.commit()
            return {"success": True, "action": "soft_disabled"}