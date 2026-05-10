import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Leaf, ClipboardList, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function StudentLayout() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const studentId = localStorage.getItem('STUDENT_ID');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-800" />
            <span className="font-bold text-xl text-green-800">IPB Food Hub</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search food, drinks, or student UMKM..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4 relative">
            <Link to="/cart" className="p-2 text-gray-600 hover:text-green-800 transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            <Link to="/history" className="p-2 text-gray-600 hover:text-green-800 transition-colors" title="Riwayat Pesanan">
              <ClipboardList className="w-6 h-6" />
            </Link>

            {studentId ? (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-2 text-gray-600 hover:text-green-800 transition-colors">
                  <User className="w-6 h-6" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold text-green-800">Login</Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}