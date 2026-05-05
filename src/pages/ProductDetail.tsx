import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, ChevronRight, CheckCircle2, ShieldCheck, Snowflake, ShoppingCart, MapPin } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { ProductCard } from "../components/ui/ProductCard";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("Default");
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const API_URL = "http://127.0.0.1:8000";
        const response = await axios.get(`${API_URL}/menus/${id}`);
        setMenu(response.data);
      } catch (err) {
        console.error("Error fetching menu details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMenu();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><p className="text-slate-500">Loading details...</p></div>;
  }

  if (!menu) {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><p className="text-slate-500">Product not found.</p></div>;
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 gap-2 mb-6">
          <Link to="/home" className="hover:text-brand-green">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/home" className="hover:text-brand-green">Explore</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/home" className="hover:text-brand-green">Artisan Beverages</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-slate-900">Cold Brew Coffee</span>
        </nav>

        {/* Product Hero */}
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-200">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
               <img src={menu.foto_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"} alt="Product" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-4">
              <span className="bg-orange-100 text-brand-orange text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">PRE-ORDER</span>
              <span className="bg-emerald-100 text-brand-green text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">HALAL</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">{menu.nama_menu}</h1>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <a href="#reviews" className="font-semibold text-slate-900 hover:underline">128 Reviews</a>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{menu.stok > 0 ? "In Stock" : "Out of Stock"}</span>
            </div>

            <div className="text-4xl font-bold text-brand-green mb-6">Rp {menu.harga?.toLocaleString('id-ID')}</div>

            <p className="text-slate-600 leading-relaxed mb-10 text-lg">
              {menu.deskripsi || "No description provided by the seller."}
            </p>

            <div className="h-px bg-slate-200 w-full mb-8"></div>

            <div className="mb-10">
              <h3 className="font-semibold text-slate-900 mb-3">Quantity</h3>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-white">
                  <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input type="text" value={quantity} readOnly className="w-12 text-center font-semibold border-none focus:ring-0 text-slate-900" />
                  <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xl" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                
                <Link to="/cart" className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3.5 px-6 rounded-lg transition-colors flex justify-center items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Pre-order Now
                </Link>
                <button 
                  onClick={() => {
                    const cartStr = localStorage.getItem("cart");
                    let cart = cartStr ? JSON.parse(cartStr) : [];
                    // check if item exists
                    const existing = cart.find((item: any) => item.id_menu === menu.id_menu);
                    if (existing) {
                      existing.jumlah += quantity;
                    } else {
                      cart.push({ ...menu, jumlah: quantity });
                    }
                    localStorage.setItem("cart", JSON.stringify(cart));
                    alert("Added to cart!");
                  }}
                  className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 px-6 rounded-lg transition-colors flex justify-center items-center gap-2">
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-1">
                  Kopi Kampus IPB <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-100" />
                </h4>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Dramaga Campus, Bogor
                </p>
              </div>
              <button className="text-brand-green font-semibold border-2 border-brand-green/20 hover:border-brand-green hover:bg-brand-green/5 px-4 py-2 rounded-lg text-sm transition-colors">
                Visit Store
              </button>
            </div>

          </div>
        </div>

        {/* Product Details Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                <ShieldCheck className="w-5 h-5 text-brand-green" /> The Details
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {menu.deskripsi || "No description available for this product."}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> 
                  Specs
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-900">{menu.kategori || "Food"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Available Stock</span>
                    <span className="font-medium text-slate-900">{menu.stok}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Seller Validation</span>
                    <span className="font-medium text-brand-green flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="reviews" className="pt-4">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
            <a href="#" className="font-semibold text-brand-green hover:underline inline-flex items-center">See all 128 reviews <ChevronRight className="w-4 h-4" /></a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="md:col-span-1">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-6xl font-bold text-slate-900 tracking-tighter leading-none">4.8</span>
                <div className="mb-1">
                  <div className="flex text-amber-400 mb-1">
                    <Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Based on 128 ratings</div>
                </div>
              </div>
              
              <div className="space-y-2 mt-6">
                {[
                  { star: 5, pct: "85%", count: 102 },
                  { star: 4, pct: "10%", count: 15 },
                  { star: 3, pct: "3%", count: 5 },
                  { star: 2, pct: "0%", count: 0 },
                  { star: 1, pct: "2%", count: 2 },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="w-2">{row.star}</span>
                    <Star className="w-3 h-3 fill-slate-300 text-slate-300" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }}></div>
                    </div>
                    <span className="w-6 text-right tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-green font-bold flex items-center justify-center text-xs">A</div>
                    <span className="font-semibold text-slate-900 text-sm">Anita S.</span>
                  </div>
                  <span className="text-xs text-slate-400">2 days ago</span>
                </div>
                <div className="flex text-amber-400 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Super smooth and not bitter at all! Perfect companion for completing my thesis late at night. Will definitely pre-order the 1L jug next time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-brand-orange font-bold flex items-center justify-center text-xs">B</div>
                    <span className="font-semibold text-slate-900 text-sm">Budi T.</span>
                  </div>
                  <span className="text-xs text-slate-400">1 week ago</span>
                </div>
                <div className="flex text-amber-400 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Great taste and nice packaging. Love that it supports local campus UMKM. Delivery was slightly delayed but the product itself is top notch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* You Might Also Like */}
        <section className="pt-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCard 
              id="9"
              image="https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=600" 
              title="Premium Matcha Latte" 
              store="Kopi Kampus IPB" 
              price={28000} 
            />
            <ProductCard 
              id="10"
              image="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600" 
              title="Fudgy Brownies Bite" 
              store="Sweet Tooth Bakery" 
              price={45000} 
            />
            <ProductCard 
              id="11"
              image="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600" 
              title="Nitro Cold Brew Can" 
              store="Kopi Kampus IPB" 
              price={25000} 
              isNew={true}
            />
            <ProductCard 
              id="12"
              image="https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=600" 
              title="Artisan Choco Cookies" 
              store="Sweet Tooth Bakery" 
              price={30000} 
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
