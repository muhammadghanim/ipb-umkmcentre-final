import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { QrCode, CheckCircle2, UploadCloud } from 'lucide-react';
import api from '../../services/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrisImg, setQrisImg] = useState<string | null>(null);
  
  const [buktiUrl, setBuktiUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const orderId = location.state?.orderId;
  const totalHarga = location.state?.totalHarga;
  const idUmkm = location.state?.id_umkm;

  useEffect(() => {
    const fetchQris = async () => {
      try {
        const response = await api.get(`/users/umkm/${idUmkm}`);
        setQrisImg(response.data.qris_url);
      } catch (error) { console.error("Gagal load QRIS", error); }
    };
    if (idUmkm) fetchQris();
  }, [idUmkm]);

  if (!orderId) {
    return <div className="text-center py-20 text-gray-500">Data pesanan tidak ditemukan. Silakan kembali ke Home.</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setBuktiUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBukti = async () => {
    if (!buktiUrl) {
      alert("Harap upload bukti pembayaran terlebih dahulu!");
      return;
    }
    setIsProcessing(true);
    try {
      await api.patch(`/pesanan/${orderId}/upload-bukti`, { bukti_bayar_url: buktiUrl });
      alert("Bukti pembayaran berhasil diupload! Menunggu verifikasi UMKM.");
      navigate('/history');
    } catch (error) {
      console.error(error);
      alert("Gagal mengupload bukti pembayaran.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* STEPPER SERAGAM (PAYMENT AKTIF) */}
      <div className="flex items-center justify-center mb-10 pt-4">
        <div className="flex items-center text-green-800 font-bold">
          <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center mr-2">✓</div>Cart
        </div>
        <div className="w-16 h-px bg-green-800 mx-4"></div>
        <div className="flex items-center text-green-800 font-bold">
          <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center mr-2">✓</div>Details
        </div>
        <div className="w-16 h-px bg-green-800 mx-4"></div>
        <div className="flex items-center text-green-800 font-bold">
          <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center mr-2">3</div>Payment
        </div>
      </div>

      {/* Konten Payment */}
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Selesaikan Pembayaran</h1>
        <p className="text-gray-500 mb-8">Scan QRIS di bawah ini, lalu upload bukti transfer Anda.</p>

        {/* Kotak QRIS */}
        <div className="bg-gray-50 p-6 rounded-3xl mb-6 flex flex-col items-center justify-center border border-gray-200">
          {qrisImg ? (
            <img src={qrisImg} alt="QRIS TOKO" className="w-56 h-56 object-contain mb-4 mix-blend-multiply" />
          ) : (
            <QrCode className="w-48 h-48 text-gray-300 mb-4" />
          )}
          <div className="text-sm text-gray-500 mb-1">Total Tagihan</div>
          <div className="font-bold text-3xl text-green-800">Rp {totalHarga?.toLocaleString('id-ID')}</div>
        </div>

        {/* Upload Area */}
        <div className="mb-8 text-left">
          <label className="block text-sm font-bold text-gray-900 mb-2">Upload Bukti Transfer</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all overflow-hidden relative"
          >
            {buktiUrl ? (
              <img src={buktiUrl} alt="Bukti Transfer" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="text-center">
                <UploadCloud className="w-8 h-8 text-green-800 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Pilih gambar bukti</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />
          </div>
        </div>

        <button onClick={handleUploadBukti} disabled={isProcessing} className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30">
          {isProcessing ? 'Mengirim...' : <><CheckCircle2 className="w-5 h-5" /> Konfirmasi Pembayaran</>}
        </button>
      </div>
    </div>
  );
}