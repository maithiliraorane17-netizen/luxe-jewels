import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import api from "../api/axios";
import SplitText from "../components/fx/SplitText";
import Reveal from "../components/fx/Reveal";
import Loader from "../components/ui/Loader";
import ProductCard from "../components/product/ProductCard";
import { COLLECTION_IMAGES, u } from "../utils/images";

export default function CollectionDetail() {
  const { slug } = useParams();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  useEffect(() => { setLoading(true); api.get(`/collections/${slug}`).then((r) => setC(r.data)).catch(() => setC(null)).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <Loader full />;
  if (!c) return <div className="py-40 text-center"><p className="font-display text-4xl">Collection not found</p><Link to="/collections" className="mt-6 inline-block text-gold-300">All collections</Link></div>;
  return (
    <div>
      <section ref={ref} className="relative flex h-[70vh] items-end overflow-hidden px-6 pb-16 sm:px-10">
        <motion.img style={{ y, scale: 1.15 }} src={u(COLLECTION_IMAGES[c.name.length % COLLECTION_IMAGES.length], 1600)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/30" />
        <div className="relative mx-auto w-full max-w-[1500px]">
          <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-gold-300">{c.designer} · Collection</p>
          <SplitText as="h1" immediate text={c.name.split(" ").map((w, i, a) => (i === a.length - 1 ? `*${w}*` : w)).join(" ")} className="font-display text-6xl font-medium sm:text-9xl" />
          <Reveal delay={0.4}><p className="mt-6 max-w-xl text-cream/65">{c.description}</p></Reveal>
        </div>
      </section>
      <div className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10">
        <p className="mb-10 text-xs uppercase tracking-widest text-cream/40">{c.products.length} pieces</p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">{c.products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
      </div>
    </div>
  );
}
