import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Package, LogOut, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import SplitText from "../components/fx/SplitText";

const TABS = ["Orders", "Profile", "Addresses"];
const BLANK = { label: "Home", line1: "", line2: "", city: "", state: "", postalCode: "", phone: "" };

export default function Account() {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [addr, setAddr] = useState(BLANK);

  const loadProfile = () => api.get("/auth/profile").then((r) => { setProfile(r.data); setForm({ name: r.data.name, phone: r.data.phone || "", password: "" }); });
  useEffect(() => { Promise.all([api.get("/orders/my-orders").then((r) => setOrders(r.data)), loadProfile()]).finally(() => setLoading(false)); }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const body = { name: form.name, phone: form.phone }; if (form.password) body.password = form.password;
      const { data } = await api.put("/auth/profile", body);
      setUser({ ...user, ...data }); toast.success("Profile updated"); setForm((f) => ({ ...f, password: "" }));
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
  };
  const addAddress = async (e) => { e.preventDefault(); const { data } = await api.post("/auth/addresses", addr); setProfile((p) => ({ ...p, addresses: data })); setAddr(BLANK); toast.success("Address saved"); };
  const delAddress = async (id) => { const { data } = await api.delete(`/auth/addresses/${id}`); setProfile((p) => ({ ...p, addresses: data })); };

  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-14 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-3 text-[11px] uppercase tracking-[0.4em] text-gold-400">My account</p><SplitText as="h1" immediate text={`Hello, *${user.name.split(" ")[0]}*`} className="font-display text-5xl sm:text-7xl" /></div>
        <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}><LogOut size={14} /> Sign out</Button>
      </div>
      <div className="mt-12 flex gap-8 border-b border-cream/10">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`relative pb-4 text-sm uppercase tracking-widest transition ${tab === t ? "text-gold-200" : "text-cream/40 hover:text-cream"}`}>{t}{tab === t && <motion.span layoutId="acct-tab" className="absolute inset-x-0 -bottom-px h-px bg-gold-400" />}</button>)}
      </div>
      {loading ? <Loader /> : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10">
            {tab === "Orders" && (orders.length === 0 ? <p className="text-cream/50">No orders yet. <Link to="/products" className="text-gold-300">Start exploring</Link></p> : (
              <div className="space-y-4">{orders.map((o) => (
                <Link key={o._id} to={`/order/${o._id}`} className="gold-card flex items-center justify-between rounded-2xl p-5">
                  <div className="flex items-center gap-4"><Package className="text-gold-400" /><div><p className="font-display text-lg">Order #{o._id.slice(-8).toUpperCase()}</p><p className="text-xs text-cream/40">{new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.items.length} item(s) · {o.paymentMethod === "cod" ? "Cash on Delivery" : o.isPaid ? "Paid online" : "Payment pending"}</p></div></div>
                  <div className="text-right"><p className="font-semibold text-gold-300">{formatPrice(o.totalPrice)}</p><p className="text-xs capitalize text-cream/45">{o.status}</p></div>
                </Link>))}</div>
            ))}
            {tab === "Profile" && (
              <form onSubmit={saveProfile} className="max-w-md space-y-4">
                <input className="input-dark" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                <input className="input-dark opacity-60" value={profile?.email || ""} disabled />
                <input className="input-dark" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                <input type="password" className="input-dark" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="New password (leave blank to keep)" />
                <Button>Save changes</Button>
              </form>
            )}
            {tab === "Addresses" && (
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-4">
                  {(profile?.addresses || []).length === 0 && <p className="text-cream/50">No saved addresses.</p>}
                  {(profile?.addresses || []).map((a) => (
                    <div key={a._id} className="gold-card flex justify-between rounded-2xl p-5 text-sm text-cream/65">
                      <div><p className="mb-1 font-display text-lg text-cream">{a.label}</p>{a.line1}{a.line2 && `, ${a.line2}`}<br />{a.city}, {a.state} – {a.postalCode}<br />{a.phone}</div>
                      <button onClick={() => delAddress(a._id)} className="h-fit text-cream/30 hover:text-rose-400"><Trash2 size={16} /></button>
                    </div>))}
                </div>
                <form onSubmit={addAddress} className="space-y-3">
                  <p className="font-display text-xl">Add address</p>
                  {[["label", "Label (Home, Work…)"], ["line1", "Address line 1"], ["line2", "Address line 2"], ["city", "City"], ["state", "State"], ["postalCode", "Pincode"], ["phone", "Phone"]].map(([k, ph]) => <input key={k} required={["line1", "city", "state", "postalCode"].includes(k)} className="input-dark" placeholder={ph} value={addr[k]} onChange={(e) => setAddr({ ...addr, [k]: e.target.value })} />)}
                  <Button>Save address</Button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
