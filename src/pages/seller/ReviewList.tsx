import { useState, useEffect } from 'react';
import { Star, MessageSquareReply } from 'lucide-react';
import api from '../../services/api';

export default function SellerReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<{id: string, text: string} | null>(null);
  const UMKM_ID = localStorage.getItem('UMKM_ID');

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/ulasan/umkm/${UMKM_ID}`);
      setReviews(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { if (UMKM_ID) fetchReviews(); }, [UMKM_ID]);

  const handleReplySubmit = async (id_ulasan: string) => {
    try {
      await api.patch(`/ulasan/${id_ulasan}/balas`, { balasan_umkm: replyText?.text });
      alert("Balasan berhasil dikirim");
      setReplyText(null);
      fetchReviews(); // Refresh UI
    } catch (error) { console.error(error); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
      <p className="text-gray-500 mb-8">Read what your customers say and reply to their feedback.</p>

      <div className="space-y-4">
        {reviews.length === 0 ? <p className="text-gray-400">Belum ada ulasan yang masuk.</p> : null}
        
        {reviews.map((review) => (
          <div key={review.id_ulasan} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{review.nama_mahasiswa}</span>
                  <span className="text-sm text-gray-400">• {new Date(review.tgl_ulasan).toLocaleDateString()}</span>
                </div>
                <div className="text-sm font-medium text-green-800 mt-1">Produk: {review.nama_menu}</div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.komentar}</p>

            {review.balasan_umkm ? (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 ml-4">
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Your Reply</div>
                <p className="text-gray-700 text-sm">{review.balasan_umkm}</p>
              </div>
            ) : (
              <div className="mt-4">
                {replyText?.id === review.id_ulasan ? (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-800 outline-none"
                      rows={3} placeholder="Write your reply here..." value={replyText.text}
                      onChange={(e) => setReplyText({ id: review.id_ulasan, text: e.target.value })}
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setReplyText(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                      <button onClick={() => handleReplySubmit(review.id_ulasan)} className="px-4 py-2 text-sm font-medium text-white bg-green-800 hover:bg-green-900 rounded-lg">Send Reply</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReplyText({ id: review.id_ulasan, text: '' })} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <MessageSquareReply className="w-4 h-4" /> Reply to customer
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}