import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'seller'>('user');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk menampung data inputan form, sekarang dilengkapi password
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
          nim: formData.nim,
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
    <div className="min-h-screen flex">
      {/* Bagian Kiri (Banner) */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-800 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="h-8 w-8 text-green-300" />
            <span className="text-sm font-semibold tracking-wider text-green-300 uppercase">IPB Ecosystem</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Cultivating Food<br />Innovation.</h1>
          <p className="text-green-100 text-lg max-w-md">Join the vibrant student-led ecosystem bridging agricultural excellence with entrepreneurial spirit.</p>
        </div>
      </div>

      {/* Bagian Kanan (Form Register) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white py-12">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Create your Account</h2>

          {/* Toggle Role */}
          <div className="flex p-1 bg-gray-100 rounded-full mb-8">
            <button onClick={() => setRole('user')} className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${role === 'user' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Mahasiswa</button>
            <button onClick={() => setRole('seller')} className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${role === 'seller' ? 'bg-green-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>UMKM / Kantin</button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>
            
            {role === 'user' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input required type="text" value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (NIM)</label>
                  <input required type="text" value={formData.nim} onChange={(e) => setFormData({...formData, nim: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input required type="text" value={formData.no_whatsapp} onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko / Kantin</label>
                  <input required type="text" value={formData.nama_toko} onChange={(e) => setFormData({...formData, nama_toko: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                  <input required type="text" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-colors mt-4">
              {isLoading ? 'Memproses...' : 'Register →'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-semibold text-green-800 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}