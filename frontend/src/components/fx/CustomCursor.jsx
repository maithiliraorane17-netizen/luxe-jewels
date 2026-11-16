import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";

const GLYPHS = ["M6 3h12l4 6-10 12L2 9Z", "M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z", "M12 2 3 9l9 13 9-13Z"];
let uid = 0;

export default function CustomCursor() {
  const { pathname } = useLocation();
  const disabled = pathname.startsWith("/admin");
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState({ type: "default", label: "" });
  const [pressed, setPressed] = useState(false);
  const [sparks, setSparks] = useState([]);
  const last = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 170, damping: 20, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 170, damping: 20, mass: 0.5 });

  const spawn = useCallback((cx, cy) => {
    const now = performance.now();
    if (now - last.current < 85) return;
    last.current = now;
    const id = uid++;
    const size = 9 + Math.random() * 9;
    const spark = { id, x: cx, y: cy, size, dx: (Math.random() - 0.5) * 44, rot: (Math.random() - 0.5) * 100, d: GLYPHS[id % 3] };
    setSparks((p) => [...p.slice(-18), spark]);
    setTimeout(() => setSparks((p) => p.filter((s) => s.id !== id)), 900);
  }, []);

  useEffect(() => {
    if (disabled || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.body.classList.remove("has-cursor");
      setEnabled(false);
      return;
    }
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); spawn(e.clientX, e.clientY); };
    const over = (e) => {
      const el = e.target.closest?.("[data-cursor],a,button,input,textarea,select,label,summary");
      if (!el) return setMode({ type: "default", label: "" });
      const c = el.getAttribute("data-cursor");
      if (c) setMode({ type: c, label: el.getAttribute("data-cursor-label") || "" });
      else if (el.matches("input,textarea,select")) setMode({ type: "text", label: "" });
      else setMode({ type: "link", label: "" });
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.body.classList.remove("has-cursor");
    };
  }, [disabled, spawn, x, y]);

  if (!enabled) return null;
  const size = mode.type === "view" || mode.type === "drag" ? 92 : mode.type === "link" ? 56 : mode.type === "text" ? 4 : 34;
  const height = mode.type === "text" ? 28 : size;

  return (
    <div className="pointer-events-none fixed inset-0 z-[400] overflow-hidden">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.svg key={s.id} initial={{ opacity: 0.95, scale: 0.3, x: s.x - s.size / 2, y: s.y - s.size / 2, rotate: 0 }} animate={{ opacity: 0, scale: 1.15, x: s.x - s.size / 2 + s.dx, y: s.y - s.size / 2 - 38, rotate: s.rot }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ position: "absolute", top: 0, left: 0 }} width={s.size} height={s.size} viewBox="0 0 24 24" fill="none" stroke="#dcbe7c" strokeWidth="1.3">
            <path d={s.d} />
          </motion.svg>
        ))}
      </AnimatePresence>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div className="-ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-gold-300 shadow-[0_0_10px_2px_rgba(205,163,85,.8)]" />
      </motion.div>
      <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
        <motion.div
          animate={{ width: size, height, marginLeft: -size / 2, marginTop: -height / 2, scale: pressed ? 0.85 : 1, backgroundColor: mode.type === "view" || mode.type === "drag" ? "rgba(205,163,85,.92)" : "rgba(205,163,85,0)", borderColor: mode.type === "text" ? "rgba(205,163,85,0)" : "rgba(205,163,85,.7)" }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="flex items-center justify-center rounded-full border"
        >
          <AnimatePresence>
            {(mode.type === "view" || mode.type === "drag") && (
              <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-950">{mode.label || "View"}</motion.span>
            )}
          </AnimatePresence>
          {mode.type === "text" && <div className="h-full w-[2px] rounded bg-gold-300" />}
        </motion.div>
      </motion.div>
    </div>
  );
}
