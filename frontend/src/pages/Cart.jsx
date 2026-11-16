import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Truck, Banknote } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { formatPrice, FREE_SHIPPING_AT, SHIPPING_FEE } from "../utils/format";
import Button from "../components/ui/Button";
import SplitText from "../components/fx/SplitText";

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore((s) => s.totalPrice());
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const shipping = subtotal >= FREE_SHIPPING_AT || subtotal === 0 ? 0 : SHIPPING_FEE;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  if (items.length === 0)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-6 py-40 text-center">
        <ShoppingBag size={56} className="text-gold-400/40" strokeWidth={1} />
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="text-cream/50">Discover pieces made to be treasured.</p>
        <Link to="/products"><Button>Explore the collection</Button></Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[1300px] px-6 pb-28 pt-14 sm:px-10">
      <SplitText as="h1" immediate text="Shopping *bag*" className="mb-12 font-display text-5xl sm:text-7xl" />
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="gold-card mb-8 rounded-2xl p-5">
            <p className="mb-3 flex items-center gap-2 text-sm text-cream/70"><Truck size={16} className="text-gold-400" />{shipping === 0 ? "You've unlocked free insured shipping" : `Add ${formatPrice(FREE_SHIPPING_AT - subtotal)} more for free shipping`}</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream/10"><motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-200" /></div>
          </div>
          <AnimatePresence initial={false}>
            {items.map((i) => (
              <motion.div key={i.product} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80, height: 0, marginBottom: 0 }} className="mb-5 flex gap-5 rounded-3xl border border-cream/10 p-4">
                <Link to={`/products/${i.slug}`} className="h-32 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-ink-800">{i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}</Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4"><Link to={`/products/${i.slug}`} className="font-display text-xl hover:text-gold-200">{i.name}</Link><button onClick={() => removeItem(i.product)} className="text-cream/30 transition hover:text-rose-400"><Trash2 size={18} /></button></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-cream/15">
                      <button onClick={() => updateQuantity(i.product, i.quantity - 1)} className="p-3 text-cream/60 hover:text-gold-300"><Minus size={14} /></button>
                      <span className="w-8 text-center">{i.quantity}</span>
                      <button onClick={() => updateQuantity(i.product, i.quantity + 1)} className="p-3 text-cream/60 hover:text-gold-300"><Plus size={14} /></button>
                    </div>
                    <div className="text-right"><p className="text-lg font-semibold text-gold-300">{formatPrice(i.price * i.quantity)}</p><p className="text-xs text-cream/35">{formatPrice(i.price)} each</p></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="gold-card h-fit rounded-3xl p-7 lg:sticky lg:top-28">
          <h3 className="font-display text-2xl">Order summary</h3>
          <div className="mt-6 space-y-3 text-sm text-cream/65"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div></div>
          <div className="mt-5 flex justify-between border-t border-cream/10 pt-5 font-display text-2xl"><span>Total</span><span className="text-gold-200">{formatPrice(subtotal + shipping)}</span></div>
          <Button size="lg" className="mt-7 w-full" onClick={() => navigate(user ? "/checkout" : "/login?redirect=/checkout")}>Proceed to checkout</Button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-cream/40"><Banknote size={14} className="text-gold-400" /> UPI · Cards · Cash on Delivery</p>
          <Link to="/products" className="mt-5 block text-center text-xs uppercase tracking-widest text-cream/45 underline-grow hover:text-gold-300">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
