import { useState } from "react";
import { Plus, Star, Store, MapPin, Search, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export function ProductCard({ 
  id,
  image, 
  title, 
  store, 
  lokasi_toko,
  price, 
  originalPrice,
  rating,
  isPromo,
  isNew,
  isService
}: any) {
  // 1. Tambahkan state untuk menangani fallback image jika gambar asli gagal dimuat
  const [imgSrc, setImgSrc] = useState(image || 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found');

  return (
    <Link to={`/product/${id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isPromo && <span className="bg-brand-orange text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">PROMO</span>}
          {isNew && <span className="bg-brand-green text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">NEW</span>}
        </div>
        
        {/* Heart/Like */}
        <button className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors"
                onClick={(e)=>{e.preventDefault();}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>

        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
          {/* 2. Implementasi event onError untuk mengganti gambar jika link rusak */}
          <img 
            src={imgSrc} 
            alt={title} 
            onError={() => setImgSrc('https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          {isService && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-slate-200">
                <Store className="w-3 h-3" /> SERVICE
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 line-clamp-1 flex-1 leading-snug">{title}</h3>
            {rating && (
              {/* 3. Pertegas warna rating agar lebih mudah dibaca */}
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded border border-amber-200 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {rating}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1 mb-4 text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <Store className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{store}</span>
            </div>
            {lokasi_toko && (
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#0f7636] shrink-0" />
                <span className="line-clamp-1">{lokasi_toko}</span>
              </div>
            )}
          </div>
          
          <div className="mt-auto flex items-end justify-between">
            <div>
              {originalPrice && (
                <div className="text-xs text-slate-400 line-through mb-0.5">Rp {originalPrice.toLocaleString('id-ID')}</div>
              )}
              <div className="text-xl font-bold text-brand-green">Rp {price.toLocaleString('id-ID')}</div>
            </div>
            
            {/* 4. Ubah background tombol dari transparan/pucat menjadi solid agar kontrasnya tinggi */}
            <button 
              className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-green-700 transition-all"
              onClick={(e)=>{e.preventDefault();}}
            >
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}