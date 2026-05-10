import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
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
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
  const total = subtotal + 2000; // 2000 adalah biaya platform

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper (Sama seperti sebelumnya) */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center text-green-800 font-medium"><div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center mr-2">1</div>Cart</div>
        <div className="w-16 h-px bg-gray-300 mx-4"></div>
        <div className="flex items-center text-gray-400 font-medium"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">2</div>Details</div>
        <div className="w-16 h-px bg-gray-300 mx-4"></div>
        <div className="flex items-center text-gray-400 font-medium"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">3</div>Payment</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Shopping Cart</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">Keranjang masih kosong. Yuk jajan!</div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
                   {item.foto_url && <img src={item.foto_url} alt={item.nama_menu} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.nama_menu}</h3>
                  <div className="text-green-800 font-bold mt-1">Rp {item.harga.toLocaleString('id-ID')}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Qty: {item.jumlah}</span>
                  <button onClick={() => hapusItem(idx)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between"><span>Platform Fee</span><span className="font-medium text-gray-900">Rp 2.000</span></div>
          </div>
          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between items-center"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-xl text-green-800">Rp {total.toLocaleString('id-ID')}</span></div>
          </div>
          <Link to="/checkout" className={`w-full block text-center font-medium py-3 rounded-xl transition-colors ${cartItems.length === 0 ? 'bg-gray-300 text-gray-500 pointer-events-none' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
            Continue to Details →
          </Link>
        </div>
      </div>
    </div>
  );
}