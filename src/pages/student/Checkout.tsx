import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import api from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [catatan, setCatatan] = useState(''); // STATE CATATAN
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inputPromo, setInputPromo] = useState('');
  const [activePromoCode, setActivePromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const STUDENT_ID = localStorage.getItem('STUDENT_ID');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
  const platformFee = 2000;
  const total = Math.max(0, subtotal - discount + platformFee);

  const applyPromo = async () => {
    if (!inputPromo) return;
    try {
      const response = await api.get(`/promo/validasi/${inputPromo}`);
      if (response.data.is_valid) {
        setDiscount(response.data.nominal_diskon);
        setActivePromoCode(inputPromo);
        alert("Yeay! Kode Promo berhasil diterapkan.");
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || "Promo tidak valid atau sudah kadaluarsa");
    }
  };

  const handleCheckout = async () => {
    if (!STUDENT_ID || cart.length === 0 || !cart[0].id_umkm) return;
    setIsSubmitting(true);

    const payload = {
      id_umkm: cart[0].id_umkm,
      id_mahasiswa: STUDENT_ID,
      kode_promo: activePromoCode,
      catatan: catatan, // MENGIRIM CATATAN
      items: cart.map(item => ({ id_menu: item.id_menu, jumlah: item.jumlah }))
    };

    try {
      const response = await api.post('/pesanan/', payload);
      localStorage.removeItem('cart');
      navigate('/payment', { state: { orderId: response.data.id_pesanan, totalHarga: total, id_umkm: payload.id_umkm } });
    } catch (error: any) {
      alert(`Gagal checkout: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* STEPPER */}
      <div className="flex items-center justify-center mb-10 pt-4">
        <Link to="/cart" className="flex items-center text-green-800 font-bold hover:opacity-80">
          <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center mr-2">✓</div>Cart
        </Link>
        <div className="w-16 h-px bg-green-800 mx-4"></div>
        <div className="flex items-center text-green-800 font-bold">
          <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center mr-2">2</div>Details
        </div>
        <div className="w-16 h-px bg-gray-300 mx-4"></div>
        <div className="flex items-center text-gray-400 font-medium">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">3</div>Payment
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Almost there!</h1></div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-900">Contact Information</h2>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Misal: Jangan pakai seledri..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none resize-none"></textarea>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Tag className="w-4 h-4"/> Punya Kode Promo?</label>
              <div className="flex gap-2">
                <input type="text" value={inputPromo} onChange={(e) => setInputPromo(e.target.value.toUpperCase())} placeholder="Masukkan kode promo..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none uppercase" />
                <button type="button" onClick={applyPromo} className="px-6 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800">Apply</button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-gray-50 p-6 rounded-3xl space-y-6 sticky top-8 border border-gray-100">
            <h2 className="font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">{item.nama_menu}</div>
                    <div className="text-gray-500 text-xs mt-1">Qty: {item.jumlah}</div>
                  </div>
                  <div className="font-medium text-gray-900 whitespace-nowrap">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200 space-y-3 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span></div>
              {discount > 0 && <div className="flex justify-between text-amber-600"><span>Promo ({activePromoCode})</span><span className="font-medium">- Rp {discount.toLocaleString('id-ID')}</span></div>}
              <div className="flex justify-between text-gray-500"><span>Platform Fee</span><span className="font-medium text-gray-900">Rp {platformFee.toLocaleString('id-ID')}</span></div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-green-800">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={handleCheckout} disabled={isSubmitting} className="w-full font-bold py-4 rounded-xl text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20">{isSubmitting ? 'Memproses...' : 'Continue to Payment →'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}