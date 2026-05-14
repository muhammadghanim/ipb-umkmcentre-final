import { useState, useEffect, useRef } from 'react';
import { Star, Plus, Store, Utensils, Coffee, Cookie, Zap, Wallet, X, Ticket, Copy, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function StudentHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const productSectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Semua', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Makanan', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Minuman', icon: <Coffee className="w-4 h-4" /> },
    { name: 'Snack', icon: <Cookie className="w-4 h-4" /> },
    { name: 'Promo', icon: <Zap className="w-4 h-4" /> },
    { name: 'Menu Hemat', icon: <Wallet className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseMenu = await api.get(`/menus/`);
        const shuffled = responseMenu.data.sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      } finally {
        setIsLoading(false);
      }

      try {
        const responsePromo = await api.get(`/promo/`);
        setPromos(responsePromo.data);
      } catch (error) {
        console.error("Gagal mengambil data promo:", error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(slideInterval);
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
    if (activeCategory === 'Menu Hemat') return product.harga <= 15000;
    return product.kategori === activeCategory;
  });

  useEffect(() => {
    if (searchQuery) setActiveCategory('Semua');
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchParams({});
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setTimeout(() => {
      productSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000); 
  };

  return (
    <div className="space-y-12 pb-16">
      
      {!searchQuery && (
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 h-[420px] md:h-[360px] group transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/70">
          
          {/* BANNER 1 (ORANYE) */}
          <div className={`absolute inset-0 bg-gradient-to-br from-[#e8811e] to-[#ff9f43] p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between transition-all duration-1000 ease-in-out ${currentSlide === 0 ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}>
            <div className="relative z-20 max-w-xl w-full text-center md:text-left order-2 md:order-1 mt-6 md:mt-0">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider mb-4 inline-flex items-center gap-2 border border-white/20 shadow-sm">
                <Wallet className="w-4 h-4" /> Edisi Hemat Mahasiswa
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tighter drop-shadow-md">Makan Kenyang,<br /> Dompet Aman!</h1>
              <p className="text-orange-50 mb-8 text-sm md:text-base font-medium opacity-90 max-w-md mx-auto md:mx-0">Kurasi menu spesial di bawah <strong className='text-white font-bold'>Rp 15.000</strong> khusus untuk kamu yang berjuang di tanggal tua.</p>
              
              <button 
                onClick={() => handleCategoryClick('Menu Hemat')}
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

          {/* BANNER 2 (HIJAU) - TATA LETAK DIREVISI */}
          <div className={`absolute inset-0 bg-gradient-to-br from-[#0f7636] to-[#16a34a] p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between transition-all duration-1000 ease-in-out ${currentSlide === 1 ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}>
            <div className="relative z-20 max-w-xl w-full text-center md:text-left order-2 md:order-1 mt-6 md:mt-0">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider mb-4 inline-flex items-center gap-2 border border-white/20 shadow-sm">
                <Ticket className="w-4 h-4" /> Promo Spesial UMKM
              </span>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tighter drop-shadow-md">Klaim Voucher,<br /> Diskon Spesial!</h1>
              
              <p className="text-green-50 mb-8 text-sm md:text-base font-medium opacity-90 max-w-md mx-auto md:mx-0">Dapatkan kode promo dari berbagai kantin favoritmu dan nikmati <strong className='text-white font-bold'>potongan harga</strong> langsung saat checkout.</p>
              
              <button 
                onClick={() => handleCategoryClick('Promo')}
                className="bg-white text-[#0f7636] font-extrabold px-10 py-4 rounded-2xl hover:bg-green-50 hover:shadow-2xl hover:shadow-green-900/30 transition-all shadow-md hover:-translate-y-1 w-full md:w-auto text-lg"
              >
                Lihat Kode Promo
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

      <div ref={productSectionRef} className='space-y-6 scroll-mt-24 pt-2'>
        
        {/* BAGIAN TIKET VOUCHER */}
        {activeCategory === 'Promo' && (
          <div className="mb-10 bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2.5 rounded-xl shadow-sm">
                <Ticket className="w-6 h-6 text-[#e8811e]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Klaim Kode Promo</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Salin kode di bawah ini dan gunakan saat checkout!</p>
              </div>
            </div>

            {promos.length === 0 ? (
              <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-orange-200">
                <Ticket className="w-10 h-10 text-orange-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Belum ada UMKM yang membagikan promo hari ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {promos.map((promo, idx) => (
                  <div key={idx} className="bg-white border-2 border-dashed border-orange-200 rounded-2xl flex relative overflow-hidden group hover:border-[#e8811e] transition-colors shadow-sm hover:shadow-md">
                    <div className="w-4 h-4 bg-orange-50 rounded-full absolute -left-2 top-1/2 -translate-y-1/2 border-r-2 border-dashed border-orange-200 group-hover:border-[#e8811e] transition-colors z-10"></div>
                    <div className="w-4 h-4 bg-orange-50 rounded-full absolute -right-2 top-1/2 -translate-y-1/2 border-l-2 border-dashed border-orange-200 group-hover:border-[#e8811e] transition-colors z-10"></div>
                    
                    <div className="p-5 flex-1 border-r-2 border-dashed border-orange-100">
                      <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{promo.nama_toko || 'Voucher UMKM'}</div>
                      <div className="text-2xl font-black text-[#e8811e] mb-2 leading-none">
                        Diskon {promo.nominal_diskon >= 1000 ? `Rp${(promo.nominal_diskon/1000)}k` : `${promo.nominal_diskon}%`}
                      </div>
                      <div className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block tracking-widest uppercase">
                        {promo.kode_promo}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => copyPromoCode(promo.kode_promo)}
                      className="w-16 bg-orange-50 hover:bg-[#e8811e] text-[#e8811e] hover:text-white flex flex-col items-center justify-center transition-colors group/btn shrink-0"
                    >
                      {copiedCode === promo.kode_promo ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-extrabold uppercase">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mb-1 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-[10px] font-extrabold uppercase">Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BAGIAN DAFTAR MENU (DISEMBUNYIKAN SAAT TAB PROMO AKTIF) */}
        {activeCategory !== 'Promo' && (
          <>
            <div className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm shadow-slate-100/50 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                {searchQuery ? 'Semua Hasil' : activeCategory === 'Menu Hemat' ? 'Paket Hemat (< Rp15k)' : activeCategory === 'Semua' ? 'Trending Hari Ini' : activeCategory}
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
          </>
        )}
      </div>
    </div>
  );
}