import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../api/axios";
import StatCard from "../../components/admin/StatCard";
import Loader from "../../components/ui/Loader";
import { formatPrice } from "../../utils/format";

const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Card = ({ children, className = "", delay = 0 }) => <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}>{children}</motion.div>;

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/dashboard/stats").then((r) => setS(r.data)); }, []);
  if (!s) return <Loader full />;
  const sales = s.salesByMonth.map((x) => ({ month: M[x._id.month - 1], revenue: x.revenue }));
  const top = s.topProducts.map((p) => ({ name: p.name, sold: p.totalSold }));
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
      <p className="mb-8 mt-1 text-black/50">Live snapshot of your store.</p>
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        <StatCard icon={IndianRupee} label="Revenue" value={s.totalRevenue} prefix="₹" index={0} />
        <StatCard icon={ShoppingCart} label="Orders" value={s.totalOrders} index={1} tone="from-[#3a3a40] to-[#0f0f11]" />
        <StatCard icon={Users} label="Customers" value={s.totalUsers} index={2} tone="from-emerald-400 to-emerald-600" />
        <StatCard icon={Package} label="Products" value={s.totalProducts} index={3} tone="from-rose-400 to-rose-600" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" delay={0.2}>
          <h3 className="mb-4 font-display text-xl">Revenue · last 6 months</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sales}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#cda355" stopOpacity={0.5} /><stop offset="95%" stopColor="#cda355" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" fontSize={12} stroke="#999" /><YAxis fontSize={12} stroke="#999" /><Tooltip formatter={(v) => formatPrice(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#b8863c" strokeWidth={2.5} fill="url(#g)" animationDuration={1400} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card delay={0.3}>
          <h3 className="mb-4 flex items-center gap-2 font-display text-xl"><AlertTriangle size={18} className="text-rose-500" /> Low stock</h3>
          <div className="space-y-3">{s.lowStock.length === 0 ? <p className="text-sm text-black/40">All products well stocked.</p> : s.lowStock.map((p) => <div key={p._id} className="flex items-center justify-between text-sm"><span>{p.name}</span><span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-600">{p.stock} left</span></div>)}</div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card delay={0.4}>
          <h3 className="mb-4 font-display text-xl">Top selling</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={top} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis type="number" fontSize={12} stroke="#999" /><YAxis type="category" dataKey="name" width={140} fontSize={11} stroke="#999" /><Tooltip /><Bar dataKey="sold" fill="#b8863c" radius={[0, 8, 8, 0]} animationDuration={1200} /></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card delay={0.5}>
          <h3 className="mb-4 font-display text-xl">Recent orders</h3>
          <div className="space-y-3">{s.recentOrders.map((o) => <div key={o._id} className="flex items-center justify-between border-b border-black/5 pb-3 text-sm last:border-0"><div><p className="font-medium">{o.user?.name || "Guest"}</p><p className="text-xs text-black/40">#{o._id.slice(-6).toUpperCase()} · {o.paymentMethod === "cod" ? "COD" : "Online"}</p></div><div className="text-right"><p className="font-semibold">{formatPrice(o.totalPrice)}</p><p className="text-xs capitalize text-black/40">{o.status}</p></div></div>)}</div>
        </Card>
      </div>
    </div>
  );
}
