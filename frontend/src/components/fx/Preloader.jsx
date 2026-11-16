import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const word = "LuxeJewels".split("");

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += Math.random() * 8 + 3;
      if (n >= 100) { n = 100; clearInterval(id); setTimeout(onDone, 450); }
      setCount(Math.floor(n));
    }, 80);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div initial={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-ink-950">
      <div className="pointer-events-none absolute h-[520px] w-[520px] rounded-full bg-gold-500/10 blur-[110px]" />
      <div className="relative flex overflow-hidden">
        {word.map((l, i) => (
          <motion.span key={i} initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`font-display text-5xl font-semibold sm:text-7xl ${i >= 4 ? "gold-text italic" : "text-cream"}`}>{l}</motion.span>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 text-[11px] uppercase tracking-[0.5em] text-gold-400/80">Fine Jewelry · Since 1998</motion.p>
      <div className="absolute bottom-12 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden bg-cream/10">
        <motion.div className="h-full origin-left bg-gradient-to-r from-gold-600 to-gold-200" style={{ scaleX: count / 100 }} />
      </div>
      <span className="absolute bottom-8 right-8 font-display text-5xl text-cream/20 tabular-nums sm:text-7xl">{String(count).padStart(2, "0")}</span>
    </motion.div>
  );
}
