import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";
import AuthShell from "./AuthShell";

export default function Register() {
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    try { const { data } = await api.post("/auth/register", f); setUser(data); toast.success("Welcome to LuxeJewels ✦"); navigate(sp.get("redirect") || "/"); }
    catch (err) { toast.error(err.response?.data?.message || "Registration failed"); }
    finally { setBusy(false); }
  };
  return (
    <AuthShell title="Create account" subtitle="Join for order tracking, wishlists and private previews.">
      <form onSubmit={submit} className="space-y-4">
        <input required placeholder="Full name" className="input-dark" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input required type="email" placeholder="Email address" className="input-dark" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input placeholder="Phone (optional)" className="input-dark" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        <input required type="password" placeholder="Password (min 6 characters)" className="input-dark" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <Button size="lg" className="w-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
      </form>
      <p className="mt-8 text-center text-sm text-cream/50">Already a member? <Link to="/login" className="text-gold-300 underline-grow">Sign in</Link></p>
    </AuthShell>
  );
}
