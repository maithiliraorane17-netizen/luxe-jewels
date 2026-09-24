import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

export default function CollectionDetail() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/collections/${slug}`).then((res) => setCollection(res.data)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader full />;
  if (!collection) return <p className="py-24 text-center">Collection not found.</p>;

  return (
    <div>
      <section className="bg-ink-900 px-5 py-20 text-center text-cream sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">{collection.designer}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">{collection.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/60">{collection.description}</p>
        </motion.div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {collection.products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </div>
    </div>
  );
}
