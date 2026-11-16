import { motion } from "framer-motion";

const variants = {
  gold: "bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 bg-[length:200%_auto] text-ink-950 shadow-gold hover:bg-[position:100%_0]",
  light: "bg-cream text-ink-950 hover:bg-gold-200",
  outline: "border border-cream/25 text-cream hover:border-gold-400 hover:text-gold-300",
  ghost: "text-cream/70 hover:text-gold-300",
  dark: "bg-ink-800 text-cream border border-cream/10 hover:border-gold-400/60",
};
const sizes = { sm: "px-5 py-2.5 text-xs", md: "px-7 py-3.5 text-sm", lg: "px-9 py-4 text-sm" };

export default function Button({ children, variant = "gold", size = "md", className = "", ...props }) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 420, damping: 22 }} className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-[background-position,color,border-color] duration-500 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/30 transition-all duration-700 group-hover:left-[130%]" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
