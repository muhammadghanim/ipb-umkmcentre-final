from sqlalchemy.orm import Session
from uuid import UUID
from backend.domain import models, schemas

class MenuRepository:
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
