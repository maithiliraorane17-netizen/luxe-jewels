import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setUser(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate(searchParams.get("redirect") || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-semibold text-center">Welcome Back</h1>
        <p className="mt-2 text-center text-cream/50">Sign in to your LuxeJewels account</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            required type="email" placeholder="Email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors"
          />
          <input
            required type="password" placeholder="Password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors"
          />
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-cream/50">
          New here? <Link to="/register" className="font-medium text-gold-400">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}
