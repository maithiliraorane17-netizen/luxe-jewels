import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import SectionHeading from "../components/ui/SectionHeading";
import Loader from "../components/ui/Loader";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/collections").then((res) => setCollections(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading eyebrow="Signature Stories" title="Our Collections" subtitle="Each collection is a narrative — inspired by nature, heritage, and modern elegance." />
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -8 }}
          >
            <Link to={`/collections/${c.slug}`} className="gold-card group block overflow-hidden rounded-3xl">
              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-gold-700/15 to-ink-900">
                <span className="font-display text-3xl text-gold-300/80 transition-transform duration-500 group-hover:scale-105">{c.name}</span>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-gold-400">{c.designer}</p>
                <h3 className="mt-1 font-display text-2xl text-cream">{c.name}</h3>
                <p className="mt-2 text-sm text-cream/55">{c.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
