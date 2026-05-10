import { useState, useEffect } from 'react';
import { BadgePercent, Star, Plus, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function StudentHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await api.get(`/menus/`);
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (existingCart.length > 0 && existingCart[0].id_umkm !== product.id_umkm) {
      alert("Kamu hanya bisa memesan dari satu kantin/UMKM dalam satu pesanan.");
      return;
    }
    const cartItem = { ...product, jumlah: 1 };
    const existingItemIndex = existingCart.findIndex((item: any) => item.id_menu === product.id_menu);
    if (existingItemIndex >= 0) existingCart[existingItemIndex].jumlah += 1;
    else existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${product.nama_menu} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-green-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="relative z-10 max-w-lg">
          <span className="bg-amber-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Student Week</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Fuel Your Exams with 50% Off</h1>
          <p className="text-green-100 mb-6">Exclusive deals from top campus UMKM vendors just for IPB students.</p>
          <button className="bg-white text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">Claim Voucher</button>
        </div>
        <div className="hidden md:block w-64 h-64 bg-green-700/50 rounded-full blur-2xl absolute right-10"></div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Today</h2>
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Mencari menu lezat...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-3xl border border-gray-100">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Belum ada UMKM yang menambahkan menu saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link to={`/product/${product.id_menu}`} key={product.id_menu} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all flex flex-col h-full">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden shrink-0">
                  {product.foto_url && product.foto_url.includes('http') ? (
                    <img src={product.foto_url} alt={product.nama_menu} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-800 font-bold text-xs">IMG</div>
                  )}
                </div>
                
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{product.nama_menu}</h3>
                  {/* KLIK MENUJU STORE DETAIL */}
                  <div 
                    onClick={(e) => { e.preventDefault(); navigate(`/store/${product.id_umkm}`); }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-800 transition-colors cursor-pointer"
                  >
                    <Store className="w-3 h-3" /> <span className="line-clamp-1">{product.nama_toko || 'Kantin Kampus'}</span>
                  </div>
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