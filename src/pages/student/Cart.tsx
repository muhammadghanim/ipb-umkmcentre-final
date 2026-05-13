import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Store, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Ambil data dari local storage saat halaman dimuat
    setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const hapusItem = (index: number) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Trigger event agar Navbar langsung update angka badge-nya
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
  const total = subtotal + 2000; // 2000 adalah biaya platform

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Stepper Modern */}
      <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
        <div className="flex items-center text-[#0f7636] font-bold">
          <div className="w-8 h-8 rounded-full bg-[#0f7636] text-white flex items-center justify-center mr-2 shadow-md">1</div>
          Cart
        </div>
        <div className="w-12 md:w-24 h-1 bg-slate-200 mx-3 md:mx-4 rounded-full"></div>
        <div className="flex items-center text-slate-400 font-bold">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">2</div>
          Details
        </div>
        <div className="w-12 md:w-24 h-1 bg-slate-200 mx-3 md:mx-4 rounded-full"></div>
        <div className="flex items-center text-slate-400 font-bold">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">3</div>
          Payment
        </div>
      </div>

      {/* JUDUL DIKELUARKAN DARI GRID AGAR KOTAK BAWAH SEJAJAR */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Keranjang Belanja</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
          {cartItems.length} Item
        </span>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Daftar Keranjang */}
        <div className="lg:col-span-2 space-y-4">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300 shadow-sm">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Keranjang masih kosong</h3>
              <p className="text-slate-500 mb-6">Yuk, cari makanan atau minuman favoritmu!</p>
              <Link to="/" className="inline-block bg-[#0f7636] hover:bg-green-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md">
                Jelajahi Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Notifikasi UMKM - Mengingatkan user mereka memesan dari 1 toko */}
              <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-blue-100">
                <Store className="w-4 h-4 shrink-0" />
                Pesanan ini berasal dari {cartItems[0]?.nama_toko || 'satu UMKM/Kantin yang sama'}.
              </div>

              {cartItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 sm:items-center shadow-sm hover:shadow-md transition-shadow relative group">
                  
                  {/* Gambar Produk dengan Fallback */}
                  <div className="w-full sm:w-24 h-48 sm:h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    {item.foto_url ? (
                      <img 
                        src={item.foto_url} 
                        alt={item.nama_menu} 
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Image+Not+Found'; }}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Utensils className="w-6 h-6 opacity-50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info Produk */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{item.nama_menu}</h3>
                    <div className="text-[#0f7636] font-extrabold text-lg">Rp {item.harga.toLocaleString('id-ID')}</div>
                  </div>
                  
                  {/* Aksi (Qty & Hapus) */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <span className="text-slate-500 text-sm mr-2">Qty:</span>
                      <span className="font-bold text-slate-900">{item.jumlah}</span>
                    </div>
                    <button 
                      onClick={() => hapusItem(idx)} 
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Hapus item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Order Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 text-slate-600 mb-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">Biaya Platform <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Info</span></span>
                <span className="font-bold text-slate-900">Rp 2.000</span>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">Total Pembayaran</span>
                <span className="font-black text-2xl text-[#0f7636]">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-xs text-right text-slate-400">Termasuk pajak</p>
            </div>
            
            <Link 
              to="/checkout" 
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all duration-300 ${
                cartItems.length === 0 
                  ? 'bg-slate-100 text-slate-400 pointer-events-none' 
                  : 'bg-[#e8811e] hover:bg-[#cc6e16] text-white shadow-lg shadow-orange-500/30 hover:-translate-y-0.5'
              }`}
            >
              Lanjutkan ke Detail &rarr;
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}