import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      setUser(res.data);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-semibold text-center">Create Account</h1>
        <p className="mt-2 text-center text-cream/50">Join LuxeJewels for exclusive access</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-cream/50">
          Already have an account? <Link to="/login" className="font-medium text-gold-400">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
