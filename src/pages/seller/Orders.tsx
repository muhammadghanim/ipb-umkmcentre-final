import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock, ChefHat, Check } from 'lucide-react';
import api from '../../services/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // State baru untuk filter status

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const UMKM_ID = localStorage.getItem('UMKM_ID');

  const fetchOrders = async () => {
    if (!UMKM_ID || UMKM_ID === "null") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/pesanan/umkm/${UMKM_ID}`);
      // Urutkan dari yang terbaru (asumsi ID mengandung waktu atau urutan)
      const sorted = response.data.sort((a: any, b: any) => 
        (b.waktu_pesanan || b.id_pesanan).localeCompare(a.waktu_pesanan || a.id_pesanan)
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [UMKM_ID]);

  const updateStatus = async (id_pesanan: string, newStatus: string) => {
    try {
      await api.put(`/pesanan/${id_pesanan}/status`, { status: newStatus });
      alert(`Status berhasil diubah menjadi: ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id_pesanan === id_pesanan) {
        setIsModalOpen(false); // Tutup modal jika sedang terbuka saat update
      }
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal memperbarui status. Silakan coba lagi.");
    }
  };

  const openDetailModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'menunggu konfirmasi':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-amber-200"><Clock className="w-3.5 h-3.5" /> Menunggu</span>;
      case 'sedang disiapkan':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-blue-200"><ChefHat className="w-3.5 h-3.5" /> Dimasak</span>;
      case 'siap diambil':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Siap Diambil</span>;
      case 'selesai':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-300"><Check className="w-3.5 h-3.5" /> Selesai</span>;
      case 'dibatalkan':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-red-200"><XCircle className="w-3.5 h-3.5" /> Dibatalkan</span>;
      default:
        return <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  // LOGIKA PENCARIAN & FILTER
  const filteredOrders = orders.filter(item => {
    const query = searchQuery.toLowerCase();
    
    // Pencarian text (ID Pesanan atau Nama Mahasiswa)
    const idMatch = item.id_pesanan?.toLowerCase().includes(query);
    // Jika backend mengirimkan nama mahasiswa, bisa ditambahkan di sini. 
    // Sementara kita cari berdasarkan ID Pesanan saja jika nama mahasiswa belum ada di response list.
    const searchMatch = idMatch;

    // Filter berdasarkan status
    const statusMatch = filterStatus === '' || item.status?.toLowerCase() === filterStatus.toLowerCase();

    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-8 relative pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Manajemen Pesanan</h1>
          <p className="text-slate-500 font-medium">Pantau dan kelola pesanan masuk dari mahasiswa di sini.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0f7636] transition-colors" />
          <input 
            type="text" 
            placeholder="Cari ID Pesanan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all shadow-sm font-medium" 
          />
        </div>
        
        {/* Tombol filter diubah menjadi dropdown select */}
        <div className="relative min-w-[200px]">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none px-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm outline-none cursor-pointer h-full"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
            <option value="Sedang Disiapkan">Sedang Disiapkan (Dimasak)</option>
            <option value="Siap Diambil">Siap Diambil</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Harga</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Waktu Pembaruan</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f7636] mx-auto mb-3"></div>
                    <span className="text-slate-500 font-medium">Memuat pesanan...</span>
                  </td>
                </tr>
              )}
              
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada pesanan</h3>
                    <p className="text-slate-500">Belum ada pesanan masuk ke toko Anda saat ini.</p>
                  </td>
                </tr>
              )}

              {!isLoading && orders.length > 0 && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Pesanan tidak ditemukan</h3>
                    <p className="text-slate-500">Tidak ada pesanan yang cocok dengan pencarian atau filter.</p>
                  </td>
                </tr>
              )}

              {filteredOrders.map((item) => (
                <tr key={item.id_pesanan} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                      #{item.id_pesanan.substring(0,8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-[#0f7636]">Rp {item.total_harga.toLocaleString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                    {/* Placeholder waktu - Sesuaikan jika backend mengembalikan timestamp spesifik */}
                    Baru saja
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openDetailModal(item)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#0f7636] hover:text-[#0f7636] hover:bg-green-50 transition-all shadow-sm"
                    >
                      <Eye className="w-4 h-4" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Detail Pesanan</h3>
                <p className="text-sm font-mono text-slate-500 mt-1">#{selectedOrder.id_pesanan}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Info Pelanggan & Catatan */}
              <div className="mb-6 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">Catatan Pembeli</h4>
                <p className="text-sm text-amber-900 font-medium italic">
                  "{selectedOrder.catatan || 'Tidak ada catatan khusus dari pembeli.'}"
                </p>
              </div>

              {/* Daftar Item (Harus dipopulasi oleh Backend jika menggunakan endpoint ini) */}
              <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Item Dipesan</h4>
              <div className="space-y-3 mb-6">
                {/* Fallback tampilan karena endpoint /pesanan/umkm/ belum menyertakan detail item di response array-nya,
                    Jika backend sudah menyertakan 'items', ganti array ini. */}
                {(selectedOrder.items || []).length > 0 ? (
                  selectedOrder.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-600 text-xs">
                          {it.jumlah}x
                        </div>
                        <span className="font-bold text-slate-700">{it.menu?.nama_menu || 'Menu ID: '+it.id_menu}</span>
                      </div>
                      <span className="font-bold text-slate-900">Rp {(it.harga_saat_ini * it.jumlah).toLocaleString('id-ID')}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl text-center">
                    Detail item pesanan tidak tersedia di riwayat singkat ini.
                  </div>
                )}
              </div>
              
              {/* Total Summary */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-600">Total Tagihan</span>
                <span className="text-2xl font-black text-[#0f7636]">Rp {selectedOrder.total_harga.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Aksi Update Status */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Perbarui Status Pesanan</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  disabled={selectedOrder.status === 'Menunggu Konfirmasi'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Menunggu Konfirmasi')}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Menunggu
                </button>
                <button 
                  disabled={selectedOrder.status === 'Sedang Disiapkan'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Sedang Disiapkan')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  Dimasak
                </button>
                <button 
                  disabled={selectedOrder.status === 'Siap Diambil'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Siap Diambil')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
                >
                  Siap Diambil
                </button>
                <button 
                  disabled={selectedOrder.status === 'Selesai'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Selesai')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Selesai
                </button>
              </div>
              <div className="mt-3 text-center">
                 <button 
                  disabled={selectedOrder.status === 'Dibatalkan'}
                  onClick={() => {
                    if(window.confirm("Yakin ingin membatalkan pesanan ini?")) {
                      updateStatus(selectedOrder.id_pesanan, 'Dibatalkan');
                    }
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-2 disabled:opacity-50"
                >
                  Batalkan Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}