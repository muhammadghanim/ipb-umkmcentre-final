import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Store, Phone, Info, Star, Plus, BadgePercent } from 'lucide-react';
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
    alert(`${product.nama_menu} ditambahkan ke keranjang!`);
  };

  if (isLoading) return <div className="text-center py-20">Memuat profil toko...</div>;
  if (!store) return <div className="text-center py-20 text-red-500">Toko tidak ditemukan.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Banner & Profil Toko */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-800 shrink-0 border-4 border-green-50">
          <Store className="w-12 h-12" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.nama_toko}</h1>
          <p className="text-gray-500 mb-4">{store.deskripsi || "UMKM Mitra IPB Food Hub"}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <Phone className="w-4 h-4 text-green-800" /> {store.no_whatsapp || "Tidak ada kontak"}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <Info className="w-4 h-4 text-green-800" /> {store.is_verified ? "Terverifikasi" : "Mitra Aktif"}
            </span>
          </div>
        </div>
      </div>

      {/* Katalog Menu */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Semua Produk di {store.nama_toko}</h2>
        {menus.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 text-gray-500">
            Toko ini belum menambahkan menu.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {menus.map((product) => (
              <Link to={`/product/${product.id_menu}`} key={product.id_menu} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all flex flex-col h-full">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden shrink-0">
                  {product.foto_url && product.foto_url.includes('http') ? (
                    <img src={product.foto_url} alt={product.nama_menu} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-800 font-bold text-xs">IMG</div>
                  )}
                  <button onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-500 hover:text-red-500 transition-colors z-10"><BadgePercent className="w-4 h-4" /></button>
                </div>
                
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{product.nama_menu}</h3>
                </div>
                
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="font-bold text-green-800">Rp {product.harga.toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-amber-500 mt-0.5">
                      <Star className="w-3 h-3 fill-current" /> {product.rating_rata_rata || 0}
                    </div>
                  </div>
                  <button onClick={(e) => handleAddToCart(e, product)} className="bg-green-50 text-green-800 hover:bg-green-800 hover:text-white p-2.5 rounded-xl transition-colors">
                    <Plus className="w-4 h-4" />
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