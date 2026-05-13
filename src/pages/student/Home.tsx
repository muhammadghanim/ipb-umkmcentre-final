import { useState, useEffect, useRef } from 'react';
import { Star, Plus, Store, Utensils, Coffee, Cookie, Zap, Timer, Wallet, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function StudentHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({h: '00', m: '00', s: '00'});
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // 1. MEMBUAT REFERENSI UNTUK BAGIAN PRODUK
  const productSectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Semua', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Makanan', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Minuman', icon: <Coffee className="w-4 h-4" /> },
    { name: 'Snack', icon: <Cookie className="w-4 h-4" /> },
    { name: 'Promo', icon: <Zap className="w-4 h-4" /> },
    { name: 'Tanggal Tua', icon: <Wallet className="w-4 h-4" /> },
  ];

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

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // KONFIGURASI TARGET WAKTU FLASH SALE
  const TARGET_JAM = 12; 
  const TARGET_MENIT = 0;

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date();
      let target = new Date();
      
      target.setHours(TARGET_JAM, TARGET_MENIT, 0, 0); 
      if (now.getTime() > target.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      
      const diff = target.getTime() - now.getTime();
      const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      
      setTimeLeft({h, m, s});
    }, 1000);
    return () => clearInterval(timerInterval);
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
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.nama_menu} berhasil ditambahkan ke keranjang!`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nama_menu.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.nama_toko && product.nama_toko.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!matchesSearch) return false;
    if (activeCategory === 'Semua') return true;
    if (activeCategory === 'Promo') return product.is_promo;
    if (activeCategory === 'Tanggal Tua') return product.harga <= 15000;
    return product.kategori === activeCategory;
  });

  useEffect(() => {
    if (searchQuery) setActiveCategory('Semua');
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchParams({});
  };

  // 2. FUNGSI UNTUK MENGGULIR HALAMAN SECARA MULUS
  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    // Tunggu sedikit agar state terupdate, lalu gulir
    setTimeout(() => {
      productSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {!searchQuery && (
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 h-[420px] md:h-[360px] group transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/70">
          
          <div className={`absolute inset-0 bg-gradient-to-br from-[#e8811e] to-[#ff9f43] p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between transition-all duration-1000 ease-in-out ${currentSlide === 0 ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}>
            <div className="relative z-20 max-w-xl w-full text-center md:text-left order-2 md:order-1 mt-6 md:mt-0">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider mb-4 inline-flex items-center gap-2 border border-white/20 shadow-sm">
                <Wallet className="w-4 h-4" /> Edisi Hemat Mahasiswa
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tighter drop-shadow-md">Makan Kenyang,<br /> Dompet Aman!</h1>
              <p className="text-orange-50 mb-8 text-sm md:text-base font-medium opacity-90 max-w-md mx-auto md:mx-0">Kurasi menu spesial di bawah <strong className='text-white font-bold'>Rp 15.000</strong> khusus untuk kamu yang berjuang di tanggal tua.</p>
              
              {/* TOMBOL BANNER MEMANGGIL FUNGSI SCROLL */}
              <button 
                onClick={() => handleCategoryClick('Tanggal Tua')}
                className="bg-white text-[#e8811e] font-extrabold px-10 py-4 rounded-2xl hover:bg-orange-50 hover:shadow-2xl hover:shadow-orange-900/30 transition-all shadow-md hover:-translate-y-1 w-full md:w-auto text-lg"
              >
                Lihat Menu Hemat
              </button>
            </div>
            
            <div className="relative z-20 w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
              <div className="relative w-48 h-48 md:w-72 md:h-72">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl transform scale-110"></div>
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Pizza" 
                  className="relative w-full h-full object-cover rounded-full border-4 border-white/50 shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          <div className={`absolute inset-0 bg-gradient-to-br from-[#0f7636] to-[#16a34a] p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between transition-all duration-1000 ease-in-out ${currentSlide === 1 ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}>
            <div className="relative z-20 max-w-xl w-full text-center md:text-left order-2 md:order-1 mt-4 md:mt-0">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider mb-4 inline-flex items-center gap-2 border border-white/20 shadow-sm">
                <Timer className="w-4 h-4 animate-pulse" /> Flash Sale Jam Makan Siang
              </span>
              
              <div className="flex gap-2.5 justify-center md:justify-start items-center mb-6 font-mono font-black text-white tracking-tight drop-shadow-lg">
                <div className='flex flex-col items-center bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/40 shadow-xl'>
                  <span className='text-3xl md:text-5xl'>{timeLeft.h}</span>
                  <span className='text-[10px] text-green-50 uppercase tracking-widest font-sans font-bold mt-1'>Jam</span>
                </div>
                <span className='text-3xl md:text-4xl text-white/70'>:</span>
                <div className='flex flex-col items-center bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/40 shadow-xl'>
                  <span className='text-3xl md:text-5xl'>{timeLeft.m}</span>
                  <span className='text-[10px] text-green-50 uppercase tracking-widest font-sans font-bold mt-1'>Menit</span>
                </div>
                <span className='text-3xl md:text-4xl text-white/70'>:</span>
                <div className='flex flex-col items-center bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/40 shadow-xl'>
                  <span className='text-3xl md:text-5xl text-yellow-300'>{timeLeft.s}</span>
                  <span className='text-[10px] text-green-50 uppercase tracking-widest font-sans font-bold mt-1'>Detik</span>
                </div>
              </div>
              
              {/* TOMBOL BANNER MEMANGGIL FUNGSI SCROLL */}
              <button 
                onClick={() => handleCategoryClick('Promo')}
                className="bg-white text-[#0f7636] font-extrabold px-10 py-4 rounded-2xl hover:bg-slate-100 hover:shadow-2xl hover:shadow-green-900/30 transition-all shadow-md hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-3 text-lg"
              >
                <Zap className="w-5 h-5 text-amber-500" /> Sikat Promonya!
              </button>
            </div>
            
            <div className="relative z-20 w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
              <div className="relative w-48 h-48 md:w-72 md:h-72">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl transform scale-110"></div>
                <img 
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Burger" 
                  className="relative w-full h-full object-cover rounded-full border-4 border-white/50 shadow-2xl -rotate-6 group-hover:rotate-0 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            <button onClick={() => setCurrentSlide(0)} className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === 0 ? 'bg-white w-8 shadow-md' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}></button>
            <button onClick={() => setCurrentSlide(1)} className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === 1 ? 'bg-white w-8 shadow-md' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}></button>
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-500 mb-1">Menampilkan hasil untuk:</h2>
            <h1 className="text-3xl font-black text-[#0f7636] tracking-tighter">"{searchQuery}"</h1>
          </div>
          <button onClick={clearSearch} className="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-inner text-sm flex items-center gap-2">
            <X className="w-4 h-4"/> Hapus Pencarian
          </button>
        </div>
      )}

      <div className="space-y-5">
        {!searchQuery && <h2 className="text-2xl font-black text-slate-950 tracking-tight">Kategori Terpopuler</h2>}
        <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              // TOMBOL KATEGORI MEMANGGIL FUNGSI SCROLL
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all duration-300 border shadow-sm
                ${activeCategory === cat.name 
                  ? 'bg-[#0f7636] text-white border-[#0f7636] shadow-lg shadow-green-200' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-[#0f7636]/50 hover:bg-green-50 hover:text-[#0f7636]'}`}
            >
              <span className={`${activeCategory === cat.name ? 'text-white' : 'text-[#0f7636]'}`}>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MENEMPELKAN REFERENSI (REF) DI BAGIAN PRODUK */}
      {/* scroll-mt-24 menjaga agar bagian ini tidak tertutup navbar lengket saat di-scroll */}
      <div ref={productSectionRef} className='space-y-6 scroll-mt-24 pt-2'>
        <div className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm shadow-slate-100/50 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight">
            {searchQuery ? 'Semua Hasil' : activeCategory === 'Tanggal Tua' ? 'Paket Hemat (< Rp15k)' : activeCategory === 'Semua' ? 'Trending Hari Ini' : activeCategory}
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full shadow-inner">{filteredProducts.length} Menu ditemukan</span>
        </div>

        {isLoading ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f7636] mx-auto mb-5"></div>
            <p className="text-slate-500 font-semibold text-lg">Menyiapkan hidangan lezat...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-inner px-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
                <Store className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ups! Menu Tidak Ditemukan</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Maaf, sepertinya belum ada menu yang cocok dengan kategori atau pencarianmu.</p>
            <button onClick={() => handleCategoryClick('Semua')} className="px-8 py-3.5 bg-[#0f7636] text-white font-extrabold rounded-xl shadow-lg shadow-green-700/30 hover:bg-green-800 transition-all hover:-translate-y-1">
              Lihat Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id_menu}`} key={product.id_menu} className="bg-white rounded-3xl p-5 shadow-sm shadow-slate-100/50 border border-slate-100 group hover:shadow-2xl hover:shadow-slate-200/70 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl mb-5 relative overflow-hidden shrink-0 shadow-inner border border-slate-200/50">
                  {product.foto_url ? (
                    <img src={product.foto_url} alt={product.nama_menu} onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found'; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Utensils className="w-8 h-8 mb-2 opacity-50" />
                    </div>
                  )}
                  {product.is_promo && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider z-10">PROMO</div>
                  )}
                </div>
                
                <div className="space-y-1.5 flex-1 mb-6">
                  <h3 className="font-bold text-slate-950 text-base line-clamp-2 leading-tight group-hover:text-[#0f7636] transition-colors">{product.nama_menu}</h3>
                  <div onClick={(e) => { e.preventDefault(); navigate(`/store/${product.id_umkm}`); }} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0f7636] transition-colors cursor-pointer mt-1 bg-slate-50 w-fit px-2 py-0.5 rounded-md">
                    <Store className="w-3.5 h-3.5 text-[#e8811e]" /> <span className="line-clamp-1">{product.nama_toko || 'Kantin IPB'}</span>
                  </div>
                </div>
                
                <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xl font-black text-[#0f7636] tracking-tight">Rp {product.harga.toLocaleString('id-ID')}</span>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-lg text-xs font-extrabold w-fit border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {product.rating_rata_rata ? product.rating_rata_rata.toFixed(1) : '0.0'}
                    </div>
                  </div>
                  <button onClick={(e) => handleAddToCart(e, product)} className="bg-[#0f7636] text-white hover:bg-green-800 shadow-lg shadow-green-700/20 hover:shadow-green-700/40 w-11 h-11 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0" title="Tambah ke Keranjang">
                    <Plus className="w-6 h-6" />
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