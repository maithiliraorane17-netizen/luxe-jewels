import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import api from "../../api/axios";
import SectionHeading from "../../components/ui/SectionHeading";
import ProductCard from "../../components/product/ProductCard";
import { GridSkeleton } from "../../components/ui/Skeleton";

const METALS = ["Gold", "Rose Gold", "White Gold", "Platinum", "Silver"];
const SWATCH = { Gold: "from-[#f6e3a4] to-[#b8863c]", "Rose Gold": "from-[#f7d5c8] to-[#c2826a]", "White Gold": "from-[#f4f4f4] to-[#b8bcc4]", Platinum: "from-[#e8eaee] to-[#8d939c]", Silver: "from-[#fafafa] to-[#9aa0a8]" };

export default function MetalTabs() {
  const [metal, setMetal] = useState("Gold");
  const [cache, setCache] = useState({});
  useEffect(() => {
    if (cache[metal]) return;
    api.get(`/products?metalType=${encodeURIComponent(metal)}&limit=4`).then((r) => setCache((c) => ({ ...c, [metal]: r.data.products }))).catch(() => setCache((c) => ({ ...c, [metal]: [] })));
  }, [metal, cache]);
  const items = cache[metal];
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10">
      <SectionHeading eyebrow="Material matters" title="Find your *metal*" subtitle="From warm 18k gold to cool platinum — choose the tone that tells your story." />
      <div className="no-scrollbar mx-auto mt-12 flex max-w-full justify-start gap-2 overflow-x-auto sm:justify-center">
        {METALS.map((m) => (
          <button key={m} onClick={() => setMetal(m)} className="relative flex flex-shrink-0 items-center gap-3 rounded-full px-5 py-3 text-sm transition-colors">
            {metal === m && <motion.span layoutId="metal-pill" className="absolute inset-0 rounded-full border border-gold-400/60 bg-gold-400/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className={`relative h-4 w-4 rounded-full bg-gradient-to-br ${SWATCH[m]} ring-1 ring-white/20`} />
            <span className={`relative ${metal === m ? "text-gold-200" : "text-cream/60"}`}>{m}</span>
          </button>
        ))}
      </div>
      <div className="mt-14 min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div key={metal} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}>
            {!items ? <GridSkeleton count={4} /> : items.length === 0 ? <p className="py-20 text-center text-cream/40">New {metal} pieces arriving soon.</p> : (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-12 text-center"><Link to={`/products?metalType=${encodeURIComponent(metal)}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold-300 underline-grow">All {metal} jewelry <ArrowRight size={15} /></Link></div>
    </section>
  );
}
