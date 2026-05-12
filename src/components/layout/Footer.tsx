import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Flexbox: Kolom di HP, Baris di Desktop */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Bagian Kiri: Brand & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-center sm:text-left">
            <span className="font-bold text-[#0f7636]">IPB Food Hub</span>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="text-slate-500 font-medium">© 2026 IPB University - Food & UMKM Innovation Hub</span>
          </div>

          {/* Bagian Kanan: Links */}
          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8 text-sm text-slate-500 font-medium">
            <Link to="#" className="hover:text-[#0f7636] transition-colors">Campus Directory</Link>
            <Link to="#" className="hover:text-[#0f7636] transition-colors">Seller Terms</Link>
            <Link to="#" className="hover:text-[#0f7636] transition-colors">Support</Link>
            <Link to="#" className="hover:text-[#0f7636] transition-colors">Privacy Policy</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}