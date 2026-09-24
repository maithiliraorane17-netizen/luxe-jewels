import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../api/axios";
import StatCard from "../../components/admin/StatCard";
import Loader from "../../components/ui/Loader";
import { formatPrice } from "../../utils/format";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Loader full />;

  const salesData = stats.salesByMonth.map((s) => ({
    month: monthNames[s._id.month - 1],
    revenue: s.revenue,
  }));

  const topProductsData = stats.topProducts.map((p) => ({ name: p.name, sold: p.totalSold }));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Dashboard Overview</h1>
        <p className="text-ink-700/60">Real-time snapshot of your store's performance</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Revenue" value={stats.totalRevenue} prefix="₹" index={0} accent="gold" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} index={1} accent="ink" />
        <StatCard icon={Users} label="Customers" value={stats.totalUsers} index={2} accent="green" />
        <StatCard icon={Package} label="Products" value={stats.totalProducts} index={3} accent="rose" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2"
        >
          <h3 className="mb-4 font-display text-lg">Revenue — Last 6 Months</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cda355" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#cda355" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip formatter={(v) => formatPrice(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#b8863c" strokeWidth={2} fill="url(#goldGradient)" animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white p-6 shadow-soft"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg">
            <AlertTriangle size={18} className="text-rose-500" /> Low Stock
          </h3>
          <div className="space-y-3">
            {stats.lowStock.length === 0 ? (
              <p className="text-sm text-ink-700/50">All products well stocked.</p>
            ) : (
              stats.lowStock.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">{p.stock} left</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white p-6 shadow-soft"
        >
          <h3 className="mb-4 font-display text-lg">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProductsData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={12} stroke="#999" />
              <YAxis type="category" dataKey="name" width={120} fontSize={11} stroke="#999" />
              <Tooltip />
              <Bar dataKey="sold" fill="#b8863c" radius={[0, 6, 6, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white p-6 shadow-soft"
        >
          <h3 className="mb-4 font-display text-lg">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((o) => (
              <div key={o._id} className="flex items-center justify-between border-b border-ink-900/5 pb-3 text-sm last:border-0">
                <div>
                  <p className="font-medium">{o.user?.name || "Guest"}</p>
                  <p className="text-xs text-ink-700/50">#{o._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(o.totalPrice)}</p>
                  <p className="text-xs capitalize text-ink-700/50">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
