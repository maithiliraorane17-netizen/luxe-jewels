import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children, wide = false, dark = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div data-lenis-prevent initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()} className={`relative max-h-[90vh] w-full overflow-y-auto rounded-3xl ${wide ? "max-w-4xl" : "max-w-lg"} ${dark ? "border border-gold-400/15 bg-ink-900 text-cream" : "bg-[#faf8f4] text-ink-900"}`}>
            <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-2 opacity-60 transition hover:opacity-100"><X size={18} /></button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
