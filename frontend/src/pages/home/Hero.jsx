import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Gem } from "lucide-react";
import SplitText from "../../components/fx/SplitText";
import Particles from "../../components/fx/Particles";
import Magnetic from "../../components/fx/Magnetic";
import Button from "../../components/ui/Button";
import { HERO_SLIDES, u } from "../../utils/images";
import { useUI } from "../../store/uiStore";

export default function Hero() {
  const ref = useRef(null);
  const ready = useUI((s) => s.ready);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[i];
  const next = HERO_SLIDES[(i + 1) % HERO_SLIDES.length];

  return (
    <section ref={ref} className="grain relative min-h-[calc(100vh-70px)] overflow-hidden px-6 pb-28 pt-8 sm:px-10">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] animate-drift-a rounded-full bg-gradient-to-br from-gold-400/30 to-transparent blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-[560px] w-[560px] animate-drift-b rounded-full bg-gradient-to-tr from-gold-600/25 to-transparent blur-[60px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: "linear-gradient(90deg,#cda355 1px,transparent 1px)", backgroundSize: "calc(100%/6) 100%" }} />
      <Particles count={26} />

      <div className="relative mx-auto grid min-h-[calc(100vh-190px)] max-w-[1500px] items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }} className="mb-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.45em] text-gold-400">
            <span className="h-px w-12 bg-gold-400/60" /> Handcrafted since 1998
          </motion.p>
          <SplitText immediate as="h1" text="Jewelry that tells *your* *story*" delay={0.15} className="font-display text-[clamp(3.1rem,8.4vw,8.2rem)] font-medium leading-[.95] tracking-tight" />
          <motion.p initial={{ opacity: 0, y: 24 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.9 }} className="mt-8 max-w-md text-base leading-relaxed text-cream/55">
            Ethically sourced diamonds and precious metals, shaped by master artisans into timeless pieces — made to be treasured for generations.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 1.05 }} className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic><Link to="/products"><Button size="lg">Shop the collection <ArrowRight size={16} /></Button></Link></Magnetic>
            <Magnetic><Link to="/collections"><Button size="lg" variant="outline">Explore collections</Button></Link></Magnetic>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 1.4 }} className="mt-14 flex gap-10 border-t border-cream/10 pt-6">
            {[["4.9/5", "Customer rating"], ["12k+", "Pieces delivered"], ["100%", "Certified stones"]].map(([n, l]) => (
              <div key={l}><p className="font-display text-3xl gold-text">{n}</p><p className="mt-1 text-[11px] uppercase tracking-widest text-cream/40">{l}</p></div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yImg }} className="relative mx-auto w-full max-w-[470px]">
          <motion.div initial={{ opacity: 0, y: 80, scale: 0.94 }} animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[36px] bg-ink-800 shadow-gold-lg ring-1 ring-gold-400/30" data-cursor="view" data-cursor-label="Shop">
              <AnimatePresence initial={false}>
                <motion.img key={i} src={u(slide.img, 1000)} alt={slide.tag} initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.3 }} animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }} exit={{ opacity: 0, transition: { duration: 1.6 } }} transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 h-full w-full object-cover" />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-6 top-24 h-28 w-28 sm:-left-14 sm:h-36 sm:w-36">
              <div className="absolute inset-0 rounded-full bg-ink-950/80 backdrop-blur" />
              <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
                <defs><path id="badge" d="M60,60 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" /></defs>
                <text fill="#dcbe7c" fontSize="8.5" fontFamily="Inter" fontWeight="600"><textPath href="#badge" textLength="308" lengthAdjust="spacing">HANDCRAFTED • SINCE 1998 • FINE JEWELRY •</textPath></text>
              </svg>
              <Gem className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-300" size={26} strokeWidth={1.2} />
            </div>

            <div className="absolute -bottom-8 -left-4 h-28 w-28 overflow-hidden rounded-full ring-[5px] ring-ink-950 sm:-left-10 sm:h-40 sm:w-40">
              <AnimatePresence initial={false}>
                <motion.img key={i} src={u(next.img, 400)} alt="" initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 h-full w-full object-cover" />
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }} className="glass-dark absolute -right-2 bottom-14 rounded-2xl px-5 py-3 sm:-right-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400">Featured</p>
                <p className="font-display text-lg italic">{slide.tag}</p>
                <p className="text-xs text-cream/60">{slide.price}</p>
              </motion.div>
            </AnimatePresence>

            <div className="absolute -right-4 top-1/3 hidden flex-col items-center gap-3 sm:flex lg:-right-10">
              <span className="font-display text-sm text-gold-300">0{i + 1}</span>
              {HERO_SLIDES.map((_, idx) => <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`w-px transition-all duration-700 ${idx === i ? "h-12 bg-gold-300" : "h-6 bg-cream/25"}`} />)}
              <span className="font-display text-sm text-cream/30">0{HERO_SLIDES.length}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 2 }} className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.4em] text-cream/40">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-cream/15"><motion.span animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="absolute inset-x-0 h-1/2 bg-gold-300" /></span>
      </motion.div>
    </section>
  );
}
