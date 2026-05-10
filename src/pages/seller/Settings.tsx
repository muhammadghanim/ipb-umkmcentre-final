import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Save } from 'lucide-react';
import api from '../../services/api';

export default function SellerSettings() {
  const [profile, setProfile] = useState({ nama_toko: '', no_whatsapp: '', deskripsi: '' });
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
          deskripsi: res.data.deskripsi || ''
        });
        if (res.data.qris_url) setQrisUrl(res.data.qris_url);
      } catch (error) { console.error(error); }
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
      alert("Pengaturan Toko Berhasil Diperbarui!");
      window.location.reload(); // Refresh untuk update nama di sidebar
    } catch (error) {
      alert("Gagal memperbarui pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 mt-1">Perbarui profil toko dan metode pembayaran Anda.</p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* PROFIL TOKO */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Profil Toko</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko / Kantin</label>
              <input required type="text" value={profile.nama_toko} onChange={(e) => setProfile({...profile, nama_toko: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp (Cth: 08123456789)</label>
              <input type="text" value={profile.no_whatsapp} onChange={(e) => setProfile({...profile, no_whatsapp: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat Toko</label>
              <textarea rows={3} value={profile.deskripsi} onChange={(e) => setProfile({...profile, deskripsi: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* QRIS UPLOAD */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Payment Configuration</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload QRIS Barcode Anda</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-64 h-64 border-2 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all overflow-hidden relative mb-4"
          >
            {qrisUrl ? (
              <img src={qrisUrl} alt="QRIS" className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <div className="text-center">
                <UploadCloud className="w-10 h-10 text-green-800 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Klik untuk upload QRIS</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="bg-green-800 hover:bg-green-900 text-white font-bold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 w-full md:w-auto">
          <Save className="w-5 h-5" /> {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </form>
    </div>
  );
}