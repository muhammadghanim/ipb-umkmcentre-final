import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock, ChefHat, Check } from 'lucide-react';
import api from '../../services/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const UMKM_ID = localStorage.getItem('UMKM_ID');

  // HELPER: Format tanggal untuk sinkronisasi Waktu Nyata (Konversi UTC ke Waktu Lokal)
  const formatTanggalRealTime = (tgl: string) => {
    if (!tgl) return '-';
    // Menambahkan 'Z' di akhir memastikan browser membaca ini sebagai UTC,
    // dan mengonversinya secara presisi ke zona waktu lokal (misal: UTC+7 / WIB)
    const utcDate = tgl.endsWith('Z') ? tgl : `${tgl}Z`;
    return new Date(utcDate).toLocaleString('id-ID', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const fetchOrders = async () => {
    if (!UMKM_ID || UMKM_ID === "null") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/pesanan/umkm/${UMKM_ID}`);
      const dataPesanan = Array.isArray(response.data) ? response.data : [];
      
      // Urutkan dari yang terbaru (dengan membaca format Z/UTC)
      const sorted = dataPesanan.sort((a: any, b: any) => {
        const timeA = a.tgl_pesanan ? new Date(a.tgl_pesanan.endsWith('Z') ? a.tgl_pesanan : `${a.tgl_pesanan}Z`).getTime() : 0;
        const timeB = b.tgl_pesanan ? new Date(b.tgl_pesanan.endsWith('Z') ? b.tgl_pesanan : `${b.tgl_pesanan}Z`).getTime() : 0;
        return timeB - timeA;
      });
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
      await api.patch(`/pesanan/${id_pesanan}/status?status=${newStatus}`);
      alert(`Status berhasil diubah menjadi: ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id_pesanan === id_pesanan) {
        setIsModalOpen(false); 
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
      case 'menunggu verifikasi':
      case 'pending':
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
        return <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{status || 'PENDING'}</span>;
    }
  };

  const filteredOrders = orders.filter(item => {
    const query = searchQuery.toLowerCase();
    const idMatch = item.id_pesanan?.toLowerCase().includes(query);
    const namaMatch = item.mahasiswa?.nama_lengkap?.toLowerCase().includes(query) || false;
    const searchMatch = idMatch || namaMatch;

    const statusMatch = filterStatus === '' || item.status_pesanan?.toLowerCase() === filterStatus.toLowerCase();

    return searchMatch && statusMatch;
  });

  const getDisplayTotal = (item: any) => {
    if (!item) return 0;
    const items = item.detail_pesanan || item.items || [];
    const subtotal = items.reduce((sum: number, it: any) => sum + ((it.harga_satuan || 0) * (it.jumlah || 1)), 0);
    const totalDB = item.total_harga || 0;
    
    if (totalDB > subtotal && subtotal > 0) {
      return subtotal;
    }
    return totalDB;
  };

  const hitungRincianMulai = () => {
    if (!selectedOrder) return { subtotalProduk: 0, diskon: 0, totalAkhir: 0 };
    const items = selectedOrder.detail_pesanan || selectedOrder.items || [];
    
    const subtotalProduk = items.reduce((sum: number, it: any) => sum + ((it.harga_satuan || 0) * (it.jumlah || 1)), 0);
    const totalAkhir = getDisplayTotal(selectedOrder);
    
    const diskon = Math.max(0, subtotalProduk - totalAkhir);
    return { subtotalProduk, diskon, totalAkhir };
  };

  const { subtotalProduk, diskon, totalAkhir } = hitungRincianMulai();

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
            placeholder="Cari ID Pesanan atau Nama Mahasiswa..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all shadow-sm font-medium" 
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none px-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm outline-none cursor-pointer h-full"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
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
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Harga</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f7636] mx-auto mb-3"></div>
                    <span className="text-slate-500 font-medium">Memuat pesanan...</span>
                  </td>
                </tr>
              )}
              
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada pesanan</h3>
                    <p className="text-slate-500">Belum ada pesanan masuk ke toko Anda saat ini.</p>
                  </td>
                </tr>
              )}

              {!isLoading && orders.length > 0 && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
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
                      #{item.id_pesanan?.substring(0,8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {item.mahasiswa?.nama_lengkap || 'Mahasiswa'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-[#0f7636]">Rp {getDisplayTotal(item).toLocaleString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status_pesanan)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                    {/* Waktu diubah menggunakan helper realtime kita */}
                    {formatTanggalRealTime(item.tgl_pesanan)}
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
                <div className="flex gap-2 items-center mt-1">
                  <p className="text-sm font-mono text-slate-500">#{selectedOrder.id_pesanan}</p>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  {/* Tambahkan waktu real time juga di modal detail biar jelas */}
                  <p className="text-xs font-semibold text-slate-400">
                    {formatTanggalRealTime(selectedOrder.tgl_pesanan)}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {/* Info Pelanggan & Catatan */}
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">Pemesan & Catatan</h4>
                <p className="text-sm text-slate-800 font-bold mb-1">{selectedOrder.mahasiswa?.nama_lengkap || 'Mahasiswa'}</p>
                <p className="text-sm text-amber-900 font-medium italic">
                  "{selectedOrder.catatan || 'Tidak ada catatan khusus dari pembeli.'}"
                </p>
              </div>

              {/* Tampilkan Bukti Pembayaran Jika Ada */}
              {selectedOrder.pembayaran?.bukti_bayar_url && (
                <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-blue-100 pb-2">Bukti Pembayaran</h4>
                  <a href={selectedOrder.pembayaran.bukti_bayar_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={selectedOrder.pembayaran.bukti_bayar_url} 
                      alt="Bukti Transfer" 
                      className="w-full max-h-64 object-contain rounded-xl border border-blue-200 hover:opacity-90 transition-opacity bg-white"
                    />
                  </a>
                </div>
              )}

              {/* Daftar Item */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Item Dipesan</h4>
                <div className="space-y-3">
                  {(selectedOrder.detail_pesanan || selectedOrder.items || []).length > 0 ? (
                    (selectedOrder.detail_pesanan || selectedOrder.items).map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0f7636]/10 text-[#0f7636] rounded-lg flex items-center justify-center font-bold text-xs">
                            {it.jumlah || 1}x
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">
                              {it.menu?.nama_menu || 'Menu ID: ' + it.id_menu}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                              Rp {(it.harga_satuan || 0).toLocaleString('id-ID')} / porsi
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">
                          Rp {((it.harga_satuan || 0) * (it.jumlah || 1)).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                      Detail item pesanan tidak tersedia.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rincian Ringkasan Harga Asli & Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Produk (Harga Asli)</span>
                  <span>Rp {subtotalProduk.toLocaleString('id-ID')}</span>
                </div>
                {diskon > 0 && (
                  <div className="flex justify-between text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-lg">
                    <span>Potongan Promo</span>
                    <span>- Rp {diskon.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-base">Total Akhir Pembayaran</span>
                  <span className="text-2xl font-black text-[#0f7636]">Rp {totalAkhir.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Aksi Update Status */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Perbarui Status Pesanan</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  disabled={selectedOrder.status_pesanan === 'Menunggu Verifikasi'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Menunggu Verifikasi')}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Menunggu
                </button>
                <button 
                  disabled={selectedOrder.status_pesanan === 'Sedang Disiapkan'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Sedang Disiapkan')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  Dimasak
                </button>
                <button 
                  disabled={selectedOrder.status_pesanan === 'Siap Diambil'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Siap Diambil')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
                >
                  Siap Diambil
                </button>
                <button 
                  disabled={selectedOrder.status_pesanan === 'Selesai'}
                  onClick={() => updateStatus(selectedOrder.id_pesanan, 'Selesai')}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Selesai
                </button>
              </div>
              <div className="mt-3 text-center">
                 <button 
                  disabled={selectedOrder.status_pesanan === 'Dibatalkan'}
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