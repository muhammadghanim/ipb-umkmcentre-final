import { useState } from 'react';
import { Leaf } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Memanggil endpoint login backend
      const response = await api.post('/users/login', { email, password });
      
      // Mengambil data dari response (Sesuai dengan backend FastAPI kita)
      const { access_token, role, user_id } = response.data;

      // Menyimpan Token JWT agar dikirim di setiap request (di handle oleh api.ts)
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      
      // Menyimpan ID berdasarkan rolenya agar form checkout/inventory tetap berfungsi
      if (role === 'mahasiswa') {
        localStorage.setItem('STUDENT_ID', user_id);
        alert("Login Mahasiswa Berhasil!");
        navigate('/'); 
      } else if (role === 'umkm') {
        localStorage.setItem('UMKM_ID', user_id);
        alert("Login UMKM Berhasil!");
        navigate('/seller/dashboard'); 
      }
    } catch (error) {
      console.error("Gagal Login:", error);
      alert("Email atau password yang Anda masukkan salah!");
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
        </div>
      </div>

      {/* Bagian Kanan (Form Login) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@mhs.ipb.ac.id"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-800 outline-none transition-all"
              />
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
              {isLoading ? 'Loading...' : 'Sign In'} <span>→</span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            New to the hub? <Link to="/register" className="font-semibold text-green-800 hover:underline">Register Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}