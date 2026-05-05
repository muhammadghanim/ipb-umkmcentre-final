import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import axios from "axios";

export default function Register() {
  const [role, setRole] = useState<"user" | "seller">("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    name: "", // 'nama_lengkap' for user, 'nama_toko' for seller
    nim: "",
    no_whatsapp: "",
    deskripsi: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const API_URL = "http://127.0.0.1:8000";
      
      if (role === 'user') {
        await axios.post(`${API_URL}/users/mahasiswa`, {
          username: formData.username,
          email: formData.email,
          nim: formData.nim || "000000",
          nama_lengkap: formData.name,
          no_whatsapp: formData.no_whatsapp
        });
      } else {
        await axios.post(`${API_URL}/users/umkm`, {
          username: formData.username,
          email: formData.email,
          nama_toko: formData.name,
          deskripsi: formData.deskripsi || "UMKM IPB"
        });
      }
      
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-12 text-slate-900 bg-brand-bg relative items-center">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-12 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create your Account</h2>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-lg mb-8 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
              role === "user"
                ? "bg-brand-green text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
              role === "seller"
                ? "bg-brand-green text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Seller
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-900">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-900">{role === 'seller' ? 'Business Name' : 'Full Name'}</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
              required
            />
          </div>

          {role === 'user' && (
             <div className="space-y-1.5">
               <label className="text-sm font-semibold text-slate-900">Student ID (NIM)</label>
               <input
                 type="text"
                 value={formData.nim}
                 onChange={e => setFormData({...formData, nim: e.target.value})}
                 className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
                 required
               />
             </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-900">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900">Confirm Password</label>
              <input
                type="password"
                value={formData.confirm}
                onChange={e => setFormData({...formData, confirm: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative flex cursor-pointer items-center rounded-full p-0">
              <input type="checkbox" required className="peer w-5 h-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-brand-green checked:bg-brand-green transition-all" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <Check className="h-3 w-3 flex-shrink-0" strokeWidth={3} />
              </div>
            </label>
            <span className="text-sm font-medium text-slate-700">I agree to the terms and conditions.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (role === 'seller' ? 'Continue' : 'Register')} <span className="text-xl leading-none">&rarr;</span>
          </button>
          
          <div className="text-center mt-4">
             <Link to="/login" className="text-sm text-brand-green font-medium hover:underline">Already have an account? Sign In</Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto px-6 border-t border-slate-200 text-sm py-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 font-medium gap-4 mt-auto">
        <div className="flex items-center gap-4">
          <span className="text-brand-green font-bold">IPB Food Hub</span>
          <span className="w-px h-4 bg-slate-300"></span>
          <span>&copy; 2024 IPB University - Food & UMKM Innovation Hub</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-800">Campus Directory</a>
          <a href="#" className="hover:text-slate-800">Seller Terms</a>
          <a href="#" className="hover:text-slate-800">Support</a>
          <a href="#" className="hover:text-slate-800">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
