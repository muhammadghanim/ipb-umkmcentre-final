import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
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
      const isSure = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
      if (!isSure) return;
    }
    try {
      await api.patch(`/pesanan/${id}/status?status=${newStatus}`);
      setOrders(orders.map(o => o.id_pesanan === id ? { ...o, status_pesanan: newStatus } : o));
      setShowProofModal(false);
    } catch (error) { alert("Terjadi kesalahan."); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
      <p className="text-gray-500 mb-8">Process incoming orders and update delivery status.</p>

      {/* Modal Cek Bukti */}
      {showProofModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Bukti Transfer</h2>
              <button onClick={() => setShowProofModal(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5"/></button>
            </div>
            <div className="bg-gray-100 rounded-xl h-64 mb-6 overflow-hidden flex items-center justify-center">
              {selectedOrder.pembayaran?.bukti_bayar_url ? (
                <img src={selectedOrder.pembayaran.bukti_bayar_url} alt="Bukti Transfer" className="w-full h-full object-contain" />
              ) : <span className="text-gray-400 font-medium text-sm">Gambar tidak tersedia</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(selectedOrder.id_pesanan, 'DIBATALKAN')} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100">Tolak</button>
              <button onClick={() => updateStatus(selectedOrder.id_pesanan, 'DIPROSES')} className="flex-1 py-3 bg-green-800 text-white font-bold rounded-xl hover:bg-green-900">Terima</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Invoice / Waktu</th>
                <th className="p-4 font-medium">Detail Item</th>
                <th className="p-4 font-medium">Total Tagihan</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Mencari pesanan masuk...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada pesanan masuk.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id_pesanan} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">#{order.id_pesanan.substring(0, 8).toUpperCase()}</div>
                      <div className="text-xs text-gray-500 mb-2">{new Date(order.tgl_pesanan).toLocaleString('id-ID')}</div>
                      {/* FITUR BARU: Menampilkan Catatan */}
                      {order.catatan && (
                        <div className="bg-amber-50 text-amber-800 text-[11px] font-medium px-2 py-1 rounded inline-block">
                          Note: {order.catatan}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{order.detail_pesanan?.length || 0} Macam Menu</td>
                    <td className="p-4 font-bold text-green-800">Rp {order.total_harga.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        order.status_pesanan === 'PENDING' ? 'bg-gray-100 text-gray-600' :
                        order.status_pesanan === 'MENUNGGU VERIFIKASI' ? 'bg-blue-100 text-blue-800' :
                        order.status_pesanan === 'DIBATALKAN' ? 'bg-red-100 text-red-800' :
                        order.status_pesanan === 'DIPROSES' ? 'bg-amber-100 text-amber-800' :
                        order.status_pesanan === 'SIAP DIAMBIL' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status_pesanan}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {(order.status_pesanan === 'PENDING' || order.status_pesanan === 'MENUNGGU VERIFIKASI') && (
                          <button onClick={() => updateStatus(order.id_pesanan, 'DIBATALKAN')} className="bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-100">Batalkan</button>
                        )}
                        {order.status_pesanan === 'MENUNGGU VERIFIKASI' && (
                          <button onClick={() => { setSelectedOrder(order); setShowProofModal(true); }} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1"><Eye className="w-3 h-3"/> Cek Bukti</button>
                        )}
                        {order.status_pesanan === 'DIPROSES' && (
                          <button onClick={() => updateStatus(order.id_pesanan, 'SIAP DIAMBIL')} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700">Siap Diambil</button>
                        )}
                        {order.status_pesanan === 'SIAP DIAMBIL' && (
                          <button onClick={() => updateStatus(order.id_pesanan, 'SELESAI')} className="bg-green-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-900">Selesaikan</button>
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