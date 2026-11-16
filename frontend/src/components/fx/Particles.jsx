import { useMemo } from "react";

export default function Particles({ count = 22 }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({ id: i, left: Math.random() * 100, size: 2 + Math.random() * 3.5, dur: 9 + Math.random() * 10, delay: -Math.random() * 18, dx: (Math.random() - 0.5) * 80 })), [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span key={p.id} className="absolute -bottom-4 rounded-full bg-gold-300 shadow-[0_0_8px_2px_rgba(205,163,85,.6)] animate-rise" style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, "--dx": `${p.dx}px` }} />
      ))}
    </div>
  );
}
