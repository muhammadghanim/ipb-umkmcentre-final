import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { QrCode, CheckCircle2, UploadCloud, Check, ImageIcon, ShieldCheck } from 'lucide-react';
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
      } catch (error) { 
        console.error("Gagal load QRIS", error); 
      }
    };
    if (idUmkm) fetchQris();
  }, [idUmkm]);

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <ShieldCheck className="w-20 h-20 text-slate-300 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sesi Pembayaran Tidak Valid</h2>
        <p className="text-slate-500 mb-8">Data pesanan tidak ditemukan atau Anda sudah melakukan pembayaran.</p>
        <button onClick={() => navigate('/')} className="bg-[#0f7636] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    );
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
      alert("Gagal mengupload bukti pembayaran. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Stepper (Tahap 1 & 2 dimatikan link-nya agar tidak error back-navigation) */}
      <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
        <div className="flex items-center text-[#0f7636] font-bold opacity-70">
          <div className="w-8 h-8 rounded-full bg-[#0f7636] text-white flex items-center justify-center mr-2 shadow-sm">
            <Check className="w-4 h-4" />
          </div>
          Cart
        </div>
        <div className="w-12 md:w-24 h-1 bg-[#0f7636] mx-3 md:mx-4 rounded-full opacity-70"></div>
        <div className="flex items-center text-[#0f7636] font-bold opacity-70">
          <div className="w-8 h-8 rounded-full bg-[#0f7636] text-white flex items-center justify-center mr-2 shadow-sm">
            <Check className="w-4 h-4" />
          </div>
          Details
        </div>
        <div className="w-12 md:w-24 h-1 bg-[#0f7636] mx-3 md:mx-4 rounded-full"></div>
        <div className="flex items-center text-[#0f7636] font-bold">
          <div className="w-8 h-8 rounded-full border-2 border-[#0f7636] bg-white flex items-center justify-center mr-2 shadow-sm">3</div>
          Payment
        </div>
      </div>

      {/* Konten Payment */}
      <div className="max-w-md mx-auto bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0f7636]/5 to-transparent pointer-events-none"></div>

        <ShieldCheck className="w-12 h-12 text-[#0f7636] mx-auto mb-4 relative z-10" />
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2 relative z-10">Selesaikan Pembayaran</h1>
        <p className="text-slate-500 mb-8 text-sm relative z-10">Scan QRIS di bawah ini dengan aplikasi M-Banking atau E-Wallet Anda.</p>

        {/* Kotak QRIS */}
        <div className="bg-white p-6 rounded-3xl mb-8 flex flex-col items-center justify-center border-2 border-slate-100 shadow-sm relative z-10">
          {qrisImg ? (
            <img 
              src={qrisImg} 
              alt="QRIS TOKO" 
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f8fafc/94a3b8?text=QRIS+Gagal+Dimuat'; }}
              className="w-56 h-56 object-contain mb-6 rounded-xl border border-slate-100 p-2 shadow-sm" 
            />
          ) : (
            <div className="w-56 h-56 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl mb-6 flex flex-col items-center justify-center text-slate-400">
              <QrCode className="w-16 h-16 mb-2 opacity-50" />
              <span className="text-xs font-medium">Memuat QRIS...</span>
            </div>
          )}
          
          <div className="w-full pt-4 border-t border-slate-100 border-dashed">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tagihan</div>
            <div className="font-black text-3xl text-[#0f7636]">Rp {totalHarga?.toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-8 text-left relative z-10">
          <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0f7636]" /> Upload Bukti Transfer
          </label>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group
              ${buktiUrl ? 'border-[#0f7636]' : 'border-slate-300 hover:border-[#0f7636] hover:bg-[#0f7636]/5'}`}
          >
            {buktiUrl ? (
              <>
                <img src={buktiUrl} alt="Bukti Transfer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-sm flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Ganti Gambar
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#0f7636]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6 text-[#0f7636]" />
                </div>
                <p className="text-sm font-bold text-slate-700">Klik untuk unggah gambar</p>
                <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG (Max 5MB)</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />
          </div>
        </div>

        {/* Tombol Konfirmasi */}
        <button 
          onClick={handleUploadBukti} 
          disabled={isProcessing || !buktiUrl} 
          className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 relative z-10
            bg-[#0f7636] hover:bg-green-800 text-white shadow-lg shadow-green-700/30
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-[#0f7636]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Memverifikasi...
            </span>
          ) : (
            <><CheckCircle2 className="w-5 h-5" /> Konfirmasi Pembayaran</>
          )}
        </button>
      </div>
    </div>
  );
}