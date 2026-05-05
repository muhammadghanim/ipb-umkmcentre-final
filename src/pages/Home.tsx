import Navbar from "../components/layout/Navbar";
import { ProductCard } from "../components/ui/ProductCard";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const API_URL = "http://127.0.0.1:8000";
        const response = await axios.get(`${API_URL}/menus/`);
        setMenus(response.data);
      } catch (err) {
        console.error("Error fetching menus:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const categories = [
    { name: "All Categories", active: true },
    { name: "Food", active: false },
    { name: "Drink", active: false },
    { name: "Services", active: false },
    { name: "Crafts", active: false },
    { name: "Halal Certified", active: false },
  ];

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Banner Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-brand-green to-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center min-h-[320px]">
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 opacity-50 blur-2xl"></div>
             <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-brand-green-dark opacity-40 blur-2xl"></div>
             
             <div className="relative z-10 max-w-lg">
                <span className="inline-block bg-brand-orange text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
                  STUDENT SPECIAL
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                  Festival Jajanan <br/>Kampus 2026
                </h2>
                <p className="text-emerald-100 text-lg mb-8 max-w-md">
                  Support fellow students! Discover unique culinary creations from IPB's top UMKM innovators.
                </p>
                <button className="bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
                  Explore Festival <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
          
          <div className="grid grid-rows-2 gap-6 h-full">
            <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center text-white min-h-[150px]">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-r from-transparent to-amber-900/50"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-1">Buy 1 Get 1 Kopi</h3>
                <p className="text-sm text-slate-300 mb-4">Valid at IPB Dramaga branch</p>
                <button className="text-white text-sm font-semibold inline-flex items-center gap-1 hover:text-amber-400 transition-colors">
                  Claim Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-brand-green border border-emerald-700/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center text-white min-h-[150px]">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold mb-1">Discover Promos</h3>
                <p className="text-sm text-emerald-100 mb-4 opacity-90">Discover exclusive promotions. Save up to 50%</p>
                <a href="#" className="text-white text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-emerald-200 transition-colors">
                  View Directory
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                  cat.active
                    ? "bg-brand-green text-white border-brand-green shadow-md shadow-brand-green/20"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Trending Today */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Today</h2>
            <a href="#" className="hidden sm:inline-flex items-center text-brand-green font-semibold hover:underline">
              See all <ChevronRight className="w-5 h-5 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-500">Loading delicious food...</div>
            ) : menus.length > 0 ? (
              menus.slice(0, 8).map(menu => (
                <ProductCard 
                  key={menu.id_menu}
                  id={menu.id_menu}
                  image={menu.foto_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"} 
                  title={menu.nama_menu} 
                  store="UMKM Store" 
                  price={menu.harga} 
                  rating={4.8}
                />
              ))
            ) : (
               <div className="col-span-full py-12 text-center text-slate-500">No menus available yet.</div>
            )}
          </div>
        </section>

        {/* Hot Student Deals */}
        <section className="pt-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hot Student Deals</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             <ProductCard 
              id="5"
              image="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600" 
              title="Nasi Goreng Spesial IPB" 
              store="Warung Pojok Asrama" 
              price={14000} 
              originalPrice={20000}
              isPromo={true}
            />
            <ProductCard 
              id="6"
              image="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600" 
              title="Mie Geprek Level Dewa" 
              store="Ayam Geprek Mpok" 
              price={15000} 
            />
            <ProductCard 
              id="7"
              image="https://images.unsplash.com/photo-1536935338788-8422119c8f0e?auto=format&fit=crop&q=80&w=600" 
              title="Es Matcha Latte Jumbo" 
              store="Kopi Botani" 
              price={16000} 
              originalPrice={22000}
              isNew={true}
            />
            <ProductCard 
              id="8"
              image="https://images.unsplash.com/photo-1615837197154-2e801f41edeb?auto=format&fit=crop&q=80&w=600" 
              title="Martabak Manis Keju" 
              store="Martabak Legit" 
              price={24000} 
              originalPrice={30000}
              isPromo={true}
            />
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 text-sm py-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 font-medium gap-4 mt-8">
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
      </footer>
    </div>
  );
}
