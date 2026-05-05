from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from backend.domain import schemas
from backend.repository.pembayaran_repository import PembayaranRepository
from backend.database import get_db

router = APIRouter(prefix="/pembayaran", tags=["Pembayaran"])
pembayaran_repo = PembayaranRepository()

@router.post("/qris/{pesanan_id}", response_model=schemas.QRISResponse)
def proses_qris(pesanan_id: UUID, db: Session = Depends(get_db)):
    try:
        pembayaran, qr_url = pembayaran_repo.prosesQRIS(db=db, id_pesanan=pesanan_id)
        return schemas.QRISResponse(
            id_pembayaran=pembayaran.id_pembayaran,
            id_pesanan=pembayaran.id_pesanan,
            qr_code_url=qr_url,
            total_tagihan=pembayaran.total_tagihan,
            batas_waktu=pembayaran.batas_waktu,
            status_bayar=pembayaran.status_bayar
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/callback")
def webhook_verifikasi_pembayaran(payload: schemas.PembayaranCallback, db: Session = Depends(get_db)):
    try:
        pembayaran = pembayaran_repo.verifikasiPembayaran(
            db=db, 
            id_pesanan=payload.id_pesanan, 
            status_bayar=payload.status_bayar
        )
        return {
            "message": "Webhook diterima dan divalidasi", 
            "status_bayar": pembayaran.status_bayar,
            "log": pembayaran.log_verifikasi
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
