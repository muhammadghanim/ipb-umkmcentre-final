from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    username: str
    email: str

class MahasiswaCreate(UserBase):
    nim: str
    nama_lengkap: str
    no_whatsapp: Optional[str] = None
    password: str

class MahasiswaResponse(UserBase):
    id: UUID
    nim: str
    nama_lengkap: str
    no_whatsapp: Optional[str] = None
    role: str
    model_config = ConfigDict(from_attributes=True)

class UMKMCreate(UserBase):
    nama_toko: str
    deskripsi: Optional[str] = None
    password: str

class UMKMResponse(UserBase):
    id_umkm: UUID
    nama_toko: str
    deskripsi: Optional[str] = None
    no_whatsapp: Optional[str] = None # FITUR BARU
    status_buka: bool
    is_verified: bool
    qris_url: Optional[str] = None
    role: str
    model_config = ConfigDict(from_attributes=True)

class UMKMUpdateProfile(BaseModel):
    nama_toko: str
    deskripsi: Optional[str] = None
    no_whatsapp: Optional[str] = None
    
class UMKMUpdateQRIS(BaseModel):
    qris_url: str

class LoginRequest(BaseModel):
    email: str
    password: str

class MenuBase(BaseModel):
    nama_menu: str
    deskripsi: Optional[str] = None
    harga: float
    kategori: Optional[str] = None
    stok: int = 0
    is_available: bool = True
    foto_url: Optional[str] = None

class MenuCreate(MenuBase):
    pass

class MenuResponse(MenuBase):
    id_menu: UUID
    id_umkm: UUID
    nama_toko: Optional[str] = None 
    rating_rata_rata: Optional[float] = 0.0
    jumlah_ulasan: Optional[int] = 0
    model_config = ConfigDict(from_attributes=True)

class PromoBase(BaseModel):
    nama_promo: str
    kode_promo: str
    nominal_diskon: float
    tgl_mulai: datetime
    tgl_berakhir: datetime

class PromoCreate(PromoBase):
    pass

class PromoResponse(PromoBase):
    id_promo: UUID
    id_umkm: UUID
    nama_toko: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class DetailPesananCreate(BaseModel):
    id_menu: UUID
    jumlah: int

class DetailPesananResponse(BaseModel):
    id_detail: UUID
    id_menu: UUID
    jumlah: int
    harga_satuan: float
    subtotal: float
    menu: Optional[MenuResponse] = None # Agar data nama menu ikut masuk
    model_config = ConfigDict(from_attributes=True)

class PembayaranResponse(BaseModel):
    id_pembayaran: UUID
    metode: Optional[str] = None
    total_tagihan: float
    batas_waktu: Optional[datetime] = None
    status_bayar: str
    bukti_bayar_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class PesananCreate(BaseModel):
    id_umkm: UUID
    id_mahasiswa: UUID
    items: List[DetailPesananCreate]
    kode_promo: Optional[str] = None
    catatan: Optional[str] = None # FITUR BARU

class PesananResponse(BaseModel):
    id_pesanan: UUID
    id_mahasiswa: UUID
    id_umkm: UUID
    tgl_pesanan: datetime
    total_harga: float
    status_pesanan: str
    catatan: Optional[str] = None # FITUR BARU
    detail_pesanan: List[DetailPesananResponse] = []
    pembayaran: Optional[PembayaranResponse] = None
    mahasiswa: Optional[MahasiswaResponse] = None # Agar data nama mahasiswa bisa digunakan
    model_config = ConfigDict(from_attributes=True)

class UploadBuktiRequest(BaseModel):
    bukti_bayar_url: str

class PembayaranCallback(BaseModel):
    id_pesanan: UUID
    status_bayar: str

class QRISResponse(BaseModel):
    id_pembayaran: UUID
    id_pesanan: UUID
    qr_code_url: str
    total_tagihan: float
    batas_waktu: datetime
    status_bayar: str

class UlasanBase(BaseModel):
    rating: int
    komentar: Optional[str] = None

class UlasanCreate(UlasanBase):
    id_menu: UUID

class UlasanResponse(UlasanBase):
    id_ulasan: UUID
    id_mahasiswa: UUID
    id_menu: UUID
    balasan_umkm: Optional[str] = None
    tgl_ulasan: datetime
    model_config = ConfigDict(from_attributes=True)

class UlasanReply(BaseModel):
    balasan_umkm: str