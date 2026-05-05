import { Plus, Banknote, ListTodo, Star, MoreVertical, X } from "lucide-react";
import SellerSidebar from "../../components/layout/SellerSidebar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SellerDashboard() {
  const [menus, setMenus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    // ...
    nama_menu: "",
    harga: "",
    stok: "",
    deskripsi: "",
    kategori: "Food",
    foto_url: ""
  });
  
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchData = async () => {
    if (!user || user.role !== "umkm") return;
    try {
      const API_URL = "http://127.0.0.1:8000";
      const [menusRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/menus/umkm/${user.id}`),
        axios.get(`${API_URL}/pesanan/umkm/${user.id}`)
      ]);
      setMenus(menusRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = "http://127.0.0.1:8000";
      await axios.post(`${API_URL}/menus/umkm/${user.id}`, {
        nama_menu: newMenu.nama_menu,
        harga: parseFloat(newMenu.harga),
        stok: parseInt(newMenu.stok),
        deskripsi: newMenu.deskripsi,
        kategori: newMenu.kategori,
        foto_url: newMenu.foto_url
      });
      setShowAddMenu(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to add menu");
    }
  };

  const handleAcceptOrder = async (id: string) => {
     try {
        const API_URL = "http://127.0.0.1:8000";
        await axios.put(`${API_URL}/pesanan/${id}/status`, null, { params: { status: "PROCESSING" } });
        fetchData();
     } catch (err) {
        console.error(err);
     }
  };

  const handleReadyOrder = async (id: string) => {
     try {
        const API_URL = "http://127.0.0.1:8000";
        await axios.put(`${API_URL}/pesanan/${id}/status`, null, { params: { status: "READY" } });
        fetchData();
     } catch (err) {
        console.error(err);
     }
  };

  const activeOrders = orders.filter(o => o.status_pesanan !== "DONE" && o.status_pesanan !== "CANCELLED");
  const todaySales = orders.filter(o => o.status_pesanan !== "CANCELLED").reduce((acc, o) => acc + o.total_harga, 0);

  return (
    <div className="min-h-screen bg-brand-bg pl-64">
      <SellerSidebar />
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="font-bold text-brand-green text-xl">IPB Food Hub</div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-700">{user?.nama || "Seller"}</span>
          <button className="w-8 h-8 rounded bg-slate-200 border border-slate-300"></button>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome Back, {user?.nama || "Seller"}</h1>
            <p className="text-slate-500">Here is what's happening with your store today.</p>
          </div>
          <button onClick={() => setShowAddMenu(true)} className="bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-slate-600">Total Sales Today</h3>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex justify-center items-center text-brand-green"><Banknote className="w-4 h-4" /></div>
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">Rp {todaySales.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-brand-green flex items-center gap-1">
              From {orders.filter(o => o.status_pesanan !== "CANCELLED").length} orders
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-slate-600">Active Orders</h3>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex justify-center items-center text-blue-600"><ListTodo className="w-4 h-4" /></div>
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">{activeOrders.length}</div>
            <div className="text-sm font-medium text-slate-500">
              Needs your attention
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-slate-600">Products</h3>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex justify-center items-center text-amber-500"><Star className="w-4 h-4" /></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{menus.length} Menus</div>
            <div className="text-sm font-medium text-slate-500">
              Active in your store
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              <button className="text-sm font-semibold text-brand-green hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="px-6 py-4 font-semibold font-mono">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Items</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : activeOrders.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No active orders right now.</td></tr>
                  ) : (
                    activeOrders.map((order) => (
                      <tr key={order.id_pesanan} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-500">#{order.id_pesanan.split('-')[0]}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">Student {order.id_mahasiswa.split('-')[0]}</div>
                          <div className="text-xs text-slate-500">{new Date(order.tgl_pesanan).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{order.detail_pesanan?.length || 0} items</td>
                        <td className="px-6 py-4">
                          {order.status_pesanan === "PENDING" && <span className="inline-flex bg-orange-100 text-brand-orange px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Pending</span>}
                          {order.status_pesanan === "PROCESSING" && <span className="inline-flex bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Processing</span>}
                          {order.status_pesanan === "READY" && <span className="inline-flex bg-emerald-100 text-brand-green px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Ready</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             {order.status_pesanan === "PENDING" && (
                                <button onClick={() => handleAcceptOrder(order.id_pesanan)} className="text-xs bg-brand-green text-white px-3 py-1.5 rounded font-semibold hover:bg-emerald-800 transition-colors">Accept</button>
                             )}
                             {order.status_pesanan === "PROCESSING" && (
                                <button onClick={() => handleReadyOrder(order.id_pesanan)} className="text-xs bg-brand-orange text-white px-3 py-1.5 rounded font-semibold hover:bg-brand-orange-dark transition-colors">Ready</button>
                             )}
                            <button className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded font-semibold hover:bg-slate-200 transition-colors">Details</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Inventory */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Inventory Quick View</h2>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6 flex-1 max-h-[400px] overflow-y-auto">
              {loading ? (
                 <div className="text-center text-slate-500 py-4">Loading...</div>
              ) : menus.length > 0 ? (
                menus.map(menu => (
                  <div key={menu.id_menu} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 overflow-hidden relative">
                       {menu.stok <= 0 && (
                          <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center font-bold text-xs uppercase z-10">OUT</div>
                       )}
                       {menu.foto_url && <img src={menu.foto_url} alt={menu.nama_menu} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{menu.nama_menu}</h4>
                      <div className={`text-xs font-medium ${menu.stok <= 0 ? "text-red-500" : "text-slate-500"}`}>
                        Rp {menu.harga} &bull; Stock: {menu.stok}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-4">No menus found. Add some!</div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
               <button className="w-full py-2 text-sm font-semibold text-brand-green hover:underline">Manage All Inventory</button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Menu Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-900">Add New Product</h2>
              <button onClick={() => setShowAddMenu(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddMenu} className="p-6 overflow-y-auto space-y-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">Product Name</label>
                  <input type="text" required value={newMenu.nama_menu} onChange={e => setNewMenu({...newMenu, nama_menu: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" placeholder="E.g. Nasi Goreng Spesial" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Price (Rp)</label>
                    <input type="number" required value={newMenu.harga} onChange={e => setNewMenu({...newMenu, harga: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" placeholder="15000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1.5">Initial Stock</label>
                    <input type="number" required value={newMenu.stok} onChange={e => setNewMenu({...newMenu, stok: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" placeholder="50" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">Category</label>
                  <select value={newMenu.kategori} onChange={e => setNewMenu({...newMenu, kategori: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none bg-white">
                     <option value="Food">Food</option>
                     <option value="Drink">Drink</option>
                     <option value="Snack">Snack</option>
                     <option value="Other">Other</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">Image URL</label>
                  <input type="text" value={newMenu.foto_url} onChange={e => setNewMenu({...newMenu, foto_url: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" placeholder="https://example.com/image.jpg" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1.5">Description</label>
                  <textarea value={newMenu.deskripsi} onChange={e => setNewMenu({...newMenu, deskripsi: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none min-h-[80px]" placeholder="Brief description..."></textarea>
               </div>
               <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddMenu(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-green hover:bg-emerald-800 rounded-lg shadow-sm">Save Product</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
