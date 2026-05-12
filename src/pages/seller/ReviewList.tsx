import { useState, useEffect } from 'react';
import { Star, MessageSquareReply, MessageSquare, Store, Send, X, Utensils } from 'lucide-react';
import api from '../../services/api';

export default function SellerReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState<{id: string, text: string} | null>(null);
  
  const UMKM_ID = localStorage.getItem('UMKM_ID');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/ulasan/umkm/${UMKM_ID}`);
      // Urutkan ulasan dari yang terbaru
      const sortedReviews = response.data.sort((a: any, b: any) => 
        new Date(b.tgl_ulasan).getTime() - new Date(a.tgl_ulasan).getTime()
      );
      setReviews(sortedReviews);
    } catch (error) { 
      console.error(error); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (UMKM_ID) fetchReviews(); }, [UMKM_ID]);

  const handleReplySubmit = async (id_ulasan: string) => {
    if (!replyText?.text.trim()) return;
    try {
      await api.patch(`/ulasan/${id_ulasan}/balas`, { balasan_umkm: replyText.text });
      setReplyText(null);
      fetchReviews(); // Refresh UI
    } catch (error) { 
      console.error(error);
      alert("Gagal mengirim balasan. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Ulasan Pelanggan</h1>
          <p className="text-slate-500 font-medium">Baca apa kata mahasiswa tentang makananmu dan berikan balasan yang ramah.</p>
        </div>
      </div>

      {/* Konten Ulasan */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f7636] mx-auto mb-3"></div>
            <span className="text-slate-500 font-medium">Memuat ulasan pelanggan...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-100">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada ulasan</h3>
            <p className="text-slate-500">Ulasan dari mahasiswa yang sudah menyelesaikan pesanan akan muncul di sini.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id_ulasan} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Header Ulasan: Avatar, Nama, Tanggal, Bintang */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar Mahasiswa (Inisial) */}
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl shrink-0 uppercase">
                    {review.nama_mahasiswa ? review.nama_mahasiswa.charAt(0) : 'M'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{review.nama_mahasiswa || 'Mahasiswa IPB'}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <span>{new Date(review.tgl_ulasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#0f7636] bg-green-50 px-2 py-0.5 rounded-md">
                        <Utensils className="w-3 h-3" /> {review.nama_menu}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bintang Rating */}
                <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 w-fit">
                  <span className="font-bold text-amber-600 mr-2">{review.rating}.0</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Teks Ulasan */}
              <div className="relative">
                {/* Tanda Kutip Dekoratif */}
                <span className="absolute -top-4 -left-2 text-6xl text-slate-100 font-serif leading-none select-none z-0">"</span>
                <p className="text-slate-700 mb-6 text-base md:text-lg relative z-10 pl-2 leading-relaxed">
                  {review.komentar || <span className="text-slate-400 italic">Tidak ada pesan teks.</span>}
                </p>
              </div>

              {/* Area Balasan */}
              <div className="ml-0 sm:ml-12">
                {review.balasan_umkm ? (
                  /* Jika Sudah Dibalas */
                  <div className="bg-[#0f7636]/5 p-5 rounded-2xl border border-[#0f7636]/10 relative">
                    {/* Segitiga panah ke atas */}
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-[#0f7636]/5 border-t border-l border-[#0f7636]/10 rotate-45"></div>
                    
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0f7636] mb-2 uppercase tracking-wider relative z-10">
                      <Store className="w-4 h-4" /> Balasan Anda
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed relative z-10">{review.balasan_umkm}</p>
                  </div>
                ) : (
                  /* Jika Belum Dibalas */
                  <div className="mt-2">
                    {replyText?.id === review.id_ulasan ? (
                      /* Form Tulis Balasan */
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <textarea 
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all resize-none shadow-inner"
                          rows={3} 
                          placeholder="Tulis balasan ucapan terima kasih atau tanggapan Anda di sini..." 
                          value={replyText.text}
                          onChange={(e) => setReplyText({ id: review.id_ulasan, text: e.target.value })}
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setReplyText(null)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5">
                            <X className="w-4 h-4" /> Batal
                          </button>
                          <button 
                            onClick={() => handleReplySubmit(review.id_ulasan)} 
                            disabled={!replyText.text.trim()}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-[#0f7636] hover:bg-green-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-md flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" /> Kirim Balasan
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Tombol Munculkan Form Balasan */
                      <button 
                        onClick={() => setReplyText({ id: review.id_ulasan, text: '' })} 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:text-[#0f7636] hover:border-[#0f7636] hover:bg-green-50 rounded-xl transition-all shadow-sm"
                      >
                        <MessageSquareReply className="w-4 h-4" /> Balas Ulasan Ini
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}