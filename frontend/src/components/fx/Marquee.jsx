export default function Marquee({ items, className = "", itemClass = "", reverse = false, duration = 38 }) {
  const list = [...items, ...items];
  return (
    <div className={`group overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]" style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        {list.map((it, i) => <span key={i} className={`flex items-center whitespace-nowrap ${itemClass}`}>{it}</span>)}
      </div>
    </div>
  );
}
