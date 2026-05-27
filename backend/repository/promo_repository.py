from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from ..domain import models, schemas

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

    def validasiMasaBerlaku(self, db: Session, kode_promo: str, id_umkm: UUID):
        promo = self.find_by_kode(db, kode_promo)
        if not promo:
            return False, "Kode promo tidak ditemukan", 0.0
        
        # Validasi tambahan: Pastikan promo ini benar milik UMKM yang dituju
        if str(promo.id_umkm) != str(id_umkm):
            return False, "Kode promo ini tidak berlaku untuk kantin ini!", 0.0
        
        now = datetime.utcnow()
        if now < promo.tgl_mulai:
            return False, "Promo belum berlaku", 0.0
        
        if now > promo.tgl_berakhir:
            return False, "Promo sudah kadaluarsa", 0.0

        return True, "Promo dapat digunakan", promo.nominal_diskon

    # ==========================================
    # FUNGSI YANG DIPERBARUI DENGAN JOIN TABEL UMKM
    # ==========================================
    def get_all_active_promos(self, db: Session):
        now = datetime.utcnow()
        
        # Menggunakan JOIN untuk mengambil nama_toko dari tabel UMKM
        hasil_query = db.query(
            models.Promo, 
            models.UMKM.nama_toko
        ).join(
            models.UMKM, models.Promo.id_umkm == models.UMKM.id_umkm
        ).filter(
            models.Promo.tgl_berakhir >= now
        ).order_by(
            models.Promo.tgl_berakhir.asc()
        ).all()
        
        daftar_promo = []
        for promo_obj, nama_toko in hasil_query:
            promo_dict = {
                "id_promo": promo_obj.id_promo,
                "id_umkm": promo_obj.id_umkm,
                "nama_promo": promo_obj.nama_promo,
                "kode_promo": promo_obj.kode_promo,
                "nominal_diskon": promo_obj.nominal_diskon,
                "tgl_mulai": promo_obj.tgl_mulai,
                "tgl_berakhir": promo_obj.tgl_berakhir,
                "nama_toko": nama_toko # Nama asli toko masuk ke sini
            }
            daftar_promo.append(promo_dict)
            
        return daftar_promo

promo_repo = PromoRepository()