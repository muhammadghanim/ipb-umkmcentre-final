from sqlalchemy.orm import Session
from uuid import UUID
from backend.domain import models, schemas

class UlasanRepository:
    def create_ulasan(self, db: Session, mahasiswa_id: UUID, ulasan: schemas.UlasanCreate):
        db_ulasan = models.Ulasan(
            id_mahasiswa=mahasiswa_id,
            id_menu=ulasan.id_menu,
            rating=ulasan.rating,
            komentar=ulasan.komentar
        )
        db.add(db_ulasan)
        db.commit()
        db.refresh(db_ulasan)
        return db_ulasan

    def get_ulasan_by_menu(self, db: Session, menu_id: UUID):
        # Join untuk membawa data Mahasiswa dan Menu
        return db.query(models.Ulasan).filter(models.Ulasan.id_menu == menu_id).all()

    def get_ulasan_by_umkm(self, db: Session, umkm_id: UUID):
        return db.query(models.Ulasan).join(models.Menu).filter(models.Menu.id_umkm == umkm_id).all()

    def get_ulasan_by_id(self, db: Session, ulasan_id: UUID):
        return db.query(models.Ulasan).filter(models.Ulasan.id_ulasan == ulasan_id).first()

    def reply_ulasan(self, db: Session, ulasan_id: UUID, reply: schemas.UlasanReply):
        ulasan = self.get_ulasan_by_id(db, ulasan_id)
        if ulasan:
            ulasan.balasan_umkm = reply.balasan_umkm
            db.commit()
            db.refresh(ulasan)
        return ulasan