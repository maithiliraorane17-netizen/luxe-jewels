import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import Loader from "../../components/ui/Loader";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const COLORS = { pending: "bg-yellow-100 text-yellow-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-emerald-100 text-emerald-700", cancelled: "bg-rose-100 text-rose-700" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pay, setPay] = useState("all");
  const load = () => api.get("/orders/all").then((r) => setOrders(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const update = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); toast.success("Status updated"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Could not update"); }
  };
  if (loading) return <Loader full />;
  const shown = orders.filter((o) => (filter === "all" || o.status === filter) && (pay === "all" || (pay === "cod" ? o.paymentMethod === "cod" : o.paymentMethod !== "cod")));

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl font-semibold">Orders</h1>
      <div className="mb-3 flex flex-wrap gap-2">{["all", ...STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-xs capitalize ${filter === s ? "bg-ink-900 text-white" : "bg-white text-black/60 ring-1 ring-black/10"}`}>{s}</button>)}</div>
      <div className="mb-5 flex flex-wrap gap-2">{[["all", "All payments"], ["online", "Online (UPI/Card)"], ["cod", "Cash on Delivery"]].map(([k, l]) => <button key={k} onClick={() => setPay(k)} className={`rounded-full px-4 py-1.5 text-xs ${pay === k ? "bg-gold-500 text-white" : "bg-white text-black/60 ring-1 ring-black/10"}`}>{l}</button>)}</div>
      <div className="space-y-3">
        {shown.map((o) => (
          <div key={o._id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-center gap-4 px-5 py-4">
              <button onClick={() => setOpen(open === o._id ? null : o._id)} className="flex flex-1 items-center gap-3 text-left"><ChevronDown size={16} className={`transition ${open === o._id ? "rotate-180" : ""}`} /><span className="font-medium">#{o._id.slice(-8).toUpperCase()}</span><span className="text-sm text-black/50">{o.user?.name}</span></button>
              <span className="font-semibold">{formatPrice(o.totalPrice)}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${o.paymentMethod === "cod" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>{o.paymentMethod === "cod" ? "COD" : "Online"}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${o.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>{o.isPaid ? "Paid" : o.paymentMethod === "cod" ? "Collect on delivery" : "Unpaid"}</span>
              <select value={o.status} onChange={(e) => update(o._id, e.target.value)} className={`rounded-full px-3 py-1 text-xs font-medium capitalize outline-none ${COLORS[o.status]}`}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
            {open === o._id && (
              <div className="border-t border-black/5 bg-[#faf8f4] px-5 py-4 text-sm">
                {o.items.map((i) => <div key={i._id} className="flex justify-between py-1"><span>{i.name} × {i.quantity}</span><span>{formatPrice(i.price * i.quantity)}</span></div>)}
                <p className="mt-3 text-black/50">Ship to: {o.shippingAddress?.line1}, {o.shippingAddress?.city}, {o.shippingAddress?.state} – {o.shippingAddress?.postalCode} · {o.shippingAddress?.phone}</p>
                <p className="text-black/40">Placed {new Date(o.createdAt).toLocaleString("en-IN")}{o.paymentMethod === "cod" && " · Marking an order Delivered records the cash as collected."}</p>
              </div>
            )}
          </div>))}
      </div>
    </div>
  );
}
