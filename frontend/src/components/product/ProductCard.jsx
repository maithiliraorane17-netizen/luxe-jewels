import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/format";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useUI } from "../../store/uiStore";

export default function ProductCard({ product, index = 0, className = "" }) {
  const addItem = useCartStore((s) => s.addItem);
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const openCart = useUI((s) => s.openCart);
  const openQuickView = useUI((s) => s.openQuickView);
  const wished = ids.includes(product._id);
  const [first, second] = product.images || [];
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };

  return (
    <motion.article initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -6% 0px" }} transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }} className={`group relative ${className}`}>
      <Link to={`/products/${product.slug}`} className="block" data-cursor="view" data-cursor-label="View">
        <div className="gold-card relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-800">
          {first ? (
            <>
              <img src={first} alt={product.name} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110 ${second ? "group-hover:opacity-0" : ""}`} />
              {second && <img src={second} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100" />}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900"><span className="font-display text-2xl text-gold-500/40">LuxeJewels</span></div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/10 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isNewArrival && <span className="rounded-full border border-gold-400/40 bg-ink-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-300 backdrop-blur">New</span>}
            {soldOut && <span className="rounded-full bg-rose-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Sold out</span>}
            {lowStock && <span className="rounded-full bg-ink-950/70 px-3 py-1 text-[10px] uppercase tracking-widest text-rose-300 backdrop-blur">Only {product.stock} left</span>}
          </div>

          <motion.button aria-label="Wishlist" onClick={stop(() => { toggle(product._id); toast.success(wished ? "Removed from wishlist" : "Saved to wishlist"); })} whileTap={{ scale: 0.8 }} className="glass-dark absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full">
            <AnimatePresence mode="wait">
              <motion.span key={wished ? "y" : "n"} initial={{ scale: 0.4 }} animate={{ scale: [0.4, 1.4, 1] }} transition={{ duration: 0.4 }}>
                <Heart size={16} className={wished ? "fill-gold-400 text-gold-400" : "text-cream"} />
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <div className="absolute inset-x-3 bottom-3 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <button disabled={soldOut} onClick={stop(() => { addItem(product, 1); toast.success("Added to bag"); openCart(); })} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-200 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-950 shadow-gold transition hover:brightness-110 disabled:opacity-50">
              <ShoppingBag size={14} /> {soldOut ? "Sold out" : "Add to bag"}
            </button>
            <button aria-label="Quick view" onClick={stop(() => openQuickView(product))} className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-cream transition hover:text-gold-300"><Eye size={16} /></button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-400/80">{[product.metalType, product.gemstone && product.gemstone !== "None" ? product.gemstone : null].filter(Boolean).join(" · ")}</p>
          <h3 className="mt-1 font-display text-lg leading-snug text-cream transition-colors group-hover:text-gold-200">{product.name}</h3>
          <p className="mt-1 text-sm">
            {product.discountPrice ? (<><span className="mr-2 text-cream/30 line-through">{formatPrice(product.price)}</span><span className="font-semibold text-gold-300">{formatPrice(product.discountPrice)}</span></>) : (<span className="font-semibold text-gold-300">{formatPrice(product.price)}</span>)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
