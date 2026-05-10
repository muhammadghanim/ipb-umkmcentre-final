import { useState, useEffect } from 'react';
import { Package, Star, Clock, CheckCircle2, MessageSquare, Wallet, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
      alert("Gagal mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!STUDENT_ID) return <div className="text-center py-20 text-gray-500">Silakan login terlebih dahulu.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Riwayat Pesanan</h1>
        <p className="text-gray-500 mt-1 font-medium">Pantau status pesanan Anda dan selesaikan pembayaran.</p>
      </div>

      {showReviewModal && selectedMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Beri Ulasan</h2>
            <p className="text-gray-500 mb-6">Bagaimana rasa <span className="font-bold text-gray-900">{selectedMenu.nama_menu}</span>?</p>
            
            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewData({...reviewData, rating: star})} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={`w-10 h-10 ${star <= reviewData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Komentar (Opsional)</label>
                <textarea 
                  rows={4} placeholder="Ceritakan pengalamanmu..." 
                  value={reviewData.komentar} onChange={(e) => setReviewData({...reviewData, komentar: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-800 outline-none resize-none"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-medium text-white bg-green-800 hover:bg-green-900">{isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Memuat riwayat pesanan Anda...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada pesanan.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id_pesanan} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    order.status_pesanan === 'SELESAI' ? 'bg-green-100 text-green-800' : 
                    order.status_pesanan === 'PENDING' ? 'bg-gray-100 text-gray-600' :
                    order.status_pesanan === 'MENUNGGU VERIFIKASI' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status_pesanan === 'SELESAI' ? <CheckCircle2 className="w-6 h-6" /> : 
                     order.status_pesanan === 'PENDING' ? <Wallet className="w-6 h-6" /> : 
                     order.status_pesanan === 'MENUNGGU VERIFIKASI' ? <Loader className="w-6 h-6 animate-spin" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">{new Date(order.tgl_pesanan).toLocaleString('id-ID')}</div>
                    <div className="font-bold text-gray-900">Order #{order.id_pesanan.substring(0,8).toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                     order.status_pesanan === 'SELESAI' ? 'bg-green-100 text-green-800' : 
                     order.status_pesanan === 'PENDING' ? 'bg-gray-100 text-gray-800' : 
                     order.status_pesanan === 'DIBATALKAN' ? 'bg-red-100 text-red-800' :
                     order.status_pesanan === 'MENUNGGU VERIFIKASI' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status_pesanan}
                  </span>
                  
                  {order.status_pesanan === 'PENDING' && (
                    <button 
                      onClick={() => navigate('/payment', { state: { orderId: order.id_pesanan, totalHarga: order.total_harga, id_umkm: order.id_umkm } })} 
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                    >
                      Upload Bukti
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {order.detail_pesanan?.map((item: any) => (
                  <div key={item.id_detail} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl">
                    <div>
                      <div className="font-bold text-gray-900">Menu ID: {item.id_menu.substring(0,8)}</div>
                      <div className="text-sm text-gray-600">{item.jumlah}x @ Rp {item.harga_satuan.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="font-bold text-green-800">Rp {item.subtotal.toLocaleString('id-ID')}</div>
                      {order.status_pesanan === 'SELESAI' && (
                        <button onClick={() => openReviewModal(item.id_menu, `Menu Produk`)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-amber-600 hover:border-amber-600 hover:bg-amber-50 shadow-sm"><MessageSquare className="w-4 h-4" /> Ulas</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-medium text-gray-500">Total Belanja</span>
                <span className="text-xl font-bold text-gray-900">Rp {order.total_harga.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}