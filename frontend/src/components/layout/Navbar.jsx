import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/products", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-wide text-cream">
          Luxe<span className="text-gold-400">Jewels</span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `gold-underline text-sm font-medium tracking-wide ${isActive ? "text-gold-300" : "text-cream/70"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button className="hidden text-cream/60 hover:text-gold-300 sm:block">
            <Search size={19} />
          </button>
          <button onClick={() => navigate("/wishlist")} className="text-cream/60 hover:text-gold-300">
            <Heart size={19} />
          </button>
          <button
            onClick={() => navigate(user ? "/account" : "/login")}
            className="text-cream/60 hover:text-gold-300"
          >
            <User size={19} />
          </button>
          <button onClick={() => navigate("/cart")} className="relative text-cream/60 hover:text-gold-300">
            <ShoppingBag size={19} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-ink-900"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button className="text-cream lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-72 border-l border-gold-400/10 bg-ink-900 p-6"
            >
              <button onClick={() => setOpen(false)} className="mb-8 text-cream">
                <X size={22} />
              </button>
              <div className="flex flex-col gap-6">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-lg text-cream hover:text-gold-300"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
