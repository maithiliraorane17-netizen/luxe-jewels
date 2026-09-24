import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

const metalTypes = ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold"];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pages, setPages] = useState(1);

  const category = searchParams.get("category") || "";
  const metalType = searchParams.get("metalType") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">The Collection</p>
          <h1 className="font-display text-3xl font-semibold text-cream sm:text-4xl">Shop All Jewelry</h1>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-sm lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <FilterPanel
            categories={categories}
            category={category}
            metalType={metalType}
            sort={sort}
            updateParam={updateParam}
          />
        </aside>

        <div>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-cream/50">No products found matching your filters.</p>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </motion.div>
          )}

          {pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam("page", p)}
                  className={`h-9 w-9 rounded-full text-sm ${
                    p === page ? "bg-ink-900 text-cream" : "text-cream/55 hover:bg-ink-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/70 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-ink-900 p-6"
            >
              <button onClick={() => setShowFilters(false)} className="mb-6"><X size={22} /></button>
              <FilterPanel
                categories={categories}
                category={category}
                metalType={metalType}
                sort={sort}
                updateParam={updateParam}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPanel({ categories, category, metalType, sort, updateParam }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/50">Sort By</h4>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full rounded-lg border border-cream/15 bg-ink-900 px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/50">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => updateParam("category", "")}
            className={`block text-sm ${!category ? "font-semibold text-gold-400" : "text-cream/55"}`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => updateParam("category", c._id)}
              className={`block text-sm ${category === c._id ? "font-semibold text-gold-400" : "text-cream/55"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/50">Metal Type</h4>
        <div className="space-y-2">
          <button
            onClick={() => updateParam("metalType", "")}
            className={`block text-sm ${!metalType ? "font-semibold text-gold-400" : "text-cream/55"}`}
          >
            All Metals
          </button>
          {metalTypes.map((m) => (
            <button
              key={m}
              onClick={() => updateParam("metalType", m)}
              className={`block text-sm ${metalType === m ? "font-semibold text-gold-400" : "text-cream/55"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
