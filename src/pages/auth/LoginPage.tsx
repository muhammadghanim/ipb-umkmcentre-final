import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Leaf, ArrowRight } from 'lucide-react';
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
      const response = await api.post('/users/login', { email, password });
      const { access_token, role, user_id, nama } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      if (nama) localStorage.setItem('NAMA_USER', nama); 
      
      if (role === 'mahasiswa') {
        localStorage.setItem('STUDENT_ID', user_id);
        navigate('/'); 
      } else if (role === 'umkm') {
        localStorage.setItem('UMKM_ID', user_id);
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
    <div className="min-h-screen flex bg-white">
      
      {/* Sisi Kiri: Banner Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Food Innovation" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f7636] via-[#0f7636]/60 to-[#0f7636]/20"></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 w-full h-full">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full w-fit mb-6 shadow-lg">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">IPB Ecosystem</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg tracking-tight">
            Cultivating <br/>Food Innovation.
          </h1>
          <p className="text-lg text-green-50 font-medium max-w-md drop-shadow-md">
            Bergabunglah dengan ekosistem digital yang menghubungkan civitas akademika IPB dengan kuliner lokal terbaik.
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Form Login (SUDAH DIPERBAIKI POSISINYA) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center justify-center lg:justify-start gap-2 text-[#0f7636] font-extrabold text-2xl mb-8 lg:hidden">
              <Leaf className="w-6 h-6" /> IPB Food Hub
            </Link>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gmail.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 flex justify-between">
                Password
                <a href="#" className="text-[#0f7636] hover:underline text-xs">Forgot password?</a>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0f7636] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#0f7636]/10 focus:border-[#0f7636] outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#e8811e] hover:bg-[#cc6e16] text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 font-medium">
            New to the hub?{' '}
            <Link to="/register" className="text-[#0f7636] font-bold hover:underline">
              Register Account
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}