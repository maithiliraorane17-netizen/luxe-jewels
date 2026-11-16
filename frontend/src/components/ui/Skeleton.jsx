export function ProductSkeleton() {
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-800">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.6s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="mt-4 space-y-2"><div className="h-3 w-1/3 rounded bg-ink-800" /><div className="h-4 w-3/4 rounded bg-ink-800" /><div className="h-3 w-1/4 rounded bg-ink-800" /></div>
      <style>{`@keyframes shimmer-slide{100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}
export function GridSkeleton({ count = 8, className = "grid grid-cols-2 gap-5 lg:grid-cols-4" }) {
  return <div className={className}>{Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}</div>;
}
