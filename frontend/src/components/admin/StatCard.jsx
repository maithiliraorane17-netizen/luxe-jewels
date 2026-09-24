import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return value;
}

export default function StatCard({ icon: Icon, label, value, prefix = "", suffix = "", accent = "gold", index = 0 }) {
  const count = useCountUp(value);
  const accents = {
    gold: "from-gold-400 to-gold-600",
    ink: "from-ink-700 to-ink-900",
    green: "from-emerald-400 to-emerald-600",
    rose: "from-rose-400 to-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accents[accent]} opacity-10`} />
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]} text-white shadow-gold`}>
        <Icon size={20} />
      </div>
      <p className="text-sm text-ink-700/60">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
        {prefix}{count.toLocaleString("en-IN")}{suffix}
      </p>
    </motion.div>
  );
}
