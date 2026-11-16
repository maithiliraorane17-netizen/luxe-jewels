import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ShoppingBag, Heart, User, Menu, X, Search, ArrowUpRight } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useUI } from "../../store/uiStore";
import useCategories from "../../hooks/useCategories";
import { CATEGORY_IMAGES, u } from "../../utils/images";

const links = [
  { to: "/products", label: "Shop", mega: true },
  { to: "/collections", label: "Collections" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
const METALS = ["Gold", "Rose Gold", "White Gold", "Platinum", "Silver"];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const count = useCartStore((s) => s.totalItems());
  const wishCount = useWishlistStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);
  const openCart = useUI((s) => s.openCart);
  const openSearch = useUI((s) => s.openSearch);
  const cats = useCategories();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > prev && y > 220 && !mega);
  });
  useEffect(() => { setMobile(false); setMega(false); }, [pathname]);
  useEffect(() => { if (mobile) window.__lenis?.stop(); else window.__lenis?.start(); }, [mobile]);

  return (
    <>
      <motion.header animate={{ y: hidden ? "-110%" : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} onMouseLeave={() => setMega(false)} className={`sticky top-0 z-[100] transition-colors duration-500 ${scrolled || mega ? "glass-dark" : "border-b border-transparent bg-transparent"}`}>
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-10">
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide sm:text-[28px]">Luxe<span className="gold-text italic">Jewels</span></Link>
          <nav className="hidden items-center gap-10 lg:flex">
            {links.map((l) => (
              <div key={l.to} onMouseEnter={() => setMega(!!l.mega)}>
                <NavLink to={l.to} className={({ isActive }) => `underline-grow text-[13px] font-medium uppercase tracking-[0.18em] transition-colors ${isActive ? "text-gold-300" : "text-cream/70 hover:text-cream"}`}>{l.label}</NavLink>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <IconBtn label="Search" onClick={openSearch}><Search size={19} /></IconBtn>
            <IconBtn label="Wishlist" onClick={() => navigate("/wishlist")} badge={wishCount} className="hidden sm:flex"><Heart size={19} /></IconBtn>
            <IconBtn label="Account" onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/account") : "/login")} className="hidden sm:flex"><User size={19} /></IconBtn>
            <IconBtn label="Bag" onClick={openCart} badge={count}><ShoppingBag size={19} /></IconBtn>
            <IconBtn label="Menu" onClick={() => setMobile(true)} className="lg:hidden"><Menu size={22} /></IconBtn>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="hidden overflow-hidden border-t border-gold-400/10 lg:block">
              <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_1fr_1fr_1fr_.9fr] gap-6 px-10 py-8">
                {(cats.length ? cats : [{ _id: "", name: "Rings", slug: "rings" }, { _id: "", name: "Necklaces", slug: "necklaces" }, { _id: "", name: "Earrings", slug: "earrings" }, { _id: "", name: "Bracelets", slug: "bracelets" }]).slice(0, 4).map((c, i) => (
                  <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
                    <Link to={c._id ? `/products?category=${c._id}` : "/products"} className="group block" data-cursor="view" data-cursor-label="Shop">
                      <div className="relative h-44 overflow-hidden rounded-2xl">
                        <img src={u(CATEGORY_IMAGES[c.slug] || CATEGORY_IMAGES.rings, 500)} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                        <span className="absolute bottom-3 left-4 font-display text-xl">{c.name}</span>
                        <ArrowUpRight className="absolute bottom-3 right-4 text-gold-300 opacity-0 transition group-hover:opacity-100" size={18} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <div className="pl-4">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold-400">Shop by metal</p>
                  <ul className="space-y-2">
                    {METALS.map((m) => <li key={m}><Link to={`/products?metalType=${encodeURIComponent(m)}`} className="underline-grow text-sm text-cream/70 hover:text-gold-200">{m}</Link></li>)}
                    <li className="pt-2"><Link to="/products?newArrival=true" className="text-sm text-gold-300 underline-grow">New arrivals →</Link></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ clipPath: "circle(0% at 95% 4%)" }} animate={{ clipPath: "circle(150% at 95% 4%)" }} exit={{ clipPath: "circle(0% at 95% 4%)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[180] flex flex-col bg-ink-950 px-8 py-6">
            <div className="flex items-center justify-between"><span className="font-display text-2xl">Luxe<span className="gold-text italic">Jewels</span></span><button onClick={() => setMobile(false)} className="rounded-full p-2"><X size={26} /></button></div>
            <div className="mt-12 flex flex-1 flex-col gap-5">
              {[...links, { to: "/wishlist", label: "Wishlist" }, { to: user ? "/account" : "/login", label: user ? "Account" : "Sign in" }].map((l, i) => (
                <motion.div key={l.to + l.label} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                  <NavLink to={l.to} className="font-display text-4xl text-cream/90 transition hover:text-gold-300 hover:italic">{l.label}</NavLink>
                </motion.div>
              ))}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/30">Handcrafted since 1998</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({ children, onClick, badge, label, className = "" }) {
  return (
    <button aria-label={label} onClick={onClick} className={`relative flex h-11 w-11 items-center justify-center rounded-full text-cream/75 transition hover:bg-gold-400/10 hover:text-gold-300 ${className}`}>
      {children}
      <AnimatePresence>
        {badge > 0 && <motion.span key={badge} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-950">{badge}</motion.span>}
      </AnimatePresence>
    </button>
  );
}
