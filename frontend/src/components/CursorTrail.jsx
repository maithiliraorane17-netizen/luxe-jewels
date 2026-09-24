import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Small set of jewelry-flavored glyphs: diamond, sparkle, gem facet
const GLYPHS = [
  // diamond
  <path key="d" d="M6 3h12l4 6-10 12L2 9Z" />,
  // 4-point sparkle
  <path key="s" d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />,
  // small gem facet
  <path key="g" d="M12 2 3 9l9 13 9-13Z" />,
];

let idCounter = 0;

export default function CursorTrail() {
  const [particles, setParticles] = useState([]);
  const lastSpawn = useRef(0);
  const isTouch = useRef(false);

  const spawn = useCallback((x, y) => {
    const now = performance.now();
    if (now - lastSpawn.current < 70) return; // throttle
    lastSpawn.current = now;

    const id = idCounter++;
    const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const size = 10 + Math.random() * 10;
    const drift = (Math.random() - 0.5) * 40;
    const rotate = (Math.random() - 0.5) * 90;

    setParticles((prev) => [...prev.slice(-24), { id, x, y, glyph, size, drift, rotate }]);

    // auto-remove after animation completes
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (isTouch.current) return;
      spawn(e.clientX, e.clientY);
    };
    const onTouchStart = () => { isTouch.current = true; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouchStart, { once: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [spawn]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.svg
            key={p.id}
            initial={{ opacity: 0.9, scale: 0.3, x: p.x - p.size / 2, y: p.y - p.size / 2, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 1.1,
              y: p.y - p.size / 2 - 36,
              x: p.x - p.size / 2 + p.drift,
              rotate: p.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ position: "absolute", top: 0, left: 0 }}
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-gold-300, #dcbe7c)"
            strokeWidth="1.3"
          >
            {p.glyph}
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
}
