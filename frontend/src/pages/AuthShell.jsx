import { motion } from "framer-motion";
import { IMG, u } from "../utils/images";
import Particles from "../components/fx/Particles";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-110px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <motion.img initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2 }} src={u(IMG.womanNecklace, 1200)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/60" />
        <Particles count={16} />
        <div className="absolute inset-x-12 bottom-14"><p className="font-display text-5xl italic leading-tight">“Jewelry is the<br />most intimate art.”</p><p className="mt-4 text-xs uppercase tracking-[0.4em] text-gold-300">LuxeJewels · since 1998</p></div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md">
          <h1 className="font-display text-5xl">{title}</h1><p className="mt-3 text-cream/50">{subtitle}</p><div className="mt-10">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
