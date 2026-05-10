import { useState, useEffect } from 'react';
import { Heart, Star, Minus, Plus, ShoppingBag, Store, MessageSquare } from 'lucide-react';
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
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
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
    return true;
  };

  if (isLoading) return <div className="text-center py-20">Memuat detail produk...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Produk tidak ditemukan.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gambar Produk */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-3xl relative overflow-hidden flex items-center justify-center">
              {product.foto_url ? (
                 <img src={product.foto_url} alt={product.nama_menu} className="w-full h-full object-cover" />
              ) : ( <span className="text-gray-400 font-bold text-xl">NO IMAGE</span> )}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.nama_menu}</h1>
            
            {/* KLIK MENUJU STORE DETAIL */}
            <Link to={`/store/${product.id_umkm}`} className="text-md font-medium text-gray-500 hover:text-green-800 mb-4 flex items-center gap-2 w-fit transition-colors">
              <Store className="w-4 h-4" /> {product.nama_toko || 'Mitra UMKM IPB'}
            </Link>
            
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" /> <span className="ml-1 text-gray-900 font-bold">{product.rating_rata_rata || 0}</span>
              </div>
              <span className="text-gray-500 underline">{product.jumlah_ulasan || 0} Reviews</span>
            </div>

            <div className="text-3xl font-bold text-green-800 mb-6">Rp {product.harga.toLocaleString('id-ID')}</div>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.deskripsi || "Belum ada deskripsi untuk produk ini."}</p>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Quantity (Sisa Stok: {product.stok})</h3>
              <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-white rounded-lg shadow-sm hover:text-green-800"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stok, quantity + 1))} className="p-2 bg-white rounded-lg shadow-sm hover:text-green-800"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button onClick={(e) => { e.preventDefault(); if (addToCartLogic()) navigate('/cart'); }} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-amber-600/20">
                Pre-order Now
              </button>
              <button onClick={(e) => { e.preventDefault(); if (addToCartLogic()) alert("Berhasil dimasukkan ke keranjang!"); }} className="w-full border-2 border-green-800 text-green-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ulasan */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Ulasan Pembeli</h2>
        <div className="space-y-6">
          {reviews.length === 0 ? <p className="text-gray-500 text-sm">Belum ada ulasan untuk produk ini.</p> : (
            reviews.map((rev) => (
              <div key={rev.id_ulasan} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-bold text-gray-900">{rev.nama_mahasiswa}</div>
                  <div className="flex text-amber-400">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />))}</div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{rev.komentar}</p>
                {rev.balasan_umkm && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 ml-6">
                    <div className="text-xs font-bold text-green-800 mb-1">Balasan Penjual</div>
                    <p className="text-gray-700 text-sm">{rev.balasan_umkm}</p>
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