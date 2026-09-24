import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";

const marqueeWords = ["Diamonds", "Gold", "Platinum", "Emeralds", "Pearls", "Sapphires", "Craftsmanship", "Heritage"];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  // 3D tilt for hero showcase image, driven by mouse position
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);

  const handleTiltMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleTiltLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [f, n, c] = await Promise.all([
          api.get("/products?featured=true&limit=4"),
          api.get("/products?newArrival=true&limit=4"),
          api.get("/collections"),
        ]);
        setFeatured(f.data.products);
        setNewArrivals(n.data.products);
        setCollections(c.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="overflow-hidden bg-ink-950">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[92vh] overflow-hidden px-5 pb-24 pt-28 sm:px-8">
        {/* Ambient glows */}
        <motion.div
          style={{ scale: orbScale }}
          className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-[100px]"
        />
        <motion.div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-gold-700/10 blur-[100px] animate-pulse-slow" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative mx-auto flex max-w-7xl flex-col items-center text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-gold-400"
          >
            <span className="h-px w-10 bg-gold-400/50" /> Handcrafted Since 1998 <span className="h-px w-10 bg-gold-400/50" />
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-5xl font-bold leading-[1.05] text-cream sm:text-7xl lg:text-8xl"
            >
              Jewelry that tells
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="shimmer-text font-display text-5xl italic font-bold leading-[1.05] sm:text-7xl lg:text-8xl"
            >
              your story
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-8 max-w-lg text-cream/50"
          >
            Discover ethically sourced diamonds and precious metals, crafted into timeless pieces made to be treasured for generations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex gap-4"
          >
            <Link to="/products"><Button variant="gold">Shop Collection <ArrowRight size={15} /></Button></Link>
            <Link to="/collections"><Button variant="outline">View Collections</Button></Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-16 flex w-full max-w-2xl items-center justify-center"
            style={{ perspective: 1000 }}
          >
            {/* rotating dashed ring behind everything */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute h-[420px] w-[420px] rounded-full border border-dashed border-gold-400/20 sm:h-[480px] sm:w-[480px]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute h-[340px] w-[340px] rounded-full border border-gold-400/10 sm:h-[380px] sm:w-[380px]"
            />

            {/* small orbiting sparkle dots */}
            {[0, 90, 180, 270].map((deg, i) => (
              <motion.span
                key={deg}
                className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_8px_2px_rgba(205,163,85,0.6)]"
                style={{ transformOrigin: "210px 210px" }}
                animate={{ rotate: [deg, deg + 360] }}
                transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear" }}
              />
            ))}

            {/* left accent: necklace thumbnail, floats independently */}
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="gold-card absolute left-0 top-6 hidden h-32 w-28 -rotate-6 overflow-hidden rounded-2xl shadow-gold sm:block lg:left-6"
            >
              <img
                src="https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=400&q=80&fm=jpg&fit=crop"
                alt="Necklace accent"
                className="h-full w-full object-cover opacity-90"
              />
            </motion.div>

            {/* right accent: earrings thumbnail, floats independently */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="gold-card absolute right-0 bottom-8 hidden h-28 w-28 rotate-6 overflow-hidden rounded-2xl shadow-gold sm:block lg:right-6"
            >
              <img
                src="https://images.unsplash.com/photo-1619203451989-53f6d2ca0e57?w=400&q=80&fm=jpg&fit=crop"
                alt="Earrings accent"
                className="h-full w-full object-cover opacity-90"
              />
            </motion.div>

            {/* floating "certified" badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-dark absolute -right-2 top-2 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gold-300 sm:flex lg:right-16 lg:top-8"
            >
              <Sparkles size={11} /> Certified
            </motion.div>

            {/* main tilting showcase card */}
            <motion.div
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="group relative z-10 h-64 w-56 cursor-pointer overflow-hidden rounded-[28px] ring-1 ring-gold-400/25 shadow-gold-lg sm:h-80 sm:w-72"
            >
              <img
                src="https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=700&q=80&fm=jpg&fit=crop"
                alt="Featured jewelry piece"
                className="h-full w-full object-cover"
                style={{ transform: "translateZ(20px)" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              {/* moving glare highlight following tilt */}
              <motion.div
                className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                style={{ left: glareX, x: "-50%" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300">Featured</p>
                <p className="font-display text-sm italic text-cream">Rose Gold Solitaire</p>
              </div>
            </motion.div>
            {/* ambient glow behind the card */}
            <div className="pointer-events-none absolute h-64 w-56 rounded-[28px] bg-gold-400/20 blur-2xl sm:h-80 sm:w-72" />
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE STRIP */}
      <section className="border-y border-gold-400/10 bg-ink-900 py-5">
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="mx-8 flex items-center gap-3 font-display text-xl text-cream/25 whitespace-nowrap">
              {w} <Sparkles size={14} className="text-gold-500/40" />
            </span>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {[
            { icon: ShieldCheck, text: "Certified Authentic Gemstones" },
            { icon: Truck, text: "Free Insured Shipping" },
            { icon: Sparkles, text: "Lifetime Craftsmanship Warranty" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="flex flex-col items-center gap-3 text-sm text-cream/50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-ink-900">
                <Icon className="text-gold-400" size={20} />
              </span>
              {text}
            </motion.div>
          ))}
        </div>
      </section>

      {loading ? (
        <Loader full />
      ) : (
        <>
          {/* FEATURED */}
          <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <SectionHeading eyebrow="Curated for you" title="Featured Pieces" subtitle="Our most-loved designs, chosen for their exceptional craftsmanship." />
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </section>

          {/* COLLECTIONS */}
          {collections.length > 0 && (
            <section className="relative px-5 py-24 sm:px-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
              <div className="mx-auto max-w-7xl">
                <SectionHeading eyebrow="Signature" title="Explore Collections" subtitle="Curated stories told through precious metal and stone." />
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {collections.slice(0, 3).map((c, i) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -8 }}
                    >
                      <Link to={`/collections/${c.slug}`} className="gold-card group block overflow-hidden rounded-2xl">
                        <div className="flex h-56 items-center justify-center bg-gradient-to-br from-gold-700/10 to-ink-900">
                          <span className="font-display text-2xl text-gold-300/80 transition-transform duration-500 group-hover:scale-105">{c.name}</span>
                        </div>
                        <div className="p-6">
                          <p className="text-xs uppercase tracking-widest text-gold-400/70">{c.designer}</p>
                          <h3 className="mt-1 font-display text-xl text-cream">{c.name}</h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* NEW ARRIVALS */}
          <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <SectionHeading eyebrow="Just landed" title="New Arrivals" subtitle="Fresh from the atelier — the newest additions to our line." />
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div className="mt-14 text-center">
              <Link to="/products"><Button variant="primary">View All Products <ArrowRight size={15} /></Button></Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
