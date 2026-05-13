import { useState, useEffect } from 'react';
import { Plus, Ticket, Calendar, X, Tag, CheckCircle2, Clock, Percent } from 'lucide-react';
import api from '../../services/api';

export default function SellerPromo() {
  const [showForm, setShowForm] = useState(false);
  const [promos, setPromos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const UMKM_ID = localStorage.getItem('UMKM_ID');

  // Form State
  const [formData, setFormData] = useState({
    nama_promo: '', kode_promo: '', nominal_diskon: '', tgl_mulai: '', tgl_berakhir: ''
  });

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/promo/umkm/${UMKM_ID}`);
      setPromos(response.data);
    } catch (error) { 
      console.error(error); 
    } finally {
      setIsLoading(false);
    }
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
      setFormData({ nama_promo: '', kode_promo: '', nominal_diskon: '', tgl_mulai: '', tgl_berakhir: '' });
      fetchPromos();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Gagal membuat promo");
    }
  };

  // Helper untuk mengecek apakah promo masih aktif
  const isPromoActive = (endDate: string) => {
    return new Date(endDate).setHours(23, 59, 59, 999) >= new Date().getTime();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Manajemen Promo</h1>
          <p className="text-slate-500 font-medium">Buat kode diskon untuk menarik lebih banyak mahasiswa membeli di tokomu.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-[#e8811e] hover:bg-[#cc6e16] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto"
        >
          <Plus className="w-5 h-5" /> Buat Promo Baru
        </button>
      </div>

      {/* Form Buat Promo */}
      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#e8811e]"></div>
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#e8811e]" /> Buat Kode Diskon Baru
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleAddPromo}>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Nama Kampanye Promo</label>
              <input required value={formData.nama_promo} onChange={(e)=>setFormData({...formData, nama_promo: e.target.value})} type="text" placeholder="Misal: Diskon Pejuang Skripsi" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#e8811e]/10 focus:border-[#e8811e] outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Kode Promo (Unik)</label>
              <input required value={formData.kode_promo} onChange={(e)=>setFormData({...formData, kode_promo: e.target.value.toUpperCase().replace(/\s/g, '')})} type="text" placeholder="Misal: SKRIPSI10" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#e8811e]/10 focus:border-[#e8811e] outline-none transition-all uppercase font-mono font-bold tracking-wider text-[#0f7636]" />
              <p className="text-xs text-slate-500 mt-1.5">Gunakan huruf kapital dan angka tanpa spasi.</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-2">Potongan Harga (Rp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">Rp</span>
                </div>
                <input required value={formData.nominal_diskon} onChange={(e)=>setFormData({...formData, nominal_diskon: e.target.value})} type="number" placeholder="5000" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#e8811e]/10 focus:border-[#e8811e] outline-none transition-all font-bold" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400"/> Berlaku Mulai</label>
                <input required value={formData.tgl_mulai} onChange={(e)=>setFormData({...formData, tgl_mulai: e.target.value})} type="date" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#e8811e]/10 focus:border-[#e8811e] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400"/> Berakhir Pada</label>
                <input required value={formData.tgl_berakhir} onChange={(e)=>setFormData({...formData, tgl_berakhir: e.target.value})} type="date" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-[#e8811e]/10 focus:border-[#e8811e] outline-none transition-all" />
              </div>
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-4 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors mr-3">
                Batal
              </button>
              <button type="submit" className="bg-[#e8811e] hover:bg-[#cc6e16] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md">
                Simpan & Aktifkan Promo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Promo */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Info Kampanye</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Kode Kupon</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Potongan</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Masa Berlaku</th>
                <th className="px-6 py-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8811e] mx-auto mb-3"></div>
                    <span className="text-slate-500 font-medium">Memuat data promo...</span>
                  </td>
                </tr>
              )}

              {!isLoading && promos.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <Percent className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada promo</h3>
                    <p className="text-slate-500">Buat promo pertamamu untuk meningkatkan penjualan!</p>
                  </td>
                </tr>
              )}

              {promos.map((promo) => {
                const active = isPromoActive(promo.tgl_berakhir);
                return (
                  <tr key={promo.id_promo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Tag className={`w-4 h-4 ${active ? 'text-amber-500' : 'text-slate-400'}`} /> 
                        {promo.nama_promo}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative inline-block">
                        {/* Efek Kupon bergerigi */}
                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-r border-slate-200"></div>
                        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-l border-slate-200"></div>
                        
                        <span className={`px-4 py-2 rounded-lg font-mono text-sm font-bold tracking-widest border border-dashed ${active ? 'bg-green-50 border-green-300 text-green-800' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
                          {promo.kode_promo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-extrabold text-[#0f7636] text-lg">
                        Rp {promo.nominal_diskon.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" /> 
                        {new Date(promo.tgl_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} 
                        <span className="text-slate-300 mx-1">→</span> 
                        {new Date(promo.tgl_berakhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {active ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" /> Berakhir
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}