import { useState, useEffect } from 'react';
import { Heart, Star, Minus, Plus, ShoppingBag, Store, MessageSquare, Utensils, MapPin } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailAndReviews = async () => {
      try {
        const productRes = await api.get(`/menus/${id}`);
        setProduct(productRes.data);
        const reviewRes = await api.get(`/ulasan/menu/${id}`);
        setReviews(reviewRes.data);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    if (id) fetchDetailAndReviews();
  }, [id]);

  const addToCartLogic = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (existingCart.length > 0 && existingCart[0].id_umkm !== product.id_umkm) {
      alert("Kamu hanya bisa memesan dari satu kantin/UMKM dalam satu pesanan!");
      return false;
    }
    const cartItem = { ...product, jumlah: quantity };
    const existingIndex = existingCart.findIndex((i: any) => i.id_menu === product.id_menu);
    
    if (existingIndex >= 0) existingCart[existingIndex].jumlah += quantity;
    else existingCart.push(cartItem);
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger event agar Navbar update angka keranjang secara real-time
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f7636]"></div>
      <p className="text-slate-500 font-medium">Menyiapkan detail hidangan...</p>
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-32 text-red-500 bg-white rounded-3xl shadow-sm border border-slate-100">
      <Utensils className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <h2 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h2>
      <p className="text-slate-500">Menu yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
      <button onClick={() => navigate('/')} className="mt-6 text-[#0f7636] font-bold hover:underline">Kembali ke Beranda</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Detail Utama */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Dekorasi Background Halus */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f7636]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 relative z-10">
          
          {/* Gambar Produk */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-[2rem] relative overflow-hidden flex items-center justify-center shadow-inner group">
              {product.foto_url ? (
                 <img 
                   src={product.foto_url} 
                   alt={product.nama_menu} 
                   onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/e2e8f0/64748b?text=Image+Not+Found'; }}
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 />
              ) : ( 
                <div className="flex flex-col items-center text-slate-400">
                  <Utensils className="w-12 h-12 mb-3 opacity-50" />
                  <span className="font-semibold tracking-wider">NO IMAGE</span>
                </div>
              )}
              {product.is_promo && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                  Promo
                </div>
              )}
            </div>
          </div>

          {/* Info Produk */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">{product.nama_menu}</h1>
            
            {/* Navigasi Toko & Lokasi Toko */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link to={`/store/${product.id_umkm}`} className="inline-flex items-center gap-2 text-md font-semibold text-slate-500 hover:text-[#0f7636] transition-colors bg-slate-50 hover:bg-[#0f7636]/10 px-4 py-2 rounded-xl">
                <Store className="w-5 h-5 text-[#e8811e]" /> {product.nama_toko || 'Mitra UMKM IPB'}
              </Link>
              {product.lokasi_toko && (
                <div className="inline-flex items-center gap-2 text-md font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#0f7636]" /> {product.lokasi_toko}
                </div>
              )}
            </div>
            
            {/* Rating & Ulasan */}
            <div className="flex items-center gap-4 text-sm mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-lg text-amber-800">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> 
                <span className="font-bold text-base">{product.rating_rata_rata || '0.0'}</span>
              </div>
              <span className="text-slate-500 font-medium">{product.jumlah_ulasan || 0} Ulasan Pembeli</span>
            </div>

            {/* Harga */}
            <div className="text-4xl font-extrabold text-[#0f7636] mb-6">
              Rp {product.harga.toLocaleString('id-ID')}
            </div>
            
            {/* Deskripsi */}
            <div className="mb-8 flex-1">
              <h3 className="font-bold text-slate-900 mb-2">Deskripsi Produk</h3>
              <p className="text-slate-600 leading-relaxed text-justify">
                {product.deskripsi || "Belum ada deskripsi untuk produk ini."}
              </p>
            </div>

            {/* Kontrol Kuantitas */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900">Atur Jumlah</h3>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Sisa Stok: <span className={product.stok < 10 ? "text-red-500 font-bold" : "text-slate-900"}>{product.stok}</span>
                </span>
              </div>
              
              <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 w-fit shadow-inner">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#0f7636] hover:shadow transition-all disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-16 text-center font-bold text-lg text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stok, quantity + 1))} 
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#0f7636] hover:shadow transition-all disabled:opacity-50"
                  disabled={quantity >= product.stok}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto pt-4">
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (addToCartLogic()) {
                    alert(`${quantity} ${product.nama_menu} berhasil dimasukkan ke keranjang!`);
                  } 
                }} 
                className="w-full border-2 border-[#0f7636] text-[#0f7636] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0f7636] hover:text-white transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" /> Masukkan Keranjang
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); if (addToCartLogic()) navigate('/cart'); }} 
                className="w-full bg-[#e8811e] hover:bg-[#cc6e16] text-white font-bold py-4 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-orange-500/30"
              >
                Pre-order Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Ulasan */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#0f7636]" /> Ulasan Pembeli
          </h2>
          <div className="text-right">
            <div className="font-extrabold text-2xl text-slate-900">{product.rating_rata_rata || '0.0'} <span className="text-base text-slate-400 font-medium">/ 5.0</span></div>
            <div className="text-sm text-slate-500">Dari {product.jumlah_ulasan || 0} Mahasiswa</div>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Belum ada ulasan untuk hidangan ini.</p>
              <p className="text-slate-400 text-sm mt-1">Jadilah mahasiswa pertama yang mencobanya!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id_ulasan} className="border border-slate-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-slate-900 text-lg">{rev.nama_mahasiswa}</div>
                  <div className="flex bg-amber-50 px-2 py-1 rounded-md">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 mb-4 text-justify leading-relaxed">{rev.komentar}</p>
                
                {rev.balasan_umkm && (
                  <div className="bg-[#0f7636]/5 p-4 rounded-xl border border-[#0f7636]/10 ml-6 relative">
                    <div className="absolute top-0 left-4 w-3 h-3 bg-[#0f7636]/10 rotate-45 -translate-y-1/2"></div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0f7636] mb-1.5">
                      <Store className="w-4 h-4" /> Balasan Penjual
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{rev.balasan_umkm}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}