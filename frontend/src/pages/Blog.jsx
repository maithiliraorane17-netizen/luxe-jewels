import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import SectionHeading from "../components/ui/SectionHeading";
import Loader from "../components/ui/Loader";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs").then((res) => setBlogs(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading eyebrow="The Journal" title="Stories & Inspiration" subtitle="Insights on jewelry care, design trends, and the art of gifting." />
      {blogs.length === 0 ? (
        <p className="mt-12 text-center text-cream/50">No articles published yet.</p>
      ) : (
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={`/blog/${b.slug}`} className="gold-card block overflow-hidden rounded-2xl p-6">
                <h3 className="font-display text-xl">{b.title}</h3>
                <p className="mt-2 text-sm text-cream/55">{b.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
