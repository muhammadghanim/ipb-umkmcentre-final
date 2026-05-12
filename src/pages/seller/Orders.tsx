import { useState, useEffect } from 'react';
import { Eye, X, CheckCircle2, XCircle, Clock, Package, MessageSquare, ShoppingBag, Search, Filter } from 'lucide-react';
import api from '../../services/api';

export default function SellerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const UMKM_ID = localStorage.getItem('UMKM_ID'); 

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/pesanan/umkm/${UMKM_ID}`);
      const sortedOrders = response.data.sort((a: any, b: any) => 
        new Date(b.tgl_pesanan).getTime() - new Date(a.tgl_pesanan).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (UMKM_ID) fetchOrders();
  }, [UMKM_ID]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'DIBATALKAN') {
      const isSure = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini? Mahasiswa akan menerima notifikasi pembatalan.");
      if (!isSure) return;
    }
    try {
      await api.patch(`/pesanan/${id}/status?status=${newStatus}`);
      setOrders(orders.map(o => o.id_pesanan === id ? { ...o, status_pesanan: newStatus } : o));
      setShowProofModal(false);
    } catch (error) { 
      alert("Terjadi kesalahan saat memperbarui status pesanan."); 
    }
  };

  // Helper untuk Badge Status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'MENUNGGU VERIFIKASI':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DIPROSES':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SIAP DIAMBIL':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SELESAI':
        return 'bg-[#0f7636]/10 text-[#0f7636] border-[#0f7636]/20';
      case 'DIBATALKAN':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Manajemen Pesanan</h1>
          <p className="text-slate-500 font-medium">Proses pesanan masuk, verifikasi pembayaran, dan perbarui status pengiriman.</p>
        </div>
      </div>

      {/* Modal Cek Bukti Transfer */}
      {showProofModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Verifikasi Pembayaran</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Invoice #{selectedOrder.id_pesanan.substring(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={() => setShowProofModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X className="w-6 h-6"/>
              </button>
            </div>
            
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-80 mb-6 overflow-hidden flex items-center justify-center relative group">
              {selectedOrder.pembayaran?.bukti_bayar_url ? (
                <>
                  <img src={selectedOrder.pembayaran.bukti_bayar_url} alt="Bukti Transfer" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={selectedOrder.pembayaran.bukti_bayar_url} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                      Buka Gambar Penuh
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <Eye className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <span className="font-medium text-sm">Gambar bukti tidak tersedia</span>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium mb-6 border border-blue-100 flex items-start gap-3">
              <Clock className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Pastikan nominal transfer sesuai dengan total tagihan <strong>Rp {selectedOrder.total_harga.toLocaleString('id-ID')}</strong>.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => updateStatus(selectedOrder.id_pesanan, 'DIBATALKAN')} className="flex-1 py-3.5 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
                Tolak
              </button>
              <button onClick={() => updateStatus(selectedOrder.id_pesanan, 'DIPROSES')} className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                Terima & Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar (Visual/UI) */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0f7636] transition-colors" />
          <input type="text" placeholder="Cari nomor invoice atau nama menu..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all shadow-sm font-medium" />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          <Filter className="w-5 h-5" /> Filter Status
        </button>
      </div>

      {/* Tabel Pesanan */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Invoice & Waktu</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Detail Pesanan</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Tagihan</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Aksi Penjual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f7636] mx-auto mb-3"></div>
                    <span className="text-slate-500 font-medium">Sinkronisasi pesanan masuk...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada pesanan masuk</h3>
                    <p className="text-slate-500">Pesanan dari mahasiswa akan muncul di sini.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id_pesanan} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Invoice & Waktu */}
                    <td className="px-6 py-5">
                      <div className="font-extrabold text-slate-900 text-sm mb-1">#{order.id_pesanan.substring(0, 8).toUpperCase()}</div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-2">
                        <Clock className="w-3.5 h-3.5" /> {new Date(order.tgl_pesanan).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {/* Catatan Pembeli */}
                      {order.catatan && (
                        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-start gap-1.5 max-w-[200px] whitespace-normal">
                          <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{order.catatan}</span>
                        </div>
                      )}
                    </td>
                    
                    {/* Detail Item */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <Package className="w-4 h-4" />
                        </div>
                        {order.detail_pesanan?.length || 0} Macam Menu
                      </div>
                    </td>
                    
                    {/* Tagihan */}
                    <td className="px-6 py-5 font-black text-lg text-[#0f7636]">
                      Rp {order.total_harga.toLocaleString('id-ID')}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center border px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wider uppercase ${getStatusBadge(order.status_pesanan)}`}>
                        {order.status_pesanan}
                      </span>
                    </td>
                    
                    {/* Aksi Button */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        
                        {(order.status_pesanan === 'PENDING' || order.status_pesanan === 'MENUNGGU VERIFIKASI') && (
                          <button 
                            onClick={() => updateStatus(order.id_pesanan, 'DIBATALKAN')} 
                            className="bg-white border border-red-200 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" /> Tolak
                          </button>
                        )}
                        
                        {order.status_pesanan === 'MENUNGGU VERIFIKASI' && (
                          <button 
                            onClick={() => { setSelectedOrder(order); setShowProofModal(true); }} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                          >
                            <Eye className="w-4 h-4"/> Cek Bukti
                          </button>
                        )}
                        
                        {order.status_pesanan === 'DIPROSES' && (
                          <button 
                            onClick={() => updateStatus(order.id_pesanan, 'SIAP DIAMBIL')} 
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                          >
                            <Package className="w-4 h-4" /> Siap Diambil
                          </button>
                        )}
                        
                        {order.status_pesanan === 'SIAP DIAMBIL' && (
                          <button 
                            onClick={() => updateStatus(order.id_pesanan, 'SELESAI')} 
                            className="bg-[#0f7636] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-800 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Selesaikan
                          </button>
                        )}
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}