from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from backend.domain import models, schemas

class PromoRepository:
    def buatPromo(self, db: Session, id_umkm: UUID, promo: schemas.PromoCreate):
        db_promo = models.Promo(
            id_umkm=id_umkm,
            nama_promo=promo.nama_promo,
            kode_promo=promo.kode_promo,
            nominal_diskon=promo.nominal_diskon,
            tgl_mulai=promo.tgl_mulai,
            tgl_berakhir=promo.tgl_berakhir
        )
        db.add(db_promo)
        db.commit()
        db.refresh(db_promo)
        return db_promo

    def find_by_kode(self, db: Session, kode_promo: str):
        return db.query(models.Promo).filter(models.Promo.kode_promo == kode_promo).first()

    def validasiMasaBerlaku(self, db: Session, kode_promo: str):
        promo = self.find_by_kode(db, kode_promo)
        if not promo:
            return False, "Kode promo tidak ditemukan", 0.0
        
        now = datetime.utcnow()
        if now < promo.tgl_mulai:
            return False, "Promo belum berlaku", 0.0
        
        if now > promo.tgl_berakhir:
            return False, "Promo sudah kadaluarsa", 0.0

        return True, "Promo dapat digunakan", promo.nominal_diskon
