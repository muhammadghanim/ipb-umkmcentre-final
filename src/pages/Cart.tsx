import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import axios from "axios";

export function Stepper({ step }: { step: 1 | 2 | 3 }) {
// ... existing Stepper code
  return (
    <div className="flex items-center justify-center max-w-2xl mx-auto w-full mb-12 relative px-4">
      <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -z-10 -translate-y-1/2 hidden sm:block"></div>
      <div className="absolute top-1/2 left-8 w-[calc(50%-2rem)] h-0.5 bg-brand-green -z-10 -translate-y-1/2 hidden sm:block origin-left transition-transform" style={{ transform: `scaleX(${step > 1 ? 1 : 0})` }}></div>
      <div className="absolute top-1/2 left-1/2 w-[calc(50%-2rem)] h-0.5 bg-brand-green -z-10 -translate-y-1/2 hidden sm:block origin-left transition-transform" style={{ transform: `scaleX(${step > 2 ? 1 : 0})` }}></div>
      
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-brand-green text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
            {step > 1 ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : "1"}
          </div>
          <span className={`text-xs font-semibold ${step >= 1 ? 'text-brand-green' : 'text-slate-400'}`}>Cart</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-brand-green text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
            {step > 2 ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : "2"}
          </div>
          <span className={`text-xs font-semibold ${step >= 2 ? 'text-brand-green' : 'text-slate-400'}`}>Details</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-brand-green text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
            "3"
          </div>
          <span className={`text-xs font-semibold ${step >= 3 ? 'text-brand-green' : 'text-slate-400'}`}>Payment</span>
        </div>
      </div>
    </div>
  )
}

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cartStr = localStorage.getItem("cart");
    if (cartStr) {
      setCart(JSON.parse(cartStr));
    }
  }, []);

  const updateQuantity = (menuId: string, delta: number) => {
    const newCart = [...cart];
    const index = newCart.findIndex(item => item.id_menu === menuId);
    if (index >= 0) {
      newCart[index].jumlah = Math.max(1, newCart[index].jumlah + delta);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const removeItem = (menuId: string) => {
    const newCart = cart.filter(item => item.id_menu !== menuId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.harga * item.jumlah), 0);
  const platformFee = cart.length > 0 ? 2000 : 0;
  const total = subtotal + platformFee;

  const handleCheckout = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login first to checkout!");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);

    if (cart.length === 0) return;

    // Group items by UMKM to create corresponding transactions
    const groups: { [key: string]: any[] } = {};
    cart.forEach(item => {
       const uId = item.id_umkm;
       if (!groups[uId]) groups[uId] = [];
       groups[uId].push({
         id_menu: item.id_menu,
         jumlah: item.jumlah
       });
    });

    try {
      const API_URL = "http://127.0.0.1:8000";
      // Send multiple checkouts sequentially
      for (const [id_umkm, items] of Object.entries(groups)) {
        await axios.post(`${API_URL}/pesanan/`, {
          id_umkm,
          id_mahasiswa: user.id,
          items
        });
      }
      localStorage.removeItem("cart");
      alert("Order placed successfully!");
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert("Failed to checkout. Server says: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/home" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-brand-green mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
        </Link>

        <Stepper step={1} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Your Shopping Cart</h1>
          <p className="text-slate-500">Review your cart items</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            
            {cart.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500 mb-4">Your cart is empty.</p>
                  <Link to="/home" className="text-brand-green font-semibold hover:underline">Browse menus</Link>
               </div>
            ) : (
              cart.map((item) => (
                <div key={item.id_menu} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img src={item.foto_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300"} alt="Product" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-2">
                       <div>
                         <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-fit mb-2">
                           {item.kategori || "Menu"}
                         </span>
                         <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{item.nama_menu}</h3>
                       </div>
                       <button onClick={() => removeItem(item.id_menu)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-nowrap items-end justify-between gap-4 mt-6">
                      <div className="text-2xl font-bold text-brand-green">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</div>
                      <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                        <button onClick={() => updateQuantity(item.id_menu, -1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 text-lg">−</button>
                        <input type="text" value={item.jumlah} readOnly className="w-10 text-center font-semibold border-none focus:ring-0 text-slate-900 bg-transparent" />
                        <button onClick={() => updateQuantity(item.id_menu, 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 text-lg">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h3>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Fee</span>
                  <span className="font-medium text-slate-900">Rp {platformFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Fee</span>
                  <span className="font-medium text-brand-green">Free</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between items-end">
                 <span className="font-bold text-slate-900 text-lg">Total Payment</span>
                 <span className="font-bold text-brand-green text-3xl">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              
              <button disabled={cart.length === 0} onClick={handleCheckout} className="disabled:opacity-50 w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors flex justify-center items-center">
                Checkout All
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 text-sm py-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 font-medium gap-4 mt-8">
        <div className="flex items-center gap-4">
          <span className="text-brand-green font-bold">IPB Food Hub</span>
        </div>
        <div className="flex gap-6">
          <span>&copy; 2024 IPB University - Food & UMKM Innovation Hub</span>
        </div>
      </footer>
    </div>
  );
}
