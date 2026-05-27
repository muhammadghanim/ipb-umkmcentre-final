from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from ..domain import models, schemas
from ..repository.menu_repository import MenuRepository
from ..repository.promo_repository import PromoRepository

class PesananRepository:
    def __init__(self):
        self.menu_repo = MenuRepository()
        self.promo_repo = PromoRepository()

    def save(self, db: Session, pesanan: schemas.PesananCreate):
        total_harga = 0.0
        db_items = []
        
        for item in pesanan.items:
            menu = self.menu_repo.find_by_id(db, item.id_menu)
            if not menu:
                raise ValueError(f"Menu dengan ID {item.id_menu} tidak ditemukan")
            
            if menu.stok < item.jumlah:
                raise ValueError(f"Stock tidak cukup untuk menu {menu.nama_menu}")
                
            self.menu_repo.update_stock(db, menu.id_menu, -item.jumlah)
            
            harga_satuan = menu.harga
            subtotal = harga_satuan * item.jumlah
            total_harga += subtotal
            
            db_item = models.DetailPesanan(
                id_menu=item.id_menu,
                jumlah=item.jumlah,
                harga_satuan=harga_satuan,
                subtotal=subtotal
            )
            db_items.append(db_item)

        if pesanan.kode_promo:
            is_valid, msg, diskon = self.promo_repo.validasiMasaBerlaku(db, pesanan.kode_promo, pesanan.id_umkm)
            if is_valid:
                total_harga -= diskon
                if total_harga < 0: 
                    total_harga = 0
            else:
                raise ValueError(f"Promo Gagal: {msg}")

        # BARIS "total_harga += 2000" SUDAH DIHAPUS

        db_pesanan = models.Pesanan(
            id_mahasiswa=pesanan.id_mahasiswa,
            id_umkm=pesanan.id_umkm,
            total_harga=total_harga,
            status_pesanan="PENDING",
            catatan=pesanan.catatan 
        )
        
        db.add(db_pesanan)
        db.commit()
        db.refresh(db_pesanan)
        
        for db_item in db_items:
            db_item.id_pesanan = db_pesanan.id_pesanan
            db.add(db_item)
            
        db.commit()
        db.refresh(db_pesanan)
        
        return db_pesanan

    def find_by_id(self, db: Session, pesanan_id: UUID):
        return db.query(models.Pesanan).filter(models.Pesanan.id_pesanan == pesanan_id).first()
        
    def get_pesanan_by_umkm(self, db: Session, umkm_id: UUID):
        return (
            db.query(models.Pesanan)
            .options(
                joinedload(models.Pesanan.detail_pesanan).joinedload(models.DetailPesanan.menu),
                joinedload(models.Pesanan.pembayaran),
                joinedload(models.Pesanan.mahasiswa)
            )
            .filter(models.Pesanan.id_umkm == umkm_id)
            .order_by(models.Pesanan.tgl_pesanan.desc())
            .all()
        )

    def get_pesanan_by_mahasiswa(self, db: Session, mahasiswa_id: UUID):
        return (
            db.query(models.Pesanan)
            .options(
                joinedload(models.Pesanan.detail_pesanan).joinedload(models.DetailPesanan.menu),
                joinedload(models.Pesanan.pembayaran),
                joinedload(models.Pesanan.umkm)
            )
            .filter(models.Pesanan.id_mahasiswa == mahasiswa_id)
            .order_by(models.Pesanan.tgl_pesanan.desc())
            .all()
        )
        
    def update_status(self, db: Session, pesanan_id: UUID, status: str):
        pesanan = self.find_by_id(db, pesanan_id)
        if pesanan:
            pesanan.status_pesanan = status.upper()
            db.commit()
            db.refresh(pesanan)
        return pesanan