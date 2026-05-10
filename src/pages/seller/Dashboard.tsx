import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function SellerDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, activeOrders: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const UMKM_ID = localStorage.getItem('UMKM_ID');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(`/pesanan/umkm/${UMKM_ID}`);
        const allOrders = response.data;
        
        // Kalkulasi Statistik
        const active = allOrders.filter((o: any) => !['SELESAI', 'DIBATALKAN'].includes(o.status_pesanan));
        const sales = allOrders
          .filter((o: any) => o.status_pesanan === 'SELESAI')
          .reduce((sum: number, o: any) => sum + o.total_harga, 0);

        setStats({ totalSales: sales, activeOrders: active.length });

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Seller</h1>
        <p className="text-gray-500 text-sm">Here is what's happening with your store today.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-2">Total Sales (Selesai)</div>
          <div className="text-3xl font-bold text-gray-900">Rp {stats.totalSales.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-2">Active Orders</div>
          <div className="text-3xl font-bold text-gray-900">{stats.activeOrders}</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Items Count</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={4} className="py-4 text-center">Memuat data...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center">Belum ada pesanan masuk.</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id_pesanan}>
                    <td className="py-4 font-medium text-gray-900">#{order.id_pesanan.substring(0,8).toUpperCase()}</td>
                    <td className="py-4 text-gray-600">{order.detail_pesanan?.length || 0} Menu</td>
                    <td className="py-4 font-medium">Rp {order.total_harga.toLocaleString('id-ID')}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-700">
                        {order.status_pesanan}
                      </span>
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