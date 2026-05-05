import { Store, LayoutDashboard, Archive, ShoppingBag, BarChart3, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SellerSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/seller/inventory", icon: Archive },
    { name: "Orders", path: "/seller/orders", icon: ShoppingBag },
    { name: "Analytics", path: "/seller/analytics", icon: BarChart3 },
    { name: "Settings", path: "/seller/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 pb-8 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center shrink-0">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-lg leading-tight">Admin Panel</h1>
          <p className="text-xs text-slate-500">IPB Entrepreneurship</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {links.map((link) => {
          const isActive = currentPath === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? "bg-emerald-50 text-brand-green border-r-4 border-brand-green" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
