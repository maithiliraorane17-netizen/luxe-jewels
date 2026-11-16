import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export default function Dropdown({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2.5 text-sm text-cream/80 transition hover:border-gold-400/60">
        {label && <span className="text-cream/40">{label}</span>} {current?.label}
        <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.18 }} className="glass-dark absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl p-1.5 shadow-2xl">
            {options.map((o) => (
              <li key={o.value}>
                <button onClick={() => { onChange(o.value); setOpen(false); }} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-cream/80 transition hover:bg-gold-400/10 hover:text-gold-200">
                  {o.label}{o.value === value && <Check size={14} className="text-gold-400" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
