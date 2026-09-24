import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    line1: "", line2: "", city: "", state: "", postalCode: "", country: "India", phone: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal > 20000 ? 0 : 500;
  const total = subtotal + shipping;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderRes = await api.post("/orders", {
        items,
        shippingAddress: address,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: 0,
        totalPrice: total,
      });
      const order = orderRes.data;

      const sessionRes = await api.post("/payments/create-checkout-session", { orderId: order._id });
      clearCart();
      window.location.href = sessionRes.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePay}
          className="gold-card space-y-4 rounded-2xl p-6"
        >
          <h3 className="font-display text-xl">Shipping Address</h3>
          {["line1", "line2", "city", "state", "postalCode", "phone"].map((field) => (
            <input
              key={field}
              required={field !== "line2"}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={address[field]}
              onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
              className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors"
            />
          ))}
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? "Redirecting to Stripe…" : `Pay ${formatPrice(total)}`}
          </Button>
          <p className="text-center text-xs text-cream/40">
            You'll be redirected to Stripe's secure checkout to complete your payment.
          </p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gold-card h-fit space-y-3 rounded-2xl p-6"
        >
          <h3 className="font-display text-xl">Order Summary</h3>
          {items.map((i) => (
            <div key={i.product} className="flex justify-between text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-cream/10 pt-3 flex justify-between font-semibold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
