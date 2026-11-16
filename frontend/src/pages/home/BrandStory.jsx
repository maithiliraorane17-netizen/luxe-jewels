import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "../../components/fx/CountUp";
import { IMG, u } from "../../utils/images";

const TEXT = "We don't simply make jewelry. We shape light, metal and memory into heirlooms — each piece hand-finished by master artisans, set with ethically sourced stones, and made to be passed down.";

function Word({ w, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{w}</motion.span>;
}

export default function BrandStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const { scrollYProgress: p2 } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yL = useTransform(p2, [0, 1], [90, -120]);
  const yR = useTransform(p2, [0, 1], [-60, 140]);
  const words = TEXT.split(" ");
  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-36 sm:px-10">
      <motion.div style={{ y: yL }} className="absolute -left-10 top-24 hidden h-72 w-52 overflow-hidden rounded-t-[999px] ring-1 ring-gold-400/20 lg:block xl:left-10"><img src={u(IMG.goldChain, 500)} alt="" className="h-full w-full object-cover opacity-70" /></motion.div>
      <motion.div style={{ y: yR }} className="absolute -right-10 bottom-24 hidden h-64 w-64 overflow-hidden rounded-full ring-1 ring-gold-400/20 lg:block xl:right-10"><img src={u(IMG.diamondRing, 500)} alt="" className="h-full w-full object-cover opacity-70" /></motion.div>
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="mb-8 flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400"><span className="h-px w-10 bg-gold-400/50" /> Our philosophy <span className="h-px w-10 bg-gold-400/50" /></p>
        <p className="font-display text-3xl leading-[1.2] sm:text-5xl lg:text-[3.6rem]">{words.map((w, i) => <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}</p>
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-cream/10 pt-12">
          {[[26, "+", "Years of craft"], [12000, "+", "Heirlooms delivered"], [100, "%", "Certified & conflict-free"]].map(([n, s, l]) => (
            <div key={l}><p className="font-display text-4xl gold-text sm:text-6xl"><CountUp to={n} suffix={s} /></p><p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-cream/40">{l}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
