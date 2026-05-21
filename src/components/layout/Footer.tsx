export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout diubah menjadi flex center agar teks berada di tengah */}
        <div className="flex items-center justify-center text-sm text-center">
          <span className="font-bold text-[#0f7636]">IPB Food Hub</span>
          <span className="mx-2 text-slate-300">|</span>
          <span className="text-slate-500 font-medium">© 2026 IPB University - Food & UMKM Innovation Hub</span>
        </div>

      </div>
    </footer>
  );
}