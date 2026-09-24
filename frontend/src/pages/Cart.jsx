import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-32 text-center">
        <ShoppingBag size={48} className="text-gold-300" />
        <h2 className="font-display text-2xl">Your bag is empty</h2>
        <p className="text-cream/50">Discover our collection and add your favorites.</p>
        <Link to="/products"><Button variant="gold">Shop Now</Button></Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal > 20000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="mb-10 font-display text-3xl font-semibold">Shopping Bag</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="gold-card flex items-center gap-4 rounded-2xl p-4"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-ink-900">
                  {item.image ? (
                    <img src={item.image} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gold-300">LuxeJewels</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg">{item.name}</h3>
                  <p className="text-sm text-cream/50">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-cream/15">
                      <button onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))} className="p-2"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.product)} className="text-cream/40 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gold-card h-fit rounded-2xl p-6"
        >
          <h3 className="font-display text-xl">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm text-cream/65">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-cream/10 pt-4 font-semibold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <Button
            variant="gold"
            className="mt-6 w-full"
            onClick={() => navigate(user ? "/checkout" : "/login?redirect=/checkout")}
          >
            Proceed to Checkout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
