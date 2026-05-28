import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, X, UploadCloud, Utensils, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

export default function Inventory() {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama_menu: '',
    harga: '',
    stok: '',
    kategori: '',
    deskripsi: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState(''); // State baru untuk filter

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const UMKM_ID = localStorage.getItem('UMKM_ID');

  const fetchMenus = async () => {
    if (!UMKM_ID || UMKM_ID === "null") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/menus/umkm/${UMKM_ID}`);
      setMenus(response.data);
    } catch (error) {
      console.error("Gagal mengambil data inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [UMKM_ID]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nama_menu: '', harga: '', stok: '', kategori: '', deskripsi: '' });
    setImageFile(null);
    setPreviewUrl('');
    setBase64Image('');
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id_menu);
    setFormData({
      nama_menu: item.nama_menu,
      harga: item.harga.toString(),
      stok: item.stok.toString(),
      kategori: item.kategori,
      deskripsi: item.deskripsi || ''
    });
    setPreviewUrl(item.foto_url || '');
    setBase64Image(item.foto_url || ''); 
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await api.delete(`/menus/${id}`);
        alert("Produk berhasil dihapus!");
        fetchMenus();
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        alert("Gagal menghapus produk. Silakan coba lagi.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!UMKM_ID || UMKM_ID === "null") {
      alert("Akses ditolak: Sesi login UMKM tidak valid. Silakan kembali ke halaman Login dan masuk sebagai Penjual terlebih dahulu.");
      return;
    }

    const finalImageUrl = base64Image || "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";

    const payload = {
      nama_menu: formData.nama_menu,
      harga: parseFloat(formData.harga),
      stok: parseInt(formData.stok),
      kategori: formData.kategori,
      deskripsi: formData.deskripsi,
      foto_url: finalImageUrl, 
      is_available: parseInt(formData.stok) > 0
    };

    try {
      if (editingId) {
        await api.put(`/menus/${editingId}`, payload);
        alert("Produk berhasil diperbarui!");
      } else {
        await api.post(`/menus/umkm/${UMKM_ID}`, payload);
        alert("Produk berhasil ditambahkan!");
      }
      
      resetForm();
      fetchMenus();
    } catch (error: any) {
      console.error("Gagal menyimpan produk:", error);
      alert(`Gagal menyimpan produk: ${error.response?.data?.detail || "Cek console log"}`);
    }
  };

  // LOGIKA PENCARIAN & FILTER DIPERBARUI
  const filteredMenus = menus.filter(item => {
    const query = searchQuery.toLowerCase();
    const namaMatch = item.nama_menu?.toLowerCase().includes(query);
    const skuMatch = item.id_menu?.toLowerCase().includes(query);
    const searchMatch = namaMatch || skuMatch;

    const kategoriMatch = filterKategori === '' || item.kategori === filterKategori;

    return searchMatch && kategoriMatch;
  });

  return (
    <div className="space-y-8 relative pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Manajemen Inventori</h1>
          <p className="text-slate-500 font-medium">Kelola daftar menu, ketersediaan stok, dan harga produkmu.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#0f7636] hover:bg-green-800 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-700/20 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#0f7636]"></div>
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? "Edit Menu Produk" : "Tambahkan Menu Baru"}
            </h2>
            <button onClick={resetForm} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-3">Foto Menu</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group
                  ${previewUrl ? 'border-[#0f7636]' : 'border-slate-300 hover:border-[#0f7636] hover:bg-[#0f7636]/5'}`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                        <UploadCloud className="w-4 h-4" /> Ganti Foto
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-14 h-14 bg-[#0f7636]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="w-6 h-6 text-[#0f7636]" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Klik untuk upload foto menu</p>
                    <p className="text-xs text-slate-500 mt-1">Format yang didukung: PNG, JPG (Maks. 2MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-2">Nama Menu</label>
              <input required type="text" placeholder="Misal: Nasi Goreng Gila Spesial" value={formData.nama_menu} onChange={(e) => setFormData({...formData, nama_menu: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Harga (Rp)</label>
              <input required type="number" placeholder="15000" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Stok</label>
              <input required type="number" placeholder="20" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all bg-slate-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-2">Kategori</label>
              <select required value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all bg-slate-50">
                <option value="">Pilih Kategori...</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-2">Deskripsi Menu</label>
              <textarea rows={3} placeholder="Beri penjelasan singkat yang menggugah selera tentang menu ini..." value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none resize-none transition-all bg-slate-50" />
            </div>

            <div className="md:col-span-2 flex justify-end mt-4 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors mr-3">
                Batal
              </button>
              <button type="submit" className="bg-[#0f7636] hover:bg-green-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md">
                {editingId ? "Simpan Perubahan" : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0f7636] transition-colors" />
          <input 
            type="text" 
            placeholder="Cari nama produk atau SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all shadow-sm font-medium" 
          />
        </div>
        
        {/* Tombol filter diubah menjadi dropdown select yang berfungsi */}
        <div className="relative">
          <select 
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="appearance-none px-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm outline-none cursor-pointer h-full"
          >
            <option value="">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Snack">Snack</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Info Produk</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status Stok</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f7636] mx-auto mb-3"></div>
                    <span className="text-slate-500 font-medium">Memuat data dari database...</span>
                  </td>
                </tr>
              )}
              
              {!isLoading && (!menus || menus.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <Utensils className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada menu</h3>
                    <p className="text-slate-500">Silakan tambahkan produk pertamamu agar mahasiswa bisa mulai memesan.</p>
                  </td>
                </tr>
              )}

              {!isLoading && menus && menus.length > 0 && filteredMenus.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Produk tidak ditemukan</h3>
                    <p className="text-slate-500">Tidak ada produk yang cocok dengan filter atau pencarian saat ini.</p>
                  </td>
                </tr>
              )}

              {filteredMenus.map((item) => (
                <tr key={item.id_menu} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shadow-inner shrink-0 border border-slate-200/50">
                        {item.foto_url ? (
                          <img 
                            src={item.foto_url} 
                            alt={item.nama_menu} 
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/e2e8f0/64748b?text=No+Image'; }}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Utensils className="w-6 h-6 opacity-40" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="font-bold text-slate-900 text-base mb-0.5">{item.nama_menu}</div>
                        <div className="text-xs text-slate-400 font-medium font-mono bg-slate-100 px-2 py-0.5 rounded w-fit">
                          SKU: {item.id_menu?.substring(0,8).toUpperCase() || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
                      {item.kategori || 'UNCATEGORIZED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-slate-900 whitespace-nowrap">Rp {item.harga?.toLocaleString('id-ID') || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${item.stok > 0 && item.is_available ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.stok > 0 && item.is_available ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                      <span className="text-xs font-extrabold uppercase tracking-wider">
                        {item.stok > 0 && item.is_available ? `${item.stok} Tersedia` : 'Habis'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
                        title="Edit Menu"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id_menu)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}