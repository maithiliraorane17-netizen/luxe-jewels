import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, LayoutGrid, Grid3x3 } from "lucide-react";
import api from "../api/axios";
import useCategories from "../hooks/useCategories";
import ProductCard from "../components/product/ProductCard";
import SplitText from "../components/fx/SplitText";
import Dropdown from "../components/ui/Dropdown";
import { GridSkeleton } from "../components/ui/Skeleton";

const METALS = ["Gold", "Rose Gold", "White Gold", "Platinum", "Silver"];
const GEMS = ["Diamond", "Sapphire", "Emerald", "Pearl", "Amethyst", "Onyx"];
const PRICES = [
  { label: "Under ₹25,000", min: "", max: 25000 },
  { label: "₹25,000 – ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: "" },
];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const Chip = ({ active, children, onClick }) => (
  <button onClick={onClick} className={`rounded-full border px-4 py-2 text-xs transition ${active ? "border-gold-400 bg-gold-400/15 text-gold-200" : "border-cream/15 text-cream/60 hover:border-gold-400/50 hover:text-cream"}`}>{children}</button>
);

export default function ProductListing() {
  const [sp, setSp] = useSearchParams();
  const cats = useCategories();
  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [cols, setCols] = useState(3);

  const category = sp.get("category") || "";
  const metalType = sp.get("metalType") || "";
  const gemstone = sp.get("gemstone") || "";
  const minPrice = sp.get("minPrice") || "";
  const maxPrice = sp.get("maxPrice") || "";
  const sort = sp.get("sort") || "newest";
  const search = sp.get("search") || "";
  const newArrival = sp.get("newArrival") || "";
  const page = Number(sp.get("page") || 1);

  const setParams = (obj) => {
    const n = new URLSearchParams(sp);
    Object.entries(obj).forEach(([k, v]) => (v === "" || v == null ? n.delete(k) : n.set(k, v)));
    if (!("page" in obj)) n.delete("page");
    setSp(n);
  };

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams(sp);
    q.set("limit", "12");
    api.get(`/products?${q.toString()}`).then((r) => setData(r.data)).catch(() => setData({ products: [], total: 0, pages: 1 })).finally(() => setLoading(false));
  }, [sp]);

  const catName = cats.find((c) => c._id === category)?.name;
  const active = useMemo(() => {
    const a = [];
    if (catName) a.push(["category", catName]);
    if (metalType) a.push(["metalType", metalType]);
    if (gemstone) a.push(["gemstone", gemstone]);
    if (minPrice || maxPrice) a.push(["price", `₹${minPrice || 0} – ${maxPrice ? "₹" + maxPrice : "∞"}`]);
    if (search) a.push(["search", `“${search}”`]);
    if (newArrival) a.push(["newArrival", "New arrivals"]);
    return a;
  }, [catName, metalType, gemstone, minPrice, maxPrice, search, newArrival]);
  const clear = (k) => (k === "price" ? setParams({ minPrice: "", maxPrice: "" }) : setParams({ [k]: "" }));

  const Filters = (
    <div className="space-y-9">
      <div><h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400">Metal</h4><div className="flex flex-wrap gap-2">{METALS.map((m) => <Chip key={m} active={metalType === m} onClick={() => setParams({ metalType: metalType === m ? "" : m })}>{m}</Chip>)}</div></div>
      <div><h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400">Gemstone</h4><div className="flex flex-wrap gap-2">{GEMS.map((g) => <Chip key={g} active={gemstone === g} onClick={() => setParams({ gemstone: gemstone === g ? "" : g })}>{g}</Chip>)}</div></div>
      <div>
        <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400">Price</h4>
        <div className="flex flex-col gap-2">
          {PRICES.map((p) => { const on = String(p.min) === minPrice && String(p.max) === maxPrice; return <Chip key={p.label} active={on} onClick={() => setParams(on ? { minPrice: "", maxPrice: "" } : { minPrice: p.min, maxPrice: p.max })}>{p.label}</Chip>; })}
        </div>
      </div>
    </div>
  );
  const gridCols = cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-24 pt-14 sm:px-10">
      <div className="mb-10">
        <p className="mb-4 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400"><span className="h-px w-10 bg-gold-400/50" /> {search ? "Search results" : "The collection"}</p>
        <SplitText as="h1" text={search ? `Results for *${search.split(" ")[0]}*` : catName ? `${catName.split(" ")[0]} & *more*` : "All *jewelry*"} immediate className="font-display text-5xl font-medium sm:text-7xl" />
      </div>
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto border-b border-cream/10 pb-6">
        <Chip active={!category} onClick={() => setParams({ category: "" })}>All</Chip>
        {cats.map((c) => <Chip key={c._id} active={category === c._id} onClick={() => setParams({ category: category === c._id ? "" : c._id })}>{c.name}</Chip>)}
      </div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2.5 text-sm text-cream/80 lg:hidden"><SlidersHorizontal size={15} /> Filters</button>
          <p className="text-sm text-cream/45">{loading ? "Loading…" : `${data.total} piece${data.total === 1 ? "" : "s"}`}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-cream/15 p-1 sm:flex">
            {[[3, LayoutGrid], [4, Grid3x3]].map(([n, Icon]) => <button key={n} onClick={() => setCols(n)} aria-label={`${n} columns`} className={`rounded-full p-2 transition ${cols === n ? "bg-gold-400 text-ink-950" : "text-cream/50 hover:text-cream"}`}><Icon size={15} /></button>)}
          </div>
          <Dropdown value={sort} onChange={(v) => setParams({ sort: v })} options={SORTS} label="Sort:" />
        </div>
      </div>
      <AnimatePresence>
        {active.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 flex flex-wrap items-center gap-2 overflow-hidden">
            {active.map(([k, v]) => <motion.button layout key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={() => clear(k)} className="flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-2 text-xs text-gold-200 transition hover:bg-gold-400/25">{v} <X size={12} /></motion.button>)}
            <button onClick={() => setSp(new URLSearchParams())} className="ml-2 text-xs uppercase tracking-widest text-cream/40 underline-grow hover:text-cream">Clear all</button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-28">{Filters}</div></aside>
        <div>
          {loading ? <GridSkeleton count={6} className={`grid gap-5 ${gridCols}`} /> : data.products.length === 0 ? (
            <div className="py-32 text-center"><p className="font-display text-3xl">No pieces found</p><p className="mt-2 text-cream/45">Try removing a filter or two.</p></div>
          ) : (
            <div key={sp.toString()} className={`grid gap-x-5 gap-y-12 ${gridCols}`}>{data.products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
          )}
          {data.pages > 1 && (
            <div className="mt-20 flex justify-center gap-2">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => <button key={n} onClick={() => { setParams({ page: n }); window.__lenis?.scrollTo(0); }} className={`h-11 w-11 rounded-full text-sm transition ${n === page ? "bg-gold-400 text-ink-950" : "border border-cream/15 text-cream/60 hover:border-gold-400"}`}>{n}</button>)}
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-[150] bg-black/70" />
            <motion.div data-lenis-prevent initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }} className="fixed left-0 top-0 z-[160] h-full w-80 overflow-y-auto border-r border-gold-400/15 bg-ink-900 p-6">
              <div className="mb-8 flex items-center justify-between"><h3 className="font-display text-2xl">Filters</h3><button onClick={() => setDrawer(false)}><X size={20} /></button></div>
              {Filters}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
