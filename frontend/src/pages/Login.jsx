import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";
import AuthShell from "./AuthShell";

export default function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const { data } = await api.post("/auth/login", f);
      setUser(data); toast.success(`Welcome back, ${data.name.split(" ")[0]}`);
      navigate(sp.get("redirect") || (data.role === "admin" ? "/admin" : "/"));
    } catch (err) { toast.error(err.response?.data?.message || "Login failed"); }
    finally { setBusy(false); }
  };
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your LuxeJewels account.">
      <form onSubmit={submit} className="space-y-4">
        <input required type="email" placeholder="Email address" className="input-dark" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required type="password" placeholder="Password" className="input-dark" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <Button size="lg" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      <p className="mt-8 text-center text-sm text-cream/50">New here? <Link to={`/register${sp.get("redirect") ? `?redirect=${sp.get("redirect")}` : ""}`} className="text-gold-300 underline-grow">Create an account</Link></p>
    </AuthShell>
  );
}
