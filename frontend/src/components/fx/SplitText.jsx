import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useUI } from "../../store/uiStore";

/** Word-by-word masked reveal. Prefix a word with * for the gold italic accent. */
export default function SplitText({ text, as: Tag = "h2", className = "", delay = 0, stagger = 0.07, immediate = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useUI((s) => s.ready);
  const show = (inView || immediate) && ready;
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {text.split(" ").map((raw, i) => {
        const accent = raw.startsWith("*");
        const w = accent ? raw.slice(1) : raw;
        return (
          <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.18em] align-bottom" aria-hidden>
            <motion.span className={`inline-block ${accent ? "shimmer-text italic" : ""}`} initial={{ y: "115%", rotate: 4 }} animate={show ? { y: 0, rotate: 0 } : { y: "115%", rotate: 4 }} transition={{ duration: 1, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}>{w}</motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
