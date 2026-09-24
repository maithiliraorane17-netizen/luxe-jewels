import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { formatPrice } from "../utils/format";
import Loader from "../components/ui/Loader";

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (searchParams.get("payment") === "success") {
          const sessionId = order?.paymentResult?.stripeSessionId;
        }
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
        if (searchParams.get("payment") === "success" && !res.data.isPaid && res.data.paymentResult?.stripeSessionId) {
          await api.post("/payments/verify-session", { sessionId: res.data.paymentResult.stripeSessionId });
          const refreshed = await api.get(`/orders/${id}`);
          setOrder(refreshed.data);
        }
      } catch (e) {
        toast.error("Could not load order");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader full />;
  if (!order) return <p className="py-24 text-center">Order not found.</p>;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        {order.isPaid ? (
          <CheckCircle2 size={56} className="mx-auto text-green-500" />
        ) : (
          <Package size={56} className="mx-auto text-gold-500" />
        )}
        <h1 className="mt-4 font-display text-2xl font-semibold">
          {order.isPaid ? "Payment Successful!" : "Order Placed"}
        </h1>
        <p className="mt-2 text-cream/50">Order #{order._id.slice(-8).toUpperCase()}</p>
      </motion.div>

      <div className="mt-10 space-y-4 rounded-2xl border border-cream/10 p-6">
        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-cream/10 pt-4 flex justify-between font-semibold">
          <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
        </div>
        <div className="pt-2 text-sm text-cream/50">
          Status: <span className="font-medium capitalize text-cream">{order.status}</span>
        </div>
      </div>
    </div>
  );
}
