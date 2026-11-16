import { Sparkles } from "lucide-react";
import Marquee from "../fx/Marquee";

const msgs = ["Free insured shipping on orders above ₹20,000", "UPI · Cards · Cash on Delivery", "Lifetime craftsmanship warranty", "Certified authentic gemstones", "30-day easy returns", "Complimentary gift packaging"];

export default function AnnouncementBar() {
  return (
    <div className="relative z-[101] border-b border-gold-400/10 bg-ink-900 py-2 text-[11px] uppercase tracking-[0.25em] text-gold-200/80">
      <Marquee items={msgs.map((m) => <span key={m} className="flex items-center gap-8 pr-8">{m} <Sparkles size={11} className="text-gold-500" /></span>)} duration={40} />
    </div>
  );
}
