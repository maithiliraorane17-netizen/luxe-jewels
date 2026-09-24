import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={center ? "text-center" : ""}
    >
      {eyebrow && (
        <p className="mb-3 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold-400">
          <span className="h-px w-8 bg-gold-400/50" /> {eyebrow} <span className="h-px w-8 bg-gold-400/50" />
        </p>
      )}
      <h2 className="font-display text-4xl font-semibold text-cream sm:text-5xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-xl text-cream/50">{subtitle}</p>}
    </motion.div>
  );
}
