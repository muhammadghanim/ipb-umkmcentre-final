import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Utensils, ArrowRight, CreditCard, Store, FileText } from 'lucide-react';
import api from '../../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'seller'>('user');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk menampung data inputan form
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '', 
    nim: '', 
    nama_lengkap: '', 
    no_whatsapp: '', 
    nama_toko: '', 
    deskripsi: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === 'user') {
        const payload = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nim: formData.nim.toUpperCase(), // NIM biasanya huruf besar
          nama_lengkap: formData.nama_lengkap,
          no_whatsapp: formData.no_whatsapp
        };
        await api.post('/users/mahasiswa', payload);
        alert("Pendaftaran Mahasiswa Berhasil! Silakan Login.");
        navigate('/login');
      } else {
        const payload = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nama_toko: formData.nama_toko,
          deskripsi: formData.deskripsi
        };
        await api.post('/users/umkm', payload);
        alert("Pendaftaran UMKM Berhasil! Silakan Login.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error register:", error);
      alert("Gagal mendaftar. Pastikan Username atau Email belum pernah digunakan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
{/* Sisi Kiri: Banner Visual (Premium) */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Fresh Groceries" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f7636] via-[#0f7636]/60 to-[#0f7636]/20"></div>
        
        {/* PERUBAHAN DI SINI: justify-center dan h-full */}
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 w-full h-full">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full w-fit mb-6 shadow-lg">
            <Utensils className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">IPB Food Hub</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg tracking-tight">
            Join the Food <br/>Revolution.
          </h1>
          <p className="text-base text-green-50 font-medium max-w-md drop-shadow-md">
            Hubungkan inovasi agrikultur dengan semangat kewirausahaan di dalam satu platform digital yang terintegrasi.
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Form Register */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-8 py-8">
          
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center justify-center lg:justify-start gap-2 text-[#0f7636] font-extrabold text-2xl mb-8 lg:hidden">
              <Utensils className="w-6 h-6" /> IPB Food Hub
            </Link>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Create your Account</h2>
            <p className="text-slate-500 font-medium">Pilih jenis akun dan lengkapi data dirimu.</p>
          </div>

          {/* Toggle Role Premium (Animasi Slide) */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl relative shadow-inner">
            {/* Animasi Background Aktif */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${role === 'user' ? 'left-1.5' : 'left-[calc(50%+0.375rem)]'}`}
            ></div>
            
            <button 
              type="button"
              onClick={() => {
                setRole('user');
                // Reset form saat pindah role agar tidak kecampur
                setFormData({ ...formData, nama_toko: '', deskripsi: '' });
              }}
              className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${role === 'user' ? 'text-[#0f7636]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Mahasiswa
            </button>
            <button 
              type="button"
              onClick={() => {
                setRole('seller');
                // Reset form saat pindah role
                setFormData({ ...formData, nama_lengkap: '', nim: '', no_whatsapp: '' });
              }}
              className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${role === 'seller' ? 'text-[#0f7636]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              UMKM / Kantin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username berlaku untuk semua role */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><User className="w-4 h-4" /></div>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} placeholder="mahasiswa123" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm lowercase" />
              </div>
              <p className="text-[10px] text-slate-500">Tanpa spasi, huruf kecil semua.</p>
            </div>

            {/* Field Khusus Mahasiswa */}
            {role === 'user' && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">Nama Lengkap</label>
                    <input type="text" required value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} placeholder="Budi Santoso" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">Student ID (NIM)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><CreditCard className="w-4 h-4" /></div>
                      <input type="text" required value={formData.nim} onChange={(e) => setFormData({...formData, nim: e.target.value})} placeholder="G641..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm uppercase" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Nomor WhatsApp</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><Phone className="w-4 h-4" /></div>
                    <input type="tel" required value={formData.no_whatsapp} onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})} placeholder="08123456789" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Field Khusus UMKM / Kantin */}
            {role === 'seller' && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Nama Toko / Kantin</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><Store className="w-4 h-4" /></div>
                    <input type="text" required value={formData.nama_toko} onChange={(e) => setFormData({...formData, nama_toko: e.target.value})} placeholder="Kantin Ayam Bakar IPB" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Deskripsi Singkat</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><FileText className="w-4 h-4" /></div>
                    <textarea required rows={2} value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} placeholder="Jual makanan apa saja..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Email & Password berlaku untuk semua role */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-slate-900">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><Mail className="w-4 h-4" /></div>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder={role === 'user' ? "email@gmail.com" : "kantin@gmail.com"} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors"><Lock className="w-4 h-4" /></div>
                <input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Minimal 6 karakter" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium text-sm" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#e8811e] hover:bg-[#cc6e16] text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Register Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0f7636] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}