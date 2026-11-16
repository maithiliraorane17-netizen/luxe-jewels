import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function Accordion({ items, defaultOpen = 0, className = "" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`divide-y divide-cream/10 border-y border-cream/10 ${className}`}>
      {items.map((it, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between py-5 text-left">
            <span className="font-display text-lg text-cream">{it.title}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-gold-400"><Plus size={18} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                <div className="pb-5 text-sm leading-relaxed text-cream/55">{it.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
