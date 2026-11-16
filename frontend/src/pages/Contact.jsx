import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import SplitText from "../components/fx/SplitText";
import Reveal from "../components/fx/Reveal";
import Button from "../components/ui/Button";
import Accordion from "../components/ui/Accordion";

const FAQ = [
  { title: "How can I pay?", content: "UPI (GPay, PhonePe, Paytm), debit/credit cards and netbanking via Stripe — or Cash on Delivery for orders up to ₹50,000." },
  { title: "How long does delivery take?", content: "Orders ship within 2 business days and arrive in 3–5 business days, fully insured." },
  { title: "Can I return or exchange a piece?", content: "Yes — unworn pieces can be returned or exchanged within 30 days of delivery." },
  { title: "Are your stones certified?", content: "Every diamond and gemstone ships with an independent grading certificate." },
  { title: "Do you offer resizing?", content: "Complimentary resizing within 60 days on rings, subject to design." },
];

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  return (
    <div className="mx-auto max-w-[1300px] px-6 pb-28 pt-14 sm:px-10">
      <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-gold-400">Contact</p>
      <SplitText as="h1" immediate text="Let's *talk*" className="font-display text-6xl sm:text-9xl" />
      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <Reveal>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll reply within a day."); setF({ name: "", email: "", message: "" }); }} className="space-y-4">
            <input required className="input-dark" placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input required type="email" className="input-dark" placeholder="Email address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <textarea required rows={6} className="input-dark" placeholder="How can we help?" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
            <Button size="lg">Send message</Button>
          </form>
        </Reveal>
        <Reveal delay={0.15} className="space-y-6">
          {[[Mail, "Email", "hello@luxejewels.com"], [Phone, "Phone", "+91 8830050166"], [MapPin, "Atelier", "Borivali, Mumbai, India"]].map(([Icon, l, v]) => (
            <div key={l} className="gold-card flex items-center gap-5 rounded-2xl p-5"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 text-gold-300"><Icon size={20} strokeWidth={1.4} /></span><div><p className="text-[11px] uppercase tracking-widest text-cream/40">{l}</p><p className="font-display text-xl">{v}</p></div></div>
          ))}
          <div className="pt-8"><p className="mb-4 font-display text-2xl">Frequently asked</p><Accordion items={FAQ} defaultOpen={-1} /></div>
        </Reveal>
      </div>
    </div>
  );
}
