import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery";
import SplitText from "../../components/fx/SplitText";
import { formatPrice } from "../../utils/format";

function Card({ p, n }) {
  return (
    <Link to={`/products/${p.slug}`} data-cursor="drag" data-cursor-label="View" className="group block w-[78vw] flex-shrink-0 sm:w-[46vw] lg:w-[27vw] lg:min-w-[340px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink-800 ring-1 ring-gold-400/15">
        {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
        <span className="absolute left-6 top-5 font-display text-6xl text-cream/15 outline-text">{String(n).padStart(2, "0")}</span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold-400/80">{[p.metalType, p.gemstone !== "None" && p.gemstone].filter(Boolean).join(" · ")}</p>
          <h3 className="mt-1 font-display text-2xl transition-colors group-hover:text-gold-200">{p.name}</h3>
        </div>
        <p className="pt-1 font-semibold text-gold-300">{formatPrice(p.discountPrice || p.price)}</p>
      </div>
    </Link>
  );
}

function Intro() {
  return (
    <div className="flex w-[84vw] flex-shrink-0 flex-col justify-center pr-10 sm:w-[60vw] lg:w-[30vw] lg:min-w-[380px]">
      <p className="mb-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400"><span className="h-px w-10 bg-gold-400/50" /> Curated for you</p>
      <SplitText text="Featured *pieces*" as="h2" className="font-display text-5xl font-medium leading-[1] sm:text-7xl" />
      <p className="mt-6 max-w-xs text-cream/50">Our most-loved designs — chosen for exceptional craftsmanship and quiet brilliance.</p>
      <Link to="/products" className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold-300 underline-grow">Shop all <ArrowRight size={15} /></Link>
    </div>
  );
}

function Outro() {
  return (
    <Link to="/products" data-cursor="view" data-cursor-label="All" className="group flex w-[70vw] flex-shrink-0 items-center justify-center sm:w-[30vw]">
      <div className="flex h-56 w-56 flex-col items-center justify-center gap-3 rounded-full border border-gold-400/30 text-center transition-all duration-500 group-hover:bg-gold-300 group-hover:text-ink-950">
        <span className="font-display text-2xl italic">View all</span><ArrowUpRight size={22} />
      </div>
    </Link>
  );
}

export default function FeaturedGallery({ products }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const ref = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  useLayoutEffect(() => {
    if (!desktop || !track.current) return;
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 40));
    measure();
    const t = setTimeout(measure, 700);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [products, desktop]);

  if (!products?.length) return null;

  if (!desktop) {
    return (
      <section className="py-20">
        <div className="px-6"><Intro /></div>
        <div className="no-scrollbar mt-10 flex snap-x gap-5 overflow-x-auto px-6 pb-4">{products.map((p, i) => <div key={p._id} className="snap-start"><Card p={p} n={i + 1} /></div>)}</div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-14 pl-[6vw] pr-[6vw]">
          <Intro />
          {products.map((p, i) => <Card key={p._id} p={p} n={i + 1} />)}
          <Outro />
        </motion.div>
        <div className="absolute bottom-10 left-[6vw] right-[6vw] h-px bg-cream/10"><motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-gradient-to-r from-gold-600 to-gold-200" /></div>
      </div>
    </section>
  );
}
