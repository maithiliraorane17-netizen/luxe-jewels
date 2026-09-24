import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Package, ShoppingCart, FolderTree, MessageSquare, Newspaper, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/collections", label: "Collections", icon: FolderTree },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-cream">
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex w-64 flex-shrink-0 flex-col bg-ink-900 px-5 py-8 text-cream"
      >
        <h2 className="mb-10 px-2 font-display text-2xl font-bold">
          Luxe<span className="text-gold-400">Admin</span>
        </h2>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive ? "bg-gold-500 text-ink-900 font-medium" : "text-cream/70 hover:bg-ink-800"
                }`
              }
            >
              <l.icon size={18} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream/70 hover:bg-ink-800"
        >
          <LogOut size={18} /> Exit to Site
        </button>
      </motion.aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
