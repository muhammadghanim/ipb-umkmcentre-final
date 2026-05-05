from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
from backend.domain import models
from backend.repository.pesanan_repository import PesananRepository

class PembayaranRepository:
    def __init__(self):
        self.pesanan_repo = PesananRepository()

    def prosesQRIS(self, db: Session, id_pesanan: UUID):
        # 1. Pastikan pesanan ada
        pesanan = self.pesanan_repo.find_by_id(db, id_pesanan)
        if not pesanan:
            raise ValueError("Pesanan tidak ditemukan")

        # 2. Cek jika sudah ada data pembayaran (Idempoten)
        existing_pembayaran = db.query(models.Pembayaran).filter(models.Pembayaran.id_pesanan == id_pesanan).first()
        if existing_pembayaran:
            return existing_pembayaran, f"https://mock-qris.api/pay/{existing_pembayaran.id_pembayaran}"

        # 3. Insert ke database Pembayaran dengan batas waktu 15 Menit
        batas_waktu = datetime.utcnow() + timedelta(minutes=15)
        
        db_pembayaran = models.Pembayaran(
            id_pesanan=id_pesanan,
            metode="QRIS",
            total_tagihan=pesanan.total_harga,
            batas_waktu=batas_waktu,
            status_bayar="PENDING",
            log_verifikasi="QRIS di-generate, menunggu pembayaran"
        )
        db.add(db_pembayaran)
        db.commit()
        db.refresh(db_pembayaran)
        
        # Simulasi Link QRIS
        qr_code_url = f"https://mock-qris.api/pay/{db_pembayaran.id_pembayaran}"
        return db_pembayaran, qr_code_url

    def verifikasiPembayaran(self, db: Session, id_pesanan: UUID, status_bayar: str):
        pembayaran = db.query(models.Pembayaran).filter(models.Pembayaran.id_pesanan == id_pesanan).first()
        if not pembayaran:
            raise ValueError("Data pembayaran tidak ditemukan")

        # Cek Timeout
        if pembayaran.batas_waktu and datetime.utcnow() > pembayaran.batas_waktu:
            pembayaran.status_bayar = "TIMEOUT"
            pembayaran.log_verifikasi = "Verifikasi gagal: Melewati batas waktu pembayaran"
            self.pesanan_repo.update_status(db, id_pesanan, "DIBATALKAN")
        else:
            pembayaran.status_bayar = status_bayar
            if status_bayar == "BERHASIL":
                pembayaran.log_verifikasi = f"Pembayaran divalidasi berhasil pada {datetime.utcnow()}"
                self.pesanan_repo.update_status(db, id_pesanan, "SUDAH DIBAYAR")
            elif status_bayar == "GAGAL":
                pembayaran.log_verifikasi = f"Pembayaran divalidasi gagal/ditolak"
                self.pesanan_repo.update_status(db, id_pesanan, "DIBATALKAN")

        db.commit()
        db.refresh(pembayaran)
        return pembayaran
