import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function SellerDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, activeOrders: 0, pendingOrders: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const UMKM_ID = localStorage.getItem('UMKM_ID');
  const storeName = localStorage.getItem('NAMA_TOKO') || 'Seller'; // Opsional jika kamu menyimpan nama toko di localStorage

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(`/pesanan/umkm/${UMKM_ID}`);
        const allOrders = response.data;
        
        // Kalkulasi Statistik
        const active = allOrders.filter((o: any) => !['SELESAI', 'DIBATALKAN'].includes(o.status_pesanan));
        const pending = allOrders.filter((o: any) => o.status_pesanan === 'PENDING');
        const sales = allOrders
          .filter((o: any) => o.status_pesanan === 'SELESAI')
          .reduce((sum: number, o: any) => sum + o.total_harga, 0);

        setStats({ 
          totalSales: sales, 
          activeOrders: active.length,
          pendingOrders: pending.length 
        });

        // Ambil 5 pesanan terbaru untuk tabel
        const sorted = allOrders.sort((a: any, b: any) => 
          new Date(b.tgl_pesanan).getTime() - new Date(a.tgl_pesanan).getTime()
        ).slice(0, 5);
        
        setRecentOrders(sorted);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (UMKM_ID) fetchDashboardData();
  }, [UMKM_ID]);

  // Helper untuk mewarnai badge status
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3.5 h-3.5" /> };
      case 'DIPROSES':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      case 'SELESAI':
        return { color: 'bg-[#0f7636]/10 text-[#0f7636] border-[#0f7636]/20', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case 'DIBATALKAN':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3.5 h-3.5" /> };
      default:
        return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: null };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Selamat Datang, {storeName}</h1>
        <p className="text-slate-500 font-medium">Ringkasan aktivitas dan performa tokomu hari ini.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="w-20 h-20 text-[#0f7636]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
              <div className="w-8 h-8 rounded-full bg-[#0f7636]/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-[#0f7636]" /></div>
              Pendapatan (Selesai)
            </div>
            <div className="text-3xl font-black text-slate-900">Rp {stats.totalSales.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Clock className="w-20 h-20 text-amber-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
              Perlu Konfirmasi
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.pendingOrders} <span className="text-lg font-medium text-slate-400">Pesanan</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag className="w-20 h-20 text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-blue-600" /></div>
              Sedang Aktif
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.activeOrders} <span className="text-lg font-medium text-slate-400">Pesanan</span></div>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Pesanan Masuk Terbaru</h2>
            <p className="text-sm text-slate-500 mt-1">5 pesanan terakhir yang perlu perhatianmu.</p>
          </div>
          <Link to="/seller/orders" className="hidden sm:flex items-center gap-1 text-sm font-bold text-[#0f7636] hover:text-green-800 hover:underline transition-colors">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-xs">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Jumlah Item</th>
                <th className="px-6 py-4">Total Harga</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f7636] mx-auto mb-3"></div>
                    <span className="text-slate-500 font-medium">Memuat data pesanan...</span>
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <span className="text-slate-500 font-medium text-base">Belum ada pesanan masuk.</span>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status_pesanan);
                  return (
                    <tr key={order.id_pesanan} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        #{order.id_pesanan.substring(0,8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {order.detail_pesanan?.length || 0} Menu
                      </td>
                      <td className="px-6 py-4 font-bold text-[#0f7636]">
                        Rp {order.total_harga.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${badge.color}`}>
                          {badge.icon} {order.status_pesanan}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Tombol Lihat Semua versi Mobile */}
        <div className="p-4 border-t border-slate-100 sm:hidden">
           <Link to="/seller/orders" className="flex items-center justify-center gap-1 w-full py-3 bg-slate-50 rounded-xl text-sm font-bold text-[#0f7636] hover:bg-slate-100 transition-colors">
            Lihat Semua Pesanan <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}