import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Store, Phone, CheckCircle2, Star, Plus, Utensils, MapPin, ShoppingBag } from 'lucide-react';
import api from '../../services/api';

export default function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeRes = await api.get(`/users/umkm/${id}`);
        setStore(storeRes.data);
        
        const menuRes = await api.get(`/menus/umkm/${id}`);
        setMenus(menuRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchStoreData();
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (existingCart.length > 0 && existingCart[0].id_umkm !== product.id_umkm) {
      alert("Kamu hanya bisa memesan dari satu kantin/UMKM dalam satu pesanan!");
      return;
    }
    const cartItem = { ...product, jumlah: 1 };
    const existingIndex = existingCart.findIndex((item: any) => item.id_menu === product.id_menu);
    if (existingIndex >= 0) existingCart[existingIndex].jumlah += 1;
    else existingCart.push(cartItem);
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger event agar Navbar update angka keranjang secara real-time
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.nama_menu} ditambahkan ke keranjang!`);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f7636]"></div>
      <p className="text-slate-500 font-medium">Memuat profil kantin...</p>
    </div>
  );

  if (!store) return (
    <div className="text-center py-32 text-red-500 bg-white rounded-3xl shadow-sm border border-slate-100">
      <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <h2 className="text-2xl font-bold mb-2">Toko Tidak Ditemukan</h2>
      <p className="text-slate-500">Mitra UMKM yang kamu cari mungkin tidak tersedia.</p>
      <button onClick={() => navigate('/')} className="mt-6 text-[#0f7636] font-bold hover:underline">Kembali ke Beranda</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Banner & Profil Toko Premium */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        {/* Latar Belakang Dekoratif */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#0f7636]/20 to-[#e8811e]/20"></div>
        
        <div className="px-8 pb-8 pt-20 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end">
          {/* Avatar Toko */}
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-[#0f7636] shrink-0 border-4 border-white shadow-lg shadow-slate-200/50">
            <Store className="w-14 h-14" />
          </div>
          
          {/* Info Utama */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-slate-900">{store.nama_toko}</h1>
              <span className="inline-flex items-center justify-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full w-fit mx-auto md:mx-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mitra Aktif
              </span>
            </div>
            
            <p className="text-slate-500 mb-5 max-w-2xl text-sm md:text-base leading-relaxed">
              {store.deskripsi || "Menyediakan berbagai hidangan lezat dan berkualitas untuk memenuhi kebutuhan energi harian mahasiswa IPB."}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <Phone className="w-4 h-4 text-[#0f7636]" /> {store.no_whatsapp || "Kontak belum tersedia"}
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <MapPin className="w-4 h-4 text-[#e8811e]" /> {store.lokasi_toko || "Lokasi belum tersedia"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Katalog Menu */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[#0f7636]" /> Menu Andalan
          </h2>
          <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{menus.length} Menu</span>
        </div>

        {menus.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium text-lg">Toko ini belum menambahkan menu.</p>
            <p className="text-slate-400 text-sm mt-1">Silakan cek kembali nanti atau cari di toko lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {menus.map((product) => (
              <Link to={`/product/${product.id_menu}`} key={product.id_menu} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                
                <div className="aspect-[4/3] bg-slate-100 rounded-xl mb-4 relative overflow-hidden shrink-0">
                  {product.foto_url ? (
                    <img 
                      src={product.foto_url} 
                      alt={product.nama_menu} 
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found'; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Utensils className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  )}
                  {product.is_promo && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">PROMO</div>
                  )}
                </div>
                
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-slate-900 line-clamp-2 leading-snug">{product.nama_menu}</h3>
                </div>
                
                <div className="mt-5 flex items-end justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-[#0f7636]">Rp {product.harga.toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-xs font-bold w-fit">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {product.rating_rata_rata || '0.0'}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => handleAddToCart(e, product)} 
                    className="bg-[#0f7636] text-white hover:bg-green-800 shadow-sm hover:shadow-md w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}