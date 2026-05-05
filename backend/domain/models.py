import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, Text, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

# ==========================================
# USERS (Inheritance pattern: Joined Table)
# ==========================================
class User(Base):
    __tablename__ = "users"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(20), nullable=False) # 'mahasiswa', 'umkm'

    # Setup Polymorphism untuk Role (Mahasiswa & UMKM)
    __mapper_args__ = {
        "polymorphic_on": role,
        "polymorphic_identity": "user"
    }

class Mahasiswa(User):
    __tablename__ = "mahasiswa"
    
    # FK mengarah ke parent id (joined table inheritance)
    id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    nim = Column(String(20), unique=True, nullable=False)
    nama_lengkap = Column(String(100), nullable=False)
    no_whatsapp = Column(String(20))

    __mapper_args__ = {
        "polymorphic_identity": "mahasiswa"
    }

    # Relasi
    pesanan = relationship("Pesanan", back_populates="mahasiswa")
    ulasan = relationship("Ulasan", back_populates="mahasiswa")

class UMKM(User):
    __tablename__ = "umkm"
    
    # UML menggunakan id_umkm, yang pada level tabel acts as PK mapping dari parent users.id
    id_umkm = Column(Uuid(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    nama_toko = Column(String(100), nullable=False)
    deskripsi = Column(Text)
    status_buka = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    __mapper_args__ = {
        "polymorphic_identity": "umkm"
    }

    # Relasi
    menu_list = relationship("Menu", back_populates="umkm", cascade="all, delete-orphan")
    promo_list = relationship("Promo", back_populates="umkm", cascade="all, delete-orphan")
    pesanan_masuk = relationship("Pesanan", back_populates="umkm")

# ==========================================
# ENTITAS KATALOG UMKM
# ==========================================
class Promo(Base):
    __tablename__ = "promo"
    
    id_promo = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_umkm = Column(Uuid(as_uuid=True), ForeignKey("umkm.id_umkm"), nullable=False)
    nama_promo = Column(String(100), nullable=False)
    kode_promo = Column(String(50), nullable=False, unique=True)
    nominal_diskon = Column(Float, nullable=False)
    tgl_mulai = Column(DateTime, nullable=False)
    tgl_berakhir = Column(DateTime, nullable=False)

    umkm = relationship("UMKM", back_populates="promo_list")

class Menu(Base):
    __tablename__ = "menu"
    
    id_menu = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_umkm = Column(Uuid(as_uuid=True), ForeignKey("umkm.id_umkm"), nullable=False)
    nama_menu = Column(String(100), nullable=False)
    deskripsi = Column(Text)
    harga = Column(Float, nullable=False)
    kategori = Column(String(50))
    stok = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    foto_url = Column(String(255))

    # Relasi
    umkm = relationship("UMKM", back_populates="menu_list")
    ulasan = relationship("Ulasan", back_populates="menu", cascade="all, delete-orphan")
    detail_pesanan = relationship("DetailPesanan", back_populates="menu")

# ==========================================
# ENTITAS TRANSAKSIONAL
# ==========================================
class Pesanan(Base):
    __tablename__ = "pesanan"
    
    id_pesanan = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_mahasiswa = Column(Uuid(as_uuid=True), ForeignKey("mahasiswa.id"), nullable=False)
    id_umkm = Column(Uuid(as_uuid=True), ForeignKey("umkm.id_umkm"), nullable=False)
    tgl_pesanan = Column(DateTime, default=datetime.utcnow)
    total_harga = Column(Float, nullable=False)
    status_pesanan = Column(String(50), default="PENDING")

    # Relasi
    mahasiswa = relationship("Mahasiswa", back_populates="pesanan")
    umkm = relationship("UMKM", back_populates="pesanan_masuk")
    detail_pesanan = relationship("DetailPesanan", back_populates="pesanan", cascade="all, delete-orphan")
    pembayaran = relationship("Pembayaran", back_populates="pesanan", uselist=False, cascade="all, delete-orphan")

class DetailPesanan(Base):
    __tablename__ = "detail_pesanan"
    
    id_detail = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_pesanan = Column(Uuid(as_uuid=True), ForeignKey("pesanan.id_pesanan"), nullable=False)
    id_menu = Column(Uuid(as_uuid=True), ForeignKey("menu.id_menu"), nullable=False)
    jumlah = Column(Integer, nullable=False)
    harga_satuan = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    pesanan = relationship("Pesanan", back_populates="detail_pesanan")
    menu = relationship("Menu", back_populates="detail_pesanan")

class Pembayaran(Base):
    __tablename__ = "pembayaran"
    
    id_pembayaran = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # unique=True memastikan relasi One-to-One dengan Pesanan
    id_pesanan = Column(Uuid(as_uuid=True), ForeignKey("pesanan.id_pesanan"), nullable=False, unique=True)
    metode = Column(String(50))
    total_tagihan = Column(Float, nullable=False)
    batas_waktu = Column(DateTime)
    status_bayar = Column(String(50), default="PENDING")
    log_verifikasi = Column(Text)

    pesanan = relationship("Pesanan", back_populates="pembayaran")

# ==========================================
# ENTITAS ULASAN / RATING
# ==========================================
class Ulasan(Base):
    __tablename__ = "ulasan"
    
    id_ulasan = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_mahasiswa = Column(Uuid(as_uuid=True), ForeignKey("mahasiswa.id"), nullable=False)
    id_menu = Column(Uuid(as_uuid=True), ForeignKey("menu.id_menu"), nullable=False)
    rating = Column(Integer, nullable=False)
    komentar = Column(Text)
    balasan_umkm = Column(Text)
    tgl_ulasan = Column(DateTime, default=datetime.utcnow)

    mahasiswa = relationship("Mahasiswa", back_populates="ulasan")
    menu = relationship("Menu", back_populates="ulasan")
