import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag, Check, ArrowRight, PenSquare } from 'lucide-react';
import api from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inputPromo, setInputPromo] = useState('');
  const [activePromoCode, setActivePromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const STUDENT_ID = localStorage.getItem('STUDENT_ID');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate('/cart'); // Redirect jika keranjang kosong
    }
    setCart(savedCart);
  }, [navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
  const platformFee = 2000;
  const total = Math.max(0, subtotal - discount + platformFee);

const applyPromo = async () => {
    if (!inputPromo || cart.length === 0) return;
    
    // Ambil ID UMKM dari menu pertama yang ada di keranjang
    const umkmId = cart[0].id_umkm;

    try {
      // Sisipkan id_umkm sebagai query parameter
      const response = await api.get(`/promo/validasi/${inputPromo}?id_umkm=${umkmId}`);
      
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
      catatan: catatan, 
      items: cart.map(item => ({ id_menu: item.id_menu, jumlah: item.jumlah }))
    };

    try {
      const response = await api.post('/pesanan/', payload);
      localStorage.removeItem('cart');
      // Kosongkan angka di navbar
      window.dispatchEvent(new Event('cartUpdated')); 
      navigate('/payment', { state: { orderId: response.data.id_pesanan, totalHarga: total, id_umkm: payload.id_umkm } });
    } catch (error: any) {
      alert(`Gagal checkout: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Stepper Modern (Sinkron dengan Cart) */}
      <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
        <Link to="/cart" className="flex items-center text-[#0f7636] font-bold hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#0f7636] text-white flex items-center justify-center mr-2 shadow-md">
            <Check className="w-4 h-4" />
          </div>
          Cart
        </Link>
        <div className="w-12 md:w-24 h-1 bg-[#0f7636] mx-3 md:mx-4 rounded-full"></div>
        <div className="flex items-center text-[#0f7636] font-bold">
          <div className="w-8 h-8 rounded-full border-2 border-[#0f7636] bg-white flex items-center justify-center mr-2 shadow-sm">2</div>
          Details
        </div>
        <div className="w-12 md:w-24 h-1 bg-slate-200 mx-3 md:mx-4 rounded-full"></div>
        <div className="flex items-center text-slate-400 font-bold">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">3</div>
          Payment
        </div>
      </div>

      {/* JUDUL DIKELUARKAN DARI GRID AGAR KOTAK BAWAH SEJAJAR */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Hampir Selesai!</h1>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Informasi */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
            
            {/* Input Catatan */}
            <div>
              <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <PenSquare className="w-4 h-4 text-[#0f7636]" /> Catatan untuk Penjual (Opsional)
              </label>
              <textarea 
                value={catatan} 
                onChange={(e) => setCatatan(e.target.value)} 
                placeholder="Misal: Jangan pakai seledri, pedas sedang, atau bungkus pisah..." 
                rows={3} 
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none resize-none transition-all"
              ></textarea>
            </div>
            
            {/* Input Promo */}
            <div className="pt-6 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" /> Punya Kode Promo?
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={inputPromo} 
                  onChange={(e) => setInputPromo(e.target.value.toUpperCase())} 
                  disabled={activePromoCode !== null}
                  placeholder="Masukkan kode promo di sini..." 
                  className="flex-1 px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium tracking-wider" 
                />
                <button 
                  type="button" 
                  onClick={applyPromo} 
                  disabled={activePromoCode !== null || !inputPromo}
                  className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {activePromoCode ? 'Terpakai' : 'Gunakan'}
                </button>
              </div>
              {activePromoCode && (
                <p className="text-sm font-medium text-[#0f7636] mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Kode promo berhasil diterapkan!
                </p>
              )}
            </div>
            
          </div>
        </div>

        {/* Kolom Kanan: Order Summary (Konsisten dengan Cart) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold text-slate-900 line-clamp-2 leading-snug">{item.nama_menu}</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Qty: {item.jumlah}</div>
                  </div>
                  <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">
                    Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-amber-600 bg-amber-50 px-2 py-1 rounded-md -mx-2">
                  <span className="font-bold">Promo diskon</span>
                  <span className="font-bold">- Rp {discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">Biaya Platform</span>
                <span className="font-bold text-slate-900">Rp {platformFee.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">Total Pembayaran</span>
                <span className="text-2xl font-black text-[#0f7636]">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isSubmitting} 
              className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl bg-[#e8811e] hover:bg-[#cc6e16] text-white shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Memproses...
                </span>
              ) : (
                <>Lanjut ke Pembayaran <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}