import { motion } from "framer-motion";

const variants = {
  primary: "bg-cream text-ink-900 hover:bg-gold-300",
  gold: "bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-[length:200%_auto] text-ink-900 shadow-gold hover:bg-[position:100%_0]",
  outline: "border border-cream/20 text-cream hover:border-gold-400 hover:text-gold-300",
  ghost: "text-cream/70 hover:text-gold-300",
};

export default function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22, backgroundPosition: { duration: 0.6 } }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-[background-position,color,border-color] duration-500 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
