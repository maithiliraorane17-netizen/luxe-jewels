import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Check, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { formatPrice } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import Particles from "../components/fx/Particles";

const STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { data } = await api.get(`/orders/${id}`);
        if (sp.get("placed") === "cod") clearCart();
        if (sp.get("payment") === "success") {
          clearCart();
          if (!data.isPaid && data.paymentResult?.stripeSessionId) {
            await api.post("/payments/verify-session", { sessionId: data.paymentResult.stripeSessionId }).catch(() => {});
            data = (await api.get(`/orders/${id}`)).data;
          }
        }
        setOrder(data);
      } finally { setLoading(false); }
    })();
  }, [id]);

  const completePayment = async () => {
    setPaying(true);
    try { const { data } = await api.post("/payments/create-checkout-session", { orderId: id }); window.location.href = data.url; }
    catch (err) { toast.error(err.response?.data?.message || "Could not start payment"); setPaying(false); }
  };

  if (loading) return <Loader full />;
  if (!order) return <p className="py-40 text-center">Order not found.</p>;
  const isCod = order.paymentMethod === "cod";
  const idx = Math.max(0, STEPS.indexOf(order.status));
  const cancelled = order.status === "cancelled";
  const needsPayment = !isCod && !order.isPaid && !cancelled;
  const celebrate = order.isPaid || (isCod && !cancelled);

  return (
    <div className="relative mx-auto max-w-3xl px-6 pb-28 pt-16 sm:px-10">
      {celebrate && <div className="pointer-events-none absolute inset-x-0 top-0 h-96"><Particles count={30} /></div>}
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 14 }} className="relative text-center">
        {celebrate ? <CheckCircle2 size={72} className="mx-auto text-emerald-400" strokeWidth={1.2} /> : <Package size={72} className="mx-auto text-gold-400" strokeWidth={1.2} />}
        <h1 className="mt-6 font-display text-5xl">{order.isPaid ? "Thank you — it's yours" : isCod ? "Order confirmed" : "Order placed"}</h1>
        <p className="mt-2 text-cream/50">Order #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
      </motion.div>

      {isCod && !order.isPaid && !cancelled && (
        <div className="gold-card mt-10 flex items-center gap-4 rounded-2xl p-5"><span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/30 text-gold-300"><Banknote size={20} /></span><p className="text-sm text-cream/70">Please keep <b className="text-gold-200">{formatPrice(order.totalPrice)}</b> ready — pay in cash (or UPI to the courier) when your order is delivered.</p></div>
      )}
      {needsPayment && (
        <div className="gold-card mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"><p className="text-sm text-cream/70">{sp.get("payment") === "cancelled" ? "Payment wasn't completed." : "Payment is pending for this order."}</p><Button size="sm" disabled={paying} onClick={completePayment}>{paying ? "Redirecting…" : "Complete payment"}</Button></div>
      )}

      {!cancelled && (
        <div className="relative mt-14 flex justify-between">
          <div className="absolute left-[12%] right-[12%] top-5 h-px bg-cream/10"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: idx / (STEPS.length - 1) }} transition={{ duration: 1.2, delay: 0.4 }} className="h-full origin-left bg-gold-400" /></div>
          {STEPS.map((s, i) => (
            <div key={s} className="relative z-10 flex w-1/4 flex-col items-center gap-2">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${i <= idx ? "border-gold-400 bg-gold-400 text-ink-950" : "border-cream/20 bg-ink-950 text-cream/30"}`}>{i <= idx ? <Check size={16} /> : i + 1}</span>
              <span className={`text-xs capitalize ${i <= idx ? "text-gold-200" : "text-cream/35"}`}>{s}</span>
            </div>
          ))}
        </div>
      )}
      {cancelled && <p className="mt-10 text-center text-rose-400">This order was cancelled.</p>}

      <div className="gold-card mt-14 rounded-3xl p-7">
        {order.items.map((it) => <div key={it._id} className="flex items-center gap-4 border-b border-cream/10 py-4 last:border-0"><div className="h-16 w-14 overflow-hidden rounded-xl bg-ink-800">{it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}</div><div className="flex-1"><p className="font-display text-lg">{it.name}</p><p className="text-xs text-cream/40">Qty {it.quantity}</p></div><p>{formatPrice(it.price * it.quantity)}</p></div>)}
        <div className="mt-4 flex justify-between border-t border-cream/10 pt-5 font-display text-2xl"><span>{isCod && !order.isPaid ? "Due on delivery" : "Total"}</span><span className="text-gold-200">{formatPrice(order.totalPrice)}</span></div>
        <p className="mt-3 text-xs text-cream/40">Payment: {isCod ? (order.isPaid ? "Cash on delivery · collected" : "Cash on delivery · due on delivery") : order.isPaid ? "Paid online" : "Awaiting payment"}</p>
        {order.shippingAddress?.line1 && <p className="mt-1 text-xs text-cream/40">Ship to: {order.shippingAddress.line1}, {order.shippingAddress.city} – {order.shippingAddress.postalCode}</p>}
      </div>
      <div className="mt-10 text-center"><Link to="/products"><Button variant="outline">Continue shopping</Button></Link></div>
    </div>
  );
}
