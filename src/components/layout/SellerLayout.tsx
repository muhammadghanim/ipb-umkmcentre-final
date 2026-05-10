import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ChevronRight, Star, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function SellerLayout() {
  const location = useLocation();
  const [storeName, setStoreName] = useState("Loading...");
  const UMKM_ID = localStorage.getItem('UMKM_ID');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/umkm/${UMKM_ID}`);
        setStoreName(res.data.nama_toko);
      } catch (error) { console.error(error); }
    };
    if (UMKM_ID) fetchProfile();
  }, [UMKM_ID]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard' },
    { name: 'Inventory', icon: Package, path: '/seller/inventory' },
    { name: 'Orders', icon: ShoppingBag, path: '/seller/orders' },
    { name: 'Promo', icon: Ticket, path: '/seller/promo' },
    { name: 'Reviews', icon: Star, path: '/seller/reviews' },
    { name: 'Settings', icon: Settings, path: '/seller/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-900/20">
              {storeName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-gray-900 leading-none truncate">{storeName}</h1>
              <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Mitra IPB</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive ? 'bg-green-800 text-white shadow-lg shadow-green-900/20 font-semibold' : 'text-gray-500 hover:bg-green-50 hover:text-green-800'}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-green-800'}`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl w-full transition-all font-medium text-sm">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto"><Outlet /></main>
    </div>
  );
}