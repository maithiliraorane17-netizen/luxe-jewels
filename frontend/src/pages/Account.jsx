import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { formatPrice } from "../utils/format";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";

export default function Account() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");
    api.get("/orders/my-orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Hello, {user.name}</h1>
          <p className="text-cream/50">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); navigate("/"); }}>
          <LogOut size={16} /> Logout
        </Button>
      </motion.div>

      <h2 className="mb-4 font-display text-xl">Order History</h2>
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <p className="text-cream/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/order/${o._id}`)}
              className="gold-card flex cursor-pointer items-center justify-between rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gold-400" />
                <div>
                  <p className="font-medium">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-cream/50">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(o.totalPrice)}</p>
                <p className="text-xs capitalize text-cream/50">{o.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
