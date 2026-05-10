import { useState, useEffect } from 'react';
import { Plus, Ticket, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function SellerPromo() {
  const [showForm, setShowForm] = useState(false);
  const [promos, setPromos] = useState<any[]>([]);
  const UMKM_ID = localStorage.getItem('UMKM_ID');

  // Form State
  const [formData, setFormData] = useState({
    nama_promo: '', kode_promo: '', nominal_diskon: '', tgl_mulai: '', tgl_berakhir: ''
  });

  const fetchPromos = async () => {
    try {
      const response = await api.get(`/promo/umkm/${UMKM_ID}`);
      setPromos(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { if(UMKM_ID) fetchPromos(); }, [UMKM_ID]);

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/promo/umkm/${UMKM_ID}`, {
        ...formData,
        nominal_diskon: parseFloat(formData.nominal_diskon),
        tgl_mulai: new Date(formData.tgl_mulai).toISOString(),
        tgl_berakhir: new Date(formData.tgl_berakhir).toISOString()
      });
      alert("Promo berhasil ditambahkan!");
      setShowForm(false);
      fetchPromos();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Gagal membuat promo");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Management</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-amber-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2">
          {showForm ? 'Cancel' : <><Plus className="w-5 h-5" /> Create Promo</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Promo Code</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleAddPromo}>
            <div>
              <label className="block text-sm font-medium mb-1">Promo Name</label>
              <input required value={formData.nama_promo} onChange={(e)=>setFormData({...formData, nama_promo: e.target.value})} type="text" placeholder="e.g. Diskon Akhir Bulan" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Promo Code (Unique)</label>
              <input required value={formData.kode_promo} onChange={(e)=>setFormData({...formData, kode_promo: e.target.value.toUpperCase()})} type="text" placeholder="e.g. HEMAT10" className="w-full px-4 py-2 border rounded-lg uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Nominal (Rp)</label>
              <input required value={formData.nominal_diskon} onChange={(e)=>setFormData({...formData, nominal_diskon: e.target.value})} type="number" placeholder="5000" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input required value={formData.tgl_mulai} onChange={(e)=>setFormData({...formData, tgl_mulai: e.target.value})} type="date" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input required value={formData.tgl_berakhir} onChange={(e)=>setFormData({...formData, tgl_berakhir: e.target.value})} type="date" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="bg-green-800 text-white font-medium py-2 px-6 rounded-lg">Save Promo</button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Promo */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b">
            <tr>
              <th className="p-4 font-medium">Promo Info</th>
              <th className="p-4 font-medium">Discount Code</th>
              <th className="p-4 font-medium">Nominal</th>
              <th className="p-4 font-medium">Validity Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {promos.map((promo) => (
              <tr key={promo.id_promo}>
                <td className="p-4 font-bold text-gray-900 flex items-center gap-2"><Ticket className="w-4 h-4 text-amber-500" /> {promo.nama_promo}</td>
                <td className="p-4"><span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-mono text-sm border border-gray-200">{promo.kode_promo}</span></td>
                <td className="p-4 font-medium text-green-800">Rp {promo.nominal_diskon.toLocaleString('id-ID')}</td>
                <td className="p-4 text-sm text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(promo.tgl_mulai).toLocaleDateString()} to {new Date(promo.tgl_berakhir).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}