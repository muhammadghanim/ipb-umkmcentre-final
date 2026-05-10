import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit3, Trash2, X, UploadCloud } from 'lucide-react';
import api from '../../services/api';

export default function Inventory() {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama_menu: '',
    harga: '',
    stok: '',
    kategori: '',
    deskripsi: ''
  });

  // State khusus untuk file gambar dan preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const UMKM_ID = localStorage.getItem('UMKM_ID');

  const fetchMenus = async () => {
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
    if (UMKM_ID) fetchMenus();
  }, []);

  // Fungsi untuk menangani saat file gambar dipilih
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Membuat URL sementara untuk menampilkan preview gambar
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CATATAN PENTING:
    // Saat ini backend Anda (models.py) hanya menerima URL string untuk 'foto_url'.
    // Idealnya, file dikirim sebagai FormData ke endpoint khusus UploadFile di FastAPI.
    // Untuk sementara, kita mengirim previewUrl/dummy URL agar data bisa tersimpan ke DB.
    
    const dummyUrl = previewUrl || "https://via.placeholder.com/150?text=No+Image";

    try {
      await api.post(`/menus/umkm/${UMKM_ID}`, {
        nama_menu: formData.nama_menu,
        harga: parseFloat(formData.harga),
        stok: parseInt(formData.stok),
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        foto_url: dummyUrl, 
        is_available: true
      });
      
      // Reset form
      setShowForm(false);
      setFormData({ nama_menu: '', harga: '', stok: '', kategori: '', deskripsi: '' });
      setImageFile(null);
      setPreviewUrl('');
      
      fetchMenus();
      alert("Produk berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambah produk:", error);
      alert("Gagal menambahkan produk. Cek console log.");
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Update menu listings, stock availability, and pricing.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Form Tambah Produk */}
      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tambahkan Menu Baru</h2>
            <button onClick={() => {
              setShowForm(false);
              setPreviewUrl('');
              setImageFile(null);
            }} className="text-gray-400 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Area Upload Gambar */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Menu</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 hover:border-green-800 transition-all overflow-hidden relative"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <UploadCloud className="w-10 h-10 text-green-800 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Max. 2MB)</p>
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

            {/* Input Data Lainnya */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
              <input required type="text" placeholder="Misal: Nasi Goreng Gila" value={formData.nama_menu} onChange={(e) => setFormData({...formData, nama_menu: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input required type="number" placeholder="15000" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
              <input required type="number" placeholder="20" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select required value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none bg-white">
                <option value="">Pilih Kategori...</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Menu</label>
              <textarea rows={3} placeholder="Beri penjelasan singkat tentang kelezatan menu ini..." value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none resize-none" />
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-green-800 hover:bg-green-900 text-white font-medium py-3 px-8 rounded-xl transition-colors">
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar ... */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-800 transition-colors" />
          <input type="text" placeholder="Search by product name or category..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-800/10 focus:border-green-800 outline-none transition-all shadow-sm" />
        </div>
        <button className="px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-600 font-medium flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" /> Filters
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Stock Status</th>
                <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Memuat data dari database...</td></tr>
              )}
              {!isLoading && menus.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada menu. Silakan tambahkan produk baru.</td></tr>
              )}

              {menus.map((item) => (
                <tr key={item.id_menu} className="hover:bg-green-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden shadow-inner shrink-0">
                        {item.foto_url && item.foto_url.includes('blob:') ? (
                          <img src={item.foto_url} alt={item.nama_menu} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-green-50 flex items-center justify-center text-green-800 text-[10px] font-bold">IMG</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg group-hover:text-green-800 transition-colors">{item.nama_menu}</div>
                        <div className="text-sm text-gray-400 font-medium">SKU: {item.id_menu.substring(0,8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider">
                      {item.kategori || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-gray-900">Rp {item.harga.toLocaleString('id-ID')}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.stok > 0 && item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-bold ${item.stok > 0 && item.is_available ? 'text-green-700' : 'text-red-700'}`}>
                          {item.stok > 0 && item.is_available ? `${item.stok} Units` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit3 className="w-5 h-5" /></button>
                      <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                      <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"><MoreVertical className="w-5 h-5" /></button>
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