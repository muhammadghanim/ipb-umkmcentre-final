import { Link } from "react-router-dom";
import { Search, Bell, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartStr = localStorage.getItem("cart");
    if (cartStr) {
       const cart = JSON.parse(cartStr);
       setCartCount(cart.reduce((acc: number, item: any) => acc + item.jumlah, 0));
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8 flex-1">
            <Link to="/home" className="text-xl font-bold text-brand-green">
              IPB Food Hub
            </Link>
            
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-green focus:border-brand-green sm:text-sm text-gray-900 transition-all"
                  placeholder="Search food, drinks, or student UMKM..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 text-gray-500 hover:text-brand-green relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-brand-orange ring-2 ring-white" />
            </button>
            <Link to="/cart" className="p-2 text-gray-500 hover:text-brand-green relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 block w-4 h-4 text-center leading-4 text-[10px] font-bold text-white rounded-full bg-brand-orange ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="p-1 rounded-full border border-gray-200 ml-2 overflow-hidden bg-slate-100 flex items-center justify-center h-9 w-9">
              <User className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
