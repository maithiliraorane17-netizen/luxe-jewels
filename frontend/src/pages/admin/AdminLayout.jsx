import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Package, ShoppingCart, FolderTree, MessageSquare, Newspaper, Users, LogOut, Menu, Home } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/collections", label: "Collections", icon: FolderTree },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const Nav = (
    <>
      <h2 className="mb-10 px-3 font-display text-2xl font-semibold text-cream">Luxe<span className="gold-text italic">Admin</span></h2>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? "bg-gradient-to-r from-gold-400 to-gold-300 font-medium text-ink-950" : "text-cream/65 hover:bg-white/5 hover:text-cream"}`}><l.icon size={18} /> {l.label}</NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-4">
        <p className="mb-3 px-3 text-xs text-cream/40">{user?.email}</p>
        <button onClick={() => navigate("/")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream/65 hover:bg-white/5"><Home size={18} /> View store</button>
        <button onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream/65 hover:bg-white/5"><LogOut size={18} /> Sign out</button>
      </div>
    </>
  );
  return (
    <div className="admin-root flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col bg-ink-900 px-4 py-8 lg:flex">{Nav}</aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.4 }} className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-ink-900 px-4 py-8 lg:hidden">{Nav}</motion.aside>
          </>
        )}
      </AnimatePresence>
      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4 lg:hidden"><button onClick={() => setOpen(true)}><Menu /></button><span className="font-display text-lg">LuxeAdmin</span><span /></div>
        <div className="p-6 sm:p-10"><Outlet /></div>
      </main>
    </div>
  );
}
