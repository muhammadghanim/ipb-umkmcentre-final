import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf } from "lucide-react";
import axios from "axios";

export default function Login() {
  const [role, setRole] = useState<"user" | "seller">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const API_URL = "http://127.0.0.1:8000";
      const response = await axios.post(`${API_URL}/users/login`, {
        username: email,
        password: password
      });

      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "mahasiswa") {
        navigate("/home");
      } else {
        navigate("/seller/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 bg-white">
      {/* Left side banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-green flex-col justify-center px-16 relative overflow-hidden">
        {/* Subtle background pattern or gradient can be added here */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-emerald-900 opacity-90 z-0"></div>
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-lg px-3 py-1.5 backdrop-blur-sm mb-6 text-sm font-semibold tracking-wide">
            <Leaf className="w-4 h-4" /> IPB ECOSYSTEM
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Cultivating Food <br />
            Innovation.
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed max-w-md">
            Join the vibrant student-led ecosystem bridging agricultural excellence with entrepreneurial spirit.
          </p>
        </div>
        <div className="absolute bottom-8 left-16 right-16 flex items-center justify-between text-emerald-100/60 text-sm z-10">
          <div className="font-semibold text-emerald-50">IPB Food Hub</div>
          <div>&copy; 2024 IPB University - Food & UMKM Innovation Hub</div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-slate-50 relative">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your account</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
            <button
              onClick={() => setRole("user")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                role === "user"
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setRole("seller")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                role === "seller"
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Seller
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900">Email Address or Username</label>
              <input
                type="text"
                placeholder="johndoe@gmail.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-900">Password</label>
                <a href="#" className="text-sm font-medium text-brand-green hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"} <span className="text-xl leading-none">&rarr;</span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm text-slate-500 font-medium bg-white px-2">New to the hub?</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="mt-6">
            <Link
              to="/register"
              className="flex justify-center w-full py-3.5 rounded-lg border-2 border-brand-green text-brand-green font-semibold hover:bg-emerald-50 transition-colors"
            >
              Register Account
            </Link>
          </div>
        </div>

        {/* Footer links on mobile */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-sm text-slate-400 lg:hidden font-medium">
          <a href="#" className="hover:text-slate-600">Campus Directory</a>
          <a href="#" className="hover:text-slate-600">Support</a>
        </div>
      </div>
    </div>
  );
}
