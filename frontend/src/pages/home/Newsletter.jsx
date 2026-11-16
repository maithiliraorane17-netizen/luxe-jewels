import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import SplitText from "../../components/fx/SplitText";
import Reveal from "../../components/fx/Reveal";
import Particles from "../../components/fx/Particles";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="px-6 pb-28 sm:px-10">
      <div className="grain relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] border border-gold-400/20 bg-gradient-to-br from-gold-900/40 via-ink-900 to-ink-950 px-8 py-24 text-center">
        <Particles count={14} />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/25 blur-[90px]" />
        <p className="relative mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-300">Members only</p>
        <SplitText as="h2" text="Be first to see what's *next*" className="relative font-display text-4xl leading-tight sm:text-6xl" />
        <Reveal delay={0.2}><p className="relative mx-auto mt-5 max-w-md text-cream/55">Private previews, atelier stories and early access — delivered rarely, worth opening.</p></Reveal>
        <Reveal delay={0.3}>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("You're on the list ✦"); setEmail(""); }} className="relative mx-auto mt-10 flex max-w-md items-center rounded-full border border-cream/20 bg-ink-950/50 p-1.5 pl-6 backdrop-blur transition focus-within:border-gold-400">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 bg-transparent text-sm outline-none placeholder:text-cream/35" />
            <button className="flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-200 px-6 text-xs font-semibold uppercase tracking-wider text-ink-950 transition hover:brightness-110">Join <ArrowRight size={14} /></button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
