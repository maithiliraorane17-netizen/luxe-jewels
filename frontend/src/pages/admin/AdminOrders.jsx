import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import Loader from "../../components/ui/Loader";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/orders/all").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Order updated");
      load();
    } catch {
      toast.error("Failed to update order");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Orders</h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-50 text-xs uppercase tracking-wider text-ink-700/60">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Paid</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-t border-ink-900/5">
                <td className="px-5 py-3 font-medium">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="px-5 py-3">{o.user?.name}</td>
                <td className="px-5 py-3">{formatPrice(o.totalPrice)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${o.isPaid ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-600"}`}>
                    {o.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-medium capitalize ${statusColors[o.status]}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
