import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import useDebounce from "../../hooks/useDebounce";
import { useUI } from "../../store/uiStore";
import { formatPrice } from "../../utils/format";

const SUGGESTIONS = ["Diamond", "Gold", "Pearl", "Emerald", "Platinum", "Sapphire"];

export default function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const close = useUI((s) => s.closeSearch);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dq = useDebounce(q.trim(), 350);

  useEffect(() => {
    if (open) { window.__lenis?.stop(); setTimeout(() => inputRef.current?.focus(), 400); }
    else { window.__lenis?.start(); setQ(""); setResults([]); }
    const esc = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, close]);

  useEffect(() => {
    if (!dq) return setResults([]);
    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(dq)}&limit=6`).then((r) => setResults(r.data.products)).catch(() => setResults([])).finally(() => setLoading(false));
  }, [dq]);

  const submit = (e) => { e.preventDefault(); if (!q.trim()) return; close(); navigate(`/products?search=${encodeURIComponent(q.trim())}`); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[170] overflow-y-auto bg-ink-950/98 backdrop-blur-xl" data-lenis-prevent>
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-8">
            <div className="flex justify-end"><button onClick={close} className="rounded-full p-3 text-cream/60 transition hover:rotate-90 hover:text-gold-300"><X size={24} /></button></div>
            <form onSubmit={submit} className="relative mt-6">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gold-400" size={28} />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search diamonds, gold, pearls…" className="w-full border-b border-cream/20 bg-transparent py-6 pl-12 font-display text-3xl text-cream outline-none transition placeholder:text-cream/20 focus:border-gold-400 sm:text-5xl" />
            </form>
            {!dq && (
              <div className="mt-10">
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cream/40">Popular searches</p>
                <div className="flex flex-wrap gap-3">{SUGGESTIONS.map((s) => <button key={s} onClick={() => setQ(s)} className="rounded-full border border-cream/15 px-5 py-2 text-sm text-cream/70 transition hover:border-gold-400 hover:text-gold-300">{s}</button>)}</div>
              </div>
            )}
            {dq && (
              <div className="mt-10">
                <p className="mb-5 text-xs uppercase tracking-[0.3em] text-cream/40">{loading ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`}</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((p, i) => (
                    <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/products/${p.slug}`} onClick={close} className="gold-card flex items-center gap-4 rounded-2xl p-3">
                        <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-ink-800">{p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}</div>
                        <div><p className="font-display leading-snug">{p.name}</p><p className="mt-1 text-sm text-gold-300">{formatPrice(p.discountPrice || p.price)}</p></div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                {!loading && results.length === 0 && <p className="text-cream/50">Nothing matched “{dq}”. Try a metal or gemstone name.</p>}
                {results.length > 0 && <button onClick={submit} className="mt-8 inline-flex items-center gap-2 text-sm text-gold-300 underline-grow">View all results <ArrowRight size={14} /></button>}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
