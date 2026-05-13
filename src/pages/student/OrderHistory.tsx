import { useState, useEffect } from 'react';
import { Package, Star, Clock, CheckCircle2, MessageSquare, Wallet, Loader, XCircle, ShoppingBag, Receipt, X, ChevronRight, Utensils } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<{id_menu: string, nama_menu: string} | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, komentar: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STUDENT_ID = localStorage.getItem('STUDENT_ID');

  const fetchOrders = async () => {
    if (!STUDENT_ID) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/pesanan/mahasiswa/${STUDENT_ID}`);
      const sortedOrders = response.data.sort((a: any, b: any) => 
        new Date(b.tgl_pesanan).getTime() - new Date(a.tgl_pesanan).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Gagal mengambil riwayat pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [STUDENT_ID]);

  const openReviewModal = (id_menu: string, nama_menu: string) => {
    setSelectedMenu({ id_menu, nama_menu });
    setShowReviewModal(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu || !STUDENT_ID) return;
    setIsSubmitting(true);
    try {
      await api.post(`/ulasan/mahasiswa/${STUDENT_ID}`, {
        id_menu: selectedMenu.id_menu,
        rating: reviewData.rating,
        komentar: reviewData.komentar,
      });
      alert("Terima kasih! Ulasan Anda berhasil dikirim.");
      setShowReviewModal(false);
      setReviewData({ rating: 5, komentar: '' });
      fetchOrders(); 
    } catch (error) {
      console.error("Gagal kirim ulasan:", error);
      alert("Gagal mengirim ulasan. Mungkin Anda sudah mengulas produk ini.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk menentukan gaya dan ikon berdasarkan status pesanan
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <Wallet className="w-5 h-5" /> };
      case 'MENUNGGU VERIFIKASI':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Loader className="w-5 h-5 animate-spin" /> };
      case 'DIPROSES':
        return { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <Package className="w-5 h-5" /> };
      case 'SIAP DIAMBIL':
        return { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <ShoppingBag className="w-5 h-5" /> };
      case 'SELESAI':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-5 h-5" /> };
      case 'DIBATALKAN':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-5 h-5" /> };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Clock className="w-5 h-5" /> };
    }
  };

  if (!STUDENT_ID) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <User className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
      <p className="text-slate-500 mb-8">Silakan login sebagai mahasiswa untuk melihat riwayat pesanan.</p>
      <Link to="/login" className="bg-[#0f7636] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors">
        Pergi ke Halaman Login
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Riwayat Pesanan</h1>
          <p className="text-slate-500 font-medium">Pantau status pesanan, selesaikan pembayaran, dan berikan ulasan.</p>
        </div>
      </div>

      {/* Modal Beri Ulasan */}
      {showReviewModal && selectedMenu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Beri Ulasan</h2>
                <p className="text-slate-500 text-sm font-medium">Bagaimana rasa <span className="font-bold text-slate-800">{selectedMenu.nama_menu}</span>?</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3 text-center">Berapa bintang untuk menu ini?</label>
                <div className="flex justify-center gap-2 bg-slate-50 py-4 rounded-2xl border border-slate-100">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewData({...reviewData, rating: star})} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={`w-10 h-10 ${star <= reviewData.rating ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'fill-slate-200 text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Komentar (Opsional)</label>
                <textarea 
                  rows={4} placeholder="Ceritakan pengalamanmu... (misal: rasanya enak, porsinya pas)" 
                  value={reviewData.komentar} onChange={(e) => setReviewData({...reviewData, komentar: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none resize-none transition-all text-sm"
                ></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 active:scale-95 disabled:opacity-70 disabled:active:scale-100">
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Pesanan */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f7636] mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Memuat riwayat pesanan Anda...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm px-4">
            <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Pesanan</h3>
            <p className="text-slate-500 mb-6">Sepertinya kamu belum pernah memesan makanan di IPB Food Hub.</p>
            <Link to="/" className="inline-block bg-[#0f7636] hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors">
              Mulai Eksplorasi Menu
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const statusStyle = getStatusDisplay(order.status_pesanan);
            
            return (
              <div key={order.id_pesanan} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                
                {/* Order Header */}
                <div className="bg-slate-50/50 p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${statusStyle.color}`}>
                      {statusStyle.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-slate-900 text-lg">Order #{order.id_pesanan.substring(0,8).toUpperCase()}</span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase border ${statusStyle.color}`}>
                          {order.status_pesanan}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.tgl_pesanan).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  {order.status_pesanan === 'PENDING' && (
                    <button 
                      onClick={() => navigate('/payment', { state: { orderId: order.id_pesanan, totalHarga: order.total_harga, id_umkm: order.id_umkm } })} 
                      className="bg-[#e8811e] hover:bg-[#cc6e16] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      Lanjut Bayar <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6 space-y-4">
                  {order.detail_pesanan?.map((item: any) => (
                    <div key={item.id_detail} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl hover:border-slate-200 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          {/* Jika backend belum mengirim nama_menu, kita pakai fallback string Menu ID */}
                          <div className="font-bold text-slate-900 text-base">{item.nama_menu || `Menu ID: ${item.id_menu.substring(0,8)}`}</div>
                          <div className="text-sm text-slate-500 font-medium mt-0.5">{item.jumlah}x @ Rp {item.harga_satuan.toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div className="font-black text-[#0f7636]">Rp {item.subtotal.toLocaleString('id-ID')}</div>
                        
                        {order.status_pesanan === 'SELESAI' && (
                          <button 
                            onClick={() => openReviewModal(item.id_menu, item.nama_menu || `Produk`)} 
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-600 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 shadow-sm transition-all"
                          >
                            <MessageSquare className="w-4 h-4" /> Ulas
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer (Total) */}
                <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">Total Belanja</span>
                  <span className="text-2xl font-black text-slate-900">Rp {order.total_harga.toLocaleString('id-ID')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}