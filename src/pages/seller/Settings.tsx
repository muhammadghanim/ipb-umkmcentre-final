import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Save, Store, Phone, FileText, QrCode, CheckCircle2, MapPin } from 'lucide-react';
import api from '../../services/api';

export default function SellerSettings() {
  const [profile, setProfile] = useState({ nama_toko: '', no_whatsapp: '', deskripsi: '', lokasi_toko: '' });
  const [qrisUrl, setQrisUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const UMKM_ID = localStorage.getItem('UMKM_ID');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/umkm/${UMKM_ID}`);
        setProfile({
          nama_toko: res.data.nama_toko || '',
          no_whatsapp: res.data.no_whatsapp || '',
          deskripsi: res.data.deskripsi || '',
          lokasi_toko: res.data.lokasi_toko || ''
        });
        if (res.data.qris_url) setQrisUrl(res.data.qris_url);
      } catch (error) { 
        console.error(error); 
      }
    };
    if (UMKM_ID) fetchProfile();
  }, [UMKM_ID]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setQrisUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Simpan Profil
      await api.patch(`/users/umkm/${UMKM_ID}/profile`, profile);
      
      // 2. Simpan QRIS jika ada
      if (qrisUrl) {
        await api.patch(`/users/umkm/${UMKM_ID}/qris`, { qris_url: qrisUrl });
      }
      
      // Update nama toko di localStorage agar Header/Sidebar langsung berubah
      localStorage.setItem('NAMA_TOKO', profile.nama_toko);
      
      alert("Pengaturan Toko Berhasil Diperbarui!");
      window.location.reload(); // Refresh untuk update UI secara menyeluruh
    } catch (error) {
      alert("Gagal memperbarui pengaturan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Pengaturan Toko</h1>
        <p className="text-slate-500 font-medium">Perbarui profil informasi kantin dan metode pembayaran QRIS Anda di sini.</p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* PROFIL TOKO */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#0f7636]"></div>
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-[#0f7636]/10 text-[#0f7636] rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Informasi Dasar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Store className="w-4 h-4 text-slate-400" /> Nama Toko / Kantin
              </label>
              <input 
                required 
                type="text" 
                placeholder="Misal: Kantin Fakultas Pertanian"
                value={profile.nama_toko} 
                onChange={(e) => setProfile({...profile, nama_toko: e.target.value})} 
                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Nomor WhatsApp
              </label>
              <input 
                type="text" 
                placeholder="Cth: 08123456789"
                value={profile.no_whatsapp} 
                onChange={(e) => setProfile({...profile, no_whatsapp: e.target.value})} 
                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Lokasi Toko / Kantin
              </label>
              <input 
                type="text" 
                placeholder="Misal: Kantin Stevia, Fakultas Pertanian"
                value={profile.lokasi_toko} 
                onChange={(e) => setProfile({...profile, lokasi_toko: e.target.value})} 
                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Deskripsi Singkat Toko
              </label>
              <textarea 
                rows={3} 
                placeholder="Ceritakan sedikit tentang menu andalan atau keunggulan kantin Anda..."
                value={profile.deskripsi} 
                onChange={(e) => setProfile({...profile, deskripsi: e.target.value})} 
                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none resize-none transition-all font-medium"
              ></textarea>
            </div>
          </div>
        </div>

        {/* QRIS UPLOAD */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#e8811e]"></div>
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-[#e8811e]/10 text-[#e8811e] rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Konfigurasi Pembayaran</h2>
          </div>

          <p className="text-sm font-medium text-slate-500 mb-4">
            Upload gambar barcode QRIS Anda di sini. Mahasiswa akan men-scan barcode ini untuk melakukan pembayaran pesanan.
          </p>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-sm aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group
              ${qrisUrl ? 'border-[#0f7636] bg-slate-50' : 'border-slate-300 hover:border-[#0f7636] hover:bg-[#0f7636]/5'}`}
          >
            {qrisUrl ? (
              <>
                <img src={qrisUrl} alt="QRIS" className="w-full h-full object-contain mix-blend-multiply p-4" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-sm">
                    <UploadCloud className="w-4 h-4" /> Ganti Gambar QRIS
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-[#0f7636]" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Klik untuk upload QRIS</h3>
                <p className="text-xs text-slate-500 font-medium">Format: JPG, PNG (Max 5MB)</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSaving} 
            className="bg-[#0f7636] hover:bg-green-800 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-green-700/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Menyimpan...
              </span>
            ) : (
              <><Save className="w-5 h-5" /> Simpan Semua Perubahan</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}