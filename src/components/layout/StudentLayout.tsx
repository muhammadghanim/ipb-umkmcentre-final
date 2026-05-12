import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Utensils, ClipboardList, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

// 1. TAMBAHKAN IMPORT FOOTER DI SINI
// (Catatan: Ubah menjadi './Footer' jika Footer.tsx berada di dalam folder yang sama dengan layout ini)
import Footer from './Footer';

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); 

  const studentId = localStorage.getItem('STUDENT_ID');

  useEffect(() => {
    const checkCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((sum: number, item: any) => sum + (item.jumlah || 1), 0);
      setCartItemCount(total);
    };
    checkCart();
    window.addEventListener('cartUpdated', checkCart);
    return () => window.removeEventListener('cartUpdated', checkCart);
  }, [location]);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-[#0f7636]/10 p-1.5 rounded-lg group-hover:bg-[#0f7636]/20 transition-colors">
              <Utensils className="h-6 w-6 text-[#0f7636]" />
            </div>
            <span className="font-bold text-xl text-[#0f7636] tracking-tight hidden sm:block">IPB Food Hub</span>
          </Link>

          <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isSearchFocused ? 'text-[#0f7636]' : 'text-slate-400'}`}>
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Cari makanan, minuman, atau UMKM..." 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full pl-11 pr-4 py-2.5 bg-slate-100 border rounded-xl outline-none transition-all duration-300 text-sm
                ${isSearchFocused 
                  ? 'bg-white border-[#0f7636] ring-4 ring-[#0f7636]/10 shadow-sm' 
                  : 'border-transparent hover:bg-slate-200/70'}`}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-4 relative shrink-0">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-[#0f7636] hover:bg-[#0f7636]/5 rounded-full transition-all">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            <Link to="/history" className="p-2 text-slate-600 hover:text-[#0f7636] hover:bg-[#0f7636]/5 rounded-full transition-all hidden sm:block" title="Riwayat Pesanan">
              <ClipboardList className="w-6 h-6" />
            </Link>

            {studentId ? (
              <div className="relative ml-1 sm:ml-2">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)} 
                  className="flex items-center gap-2 p-1.5 border border-slate-200 hover:border-[#0f7636] rounded-full hover:shadow-sm transition-all bg-white"
                >
                  <div className="bg-slate-100 p-1.5 rounded-full text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-sm font-bold text-slate-800">Akun Mahasiswa</p>
                    </div>
                    <Link to="/history" className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-[#0f7636] hover:bg-slate-50 flex items-center gap-3 sm:hidden">
                      <ClipboardList className="w-4 h-4" /> Riwayat Pesanan
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-2 px-4 sm:px-5 py-2 text-sm font-bold text-white bg-[#0f7636] hover:bg-green-800 rounded-xl transition-colors shadow-sm hover:shadow">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* 2. TAG FOOTER DITAMBAHKAN DI SINI, DI BAWAH MAIN */}
      <Footer />
    </div>
  );
}