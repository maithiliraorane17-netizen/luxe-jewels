import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Stars from "../../components/ui/Stars";

const T = [
  { q: "The solitaire ring arrived in a box that felt like an event. The stone catches light in a way photos simply can't capture. My fiancée cried.", n: "Aarav M.", c: "Mumbai" },
  { q: "I've bought from big-name jewellers for years — the finish and weight here are on another level. Truly heirloom quality.", n: "Priya S.", c: "Bengaluru" },
  { q: "Ordered the pearl pendant for my mother. The packaging, the certificate, the delivery — flawless, start to finish.", n: "Rohan K.", c: "Delhi" },
  { q: "They resized my band in two days and it came back looking brand new. Service that matches the jewelry.", n: "Ananya R.", c: "Pune" },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % T.length), 7000); return () => clearInterval(t); }, [i]);
  const go = (d) => setI((v) => (v + d + T.length) % T.length);
  const cur = T[i];
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:px-10">
      <Quote className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 text-gold-400/10" size={220} strokeWidth={0.6} />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-10 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400">Words from our clients</p>
        <div className="min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <Stars value={5} size={18} className="mb-8" />
              <p className="font-display text-2xl italic leading-snug sm:text-4xl">“{cur.q}”</p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 font-display text-lg text-ink-950">{cur.n[0]}</span>
                <div className="text-left"><p className="font-medium">{cur.n}</p><p className="text-xs uppercase tracking-widest text-cream/40">{cur.c}</p></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous" className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition hover:border-gold-400 hover:text-gold-300"><ChevronLeft size={18} /></button>
          <div className="flex gap-2">{T.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className={`h-1 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-gold-300" : "w-4 bg-cream/20"}`} />)}</div>
          <button onClick={() => go(1)} aria-label="Next" className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition hover:border-gold-400 hover:text-gold-300"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
