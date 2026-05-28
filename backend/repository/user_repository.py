from sqlalchemy.orm import Session
from uuid import UUID
from domain import models, schemas
from core.security import get_password_hash

class UserRepository:
    def get_mahasiswa(self, db: Session, user_id: UUID):
        return db.query(models.Mahasiswa).filter(models.Mahasiswa.id == user_id).first()

    def get_umkm(self, db: Session, umkm_id: UUID):
        return db.query(models.UMKM).filter(models.UMKM.id_umkm == umkm_id).first()

    def create_mahasiswa(self, db: Session, mhs: schemas.MahasiswaCreate):
        db_mhs = models.Mahasiswa(
            username=mhs.username,
            email=mhs.email,
            nim=mhs.nim,
            nama_lengkap=mhs.nama_lengkap,
            no_whatsapp=mhs.no_whatsapp,
            role="mahasiswa",
            hashed_password=get_password_hash(mhs.password)
        )
        db.add(db_mhs)
        db.commit()
        db.refresh(db_mhs)
        return db_mhs

    def create_umkm(self, db: Session, umkm: schemas.UMKMCreate):
        db_umkm = models.UMKM(
            username=umkm.username, 
            email=umkm.email, 
            nama_toko=umkm.nama_toko,
            deskripsi=umkm.deskripsi, 
            role="umkm",
            hashed_password=get_password_hash(umkm.password) # <--- Ubah mhs jadi umkm di sini
        )
        db.add(db_umkm)
        db.commit()
        db.refresh(db_umkm)
        return db_umkm
