import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useUI } from "../../store/uiStore";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { formatPrice, FREE_SHIPPING_AT } from "../../utils/format";
import Button from "../ui/Button";

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore((s) => s.totalPrice());
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  useEffect(() => {
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
    const esc = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }} className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col border-l border-gold-400/15 bg-ink-900">
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 className="font-display text-2xl">Your Bag <span className="text-base text-cream/40">({items.length})</span></h2>
              <button onClick={close} className="rounded-full p-2 text-cream/60 transition hover:rotate-90 hover:text-gold-300"><X size={20} /></button>
            </div>
            {items.length > 0 && (
              <div className="border-b border-cream/10 px-6 py-4">
                <p className="mb-2 flex items-center gap-2 text-xs text-cream/60"><Truck size={14} className="text-gold-400" />{subtotal >= FREE_SHIPPING_AT ? "You've unlocked free insured shipping!" : `Add ${formatPrice(FREE_SHIPPING_AT - subtotal)} more for free shipping`}</p>
                <div className="h-1.5 overflow-hidden rounded-full bg-cream/10"><motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-200" /></div>
              </div>
            )}
            <div data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={44} className="text-gold-400/40" />
                  <p className="font-display text-xl">Your bag is empty</p>
                  <p className="text-sm text-cream/50">Discover pieces made to be treasured.</p>
                  <Button variant="gold" onClick={() => { close(); navigate("/products"); }}>Explore the collection</Button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <motion.div key={i.product} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4">
                      <Link to={`/products/${i.slug}`} onClick={close} className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-ink-800">{i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}</Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-3"><p className="font-display leading-snug">{i.name}</p><button onClick={() => removeItem(i.product)} className="text-cream/30 transition hover:text-rose-400"><Trash2 size={15} /></button></div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-cream/15">
                            <button onClick={() => updateQuantity(i.product, i.quantity - 1)} className="p-2 text-cream/60 hover:text-gold-300"><Minus size={12} /></button>
                            <span className="w-6 text-center text-sm">{i.quantity}</span>
                            <button onClick={() => updateQuantity(i.product, i.quantity + 1)} className="p-2 text-cream/60 hover:text-gold-300"><Plus size={12} /></button>
                          </div>
                          <span className="font-semibold text-gold-300">{formatPrice(i.price * i.quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            {items.length > 0 && (
              <div className="space-y-3 border-t border-cream/10 px-6 py-5">
                <div className="flex justify-between text-sm"><span className="text-cream/60">Subtotal</span><span className="font-display text-xl text-gold-200">{formatPrice(subtotal)}</span></div>
                <p className="text-xs text-cream/40">UPI · Cards · Cash on Delivery available at checkout.</p>
                <Button variant="gold" className="w-full" onClick={() => { close(); navigate(user ? "/checkout" : "/login?redirect=/checkout"); }}>Checkout securely</Button>
                <Link to="/cart" onClick={close} className="block text-center text-xs uppercase tracking-widest text-cream/50 underline-grow hover:text-gold-300">View full bag</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
