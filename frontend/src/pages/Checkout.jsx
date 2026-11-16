import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Check, Smartphone, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCartStore } from "../store/cartStore";
import { formatPrice, FREE_SHIPPING_AT, SHIPPING_FEE, COD_LIMIT } from "../utils/format";
import Button from "../components/ui/Button";
import SplitText from "../components/fx/SplitText";

const FIELDS = [
  ["line1", "Address line 1", "sm:col-span-2"],
  ["line2", "Address line 2 (optional)", "sm:col-span-2"],
  ["city", "City", ""],
  ["state", "State", ""],
  ["postalCode", "Pincode", ""],
  ["phone", "Phone number", ""],
];
const APPS = ["GPay", "PhonePe", "Paytm", "BHIM", "Visa", "Mastercard", "RuPay"];

export default function Checkout() {
  const { items } = useCartStore();
  const subtotal = useCartStore((s) => s.totalPrice());
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("online"); // "online" (UPI / cards via Stripe) | "cod"
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState([]);
  const [errors, setErrors] = useState({});
  const [a, setA] = useState({ line1: "", line2: "", city: "", state: "", postalCode: "", phone: "", country: "India" });
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const codAllowed = total <= COD_LIMIT;

  useEffect(() => { api.get("/auth/profile").then((r) => setSaved(r.data.addresses || [])).catch(() => {}); }, []);
  useEffect(() => { if (items.length === 0) navigate("/cart"); }, [items.length, navigate]);
  useEffect(() => { if (!codAllowed && method === "cod") setMethod("online"); }, [codAllowed, method]);

  const validate = () => {
    const e = {};
    if (!a.line1.trim()) e.line1 = "Required";
    if (!a.city.trim()) e.city = "Required";
    if (!a.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(a.postalCode)) e.postalCode = "6-digit pincode";
    if (!/^\d{10}$/.test(a.phone)) e.phone = "10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const place = async () => {
    setBusy(true);
    try {
      const { data: order } = await api.post("/orders", {
        items: items.map(({ product, name, image, price, quantity }) => ({ product, name, image, price, quantity })),
        shippingAddress: a, itemsPrice: subtotal, shippingPrice: shipping, taxPrice: 0, totalPrice: total,
        paymentMethod: method === "cod" ? "cod" : "stripe",
      });
      if (method === "cod") {
        navigate(`/order/${order._id}?placed=cod`);
        return;
      }
      const { data } = await api.post("/payments/create-checkout-session", { orderId: order._id });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setBusy(false);
    }
  };

  const Option = ({ id, icon: Icon, title, desc, disabled, children }) => (
    <button type="button" disabled={disabled} onClick={() => setMethod(id)} className={`relative w-full rounded-2xl border p-5 text-left transition ${method === id ? "border-gold-400 bg-gold-400/[0.06]" : "border-cream/12 hover:border-gold-400/50"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}>
      <div className="flex items-start gap-4">
        <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${method === id ? "border-gold-400" : "border-cream/30"}`}>{method === id && <motion.span layoutId="pay-dot" className="h-2.5 w-2.5 rounded-full bg-gold-400" />}</span>
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/30 text-gold-300"><Icon size={20} strokeWidth={1.4} /></span>
        <div className="flex-1"><p className="font-display text-xl">{title}</p><p className="mt-1 text-sm text-cream/50">{desc}</p>{children}</div>
      </div>
    </button>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-14 sm:px-10">
      <SplitText as="h1" immediate text="Secure *checkout*" className="font-display text-5xl sm:text-7xl" />

      <div className="my-12 flex items-center gap-4">
        {["Shipping", "Payment"].map((l, i) => (
          <div key={l} className="flex flex-1 items-center gap-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm transition ${step > i + 1 ? "border-gold-400 bg-gold-400 text-ink-950" : step === i + 1 ? "border-gold-400 text-gold-300" : "border-cream/20 text-cream/40"}`}>{step > i + 1 ? <Check size={16} /> : i + 1}</span>
            <span className={`text-sm ${step >= i + 1 ? "text-cream" : "text-cream/40"}`}>{l}</span>
            {i === 0 && <div className="h-px flex-1 bg-cream/10"><motion.div animate={{ scaleX: step > 1 ? 1 : 0 }} className="h-full origin-left bg-gold-400" /></div>}
          </div>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="gold-card rounded-3xl p-7">
              <h3 className="mb-6 font-display text-2xl">Shipping address</h3>
              {saved.length > 0 && <div className="mb-6 flex flex-wrap gap-2">{saved.map((s) => <button key={s._id} onClick={() => setA({ ...a, ...s })} className="rounded-full border border-cream/15 px-4 py-2 text-xs text-cream/70 transition hover:border-gold-400 hover:text-gold-300">Use: {s.label || s.line1}</button>)}</div>}
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map(([k, ph, span]) => (
                  <div key={k} className={span}>
                    <input placeholder={ph} value={a[k]} onChange={(e) => setA({ ...a, [k]: e.target.value })} className={`input-dark ${errors[k] ? "has-error" : ""}`} />
                    {errors[k] && <p className="mt-1 text-xs text-rose-400">{errors[k]}</p>}
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8 w-full" onClick={() => validate() && setStep(2)}>Continue to payment</Button>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="gold-card rounded-3xl p-7">
              <h3 className="mb-2 font-display text-2xl">Payment method</h3>
              <p className="mb-6 text-sm text-cream/45">Choose how you'd like to pay.</p>
              <div className="space-y-4">
                <Option id="online" icon={Smartphone} title="UPI, Cards & Netbanking" desc="Pay instantly and securely online — you'll be taken to Stripe's encrypted checkout.">
                  <div className="mt-3 flex flex-wrap gap-2">{APPS.map((x) => <span key={x} className="rounded-full border border-cream/15 px-3 py-1 text-[11px] text-cream/60">{x}</span>)}</div>
                </Option>
                <Option id="cod" icon={Banknote} title="Cash on Delivery" desc={codAllowed ? "Pay in cash (or UPI to the courier) when your order arrives at your door." : `Not available — COD is offered on orders up to ${formatPrice(COD_LIMIT)}. Please use online payment.`} disabled={!codAllowed} />
              </div>

              <div className="mt-6 rounded-2xl border border-cream/10 p-4 text-sm text-cream/65">
                <p className="mb-1 text-[11px] uppercase tracking-widest text-gold-400">Ship to</p>
                {a.line1}{a.line2 && `, ${a.line2}`}, {a.city}, {a.state} – {a.postalCode} · {a.phone}
                <button onClick={() => setStep(1)} className="ml-3 text-gold-300 underline-grow">Edit</button>
              </div>

              <p className="mt-6 flex items-center gap-2 text-xs text-cream/45"><Lock size={14} className="text-gold-400" /> {method === "cod" ? "Your order is confirmed instantly. Pay the courier when it arrives." : "You'll be redirected to Stripe to complete payment. Cards & UPI are never stored by us."}</p>
              <Button size="lg" className="mt-5 w-full" disabled={busy} onClick={place}>
                {busy ? (method === "cod" ? "Placing order…" : "Redirecting to Stripe…") : method === "cod" ? `Place order · Pay ${formatPrice(total)} on delivery` : `Pay ${formatPrice(total)} securely`}
              </Button>
              <button onClick={() => setStep(1)} className="mt-4 w-full text-center text-xs uppercase tracking-widest text-cream/40 hover:text-gold-300">← Back to shipping</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="gold-card h-fit rounded-3xl p-7 lg:sticky lg:top-28">
          <h3 className="font-display text-2xl">Your order</h3>
          <div className="mt-5 space-y-4">
            {items.map((i) => (
              <div key={i.product} className="flex gap-3">
                <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-ink-800">{i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}<span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-gold-400 text-[10px] font-bold text-ink-950">{i.quantity}</span></div>
                <div className="flex flex-1 justify-between text-sm"><span className="font-display">{i.name}</span><span className="text-cream/70">{formatPrice(i.price * i.quantity)}</span></div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-cream/10 pt-5 text-sm text-cream/60">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
            {step === 2 && <div className="flex justify-between"><span>Payment</span><span className="text-gold-300">{method === "cod" ? "Cash on Delivery" : "UPI / Card"}</span></div>}
          </div>
          <div className="mt-4 flex justify-between border-t border-cream/10 pt-4 font-display text-2xl"><span>{method === "cod" && step === 2 ? "Due on delivery" : "Total"}</span><span className="text-gold-200">{formatPrice(total)}</span></div>
        </div>
      </div>
    </div>
  );
}
