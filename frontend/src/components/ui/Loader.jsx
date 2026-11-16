import { motion } from "framer-motion";

export default function Loader({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? "min-h-[60vh]" : "py-12"}`}>
      <motion.div className="h-10 w-10 rounded-full border-2 border-gold-900 border-t-gold-400" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} />
    </div>
  );
}
