import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../../components/ui/SectionHeading";
import Reveal from "../../components/fx/Reveal";
import SplitText from "../../components/fx/SplitText";
import Button from "../../components/ui/Button";
import { COLLECTION_IMAGES, u } from "../../utils/images";

function Row({ c, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const rev = i % 2 === 1;
  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <Reveal className={rev ? "lg:order-2" : ""}>
        <Link to={`/collections/${c.slug}`} data-cursor="view" data-cursor-label="Explore" className="group relative block aspect-[4/5] overflow-hidden rounded-[32px] ring-1 ring-gold-400/15">
          <motion.img style={{ y, scale: 1.25 }} src={u(COLLECTION_IMAGES[i % COLLECTION_IMAGES.length], 1000)} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        </Link>
      </Reveal>
      <div className={rev ? "lg:order-1" : ""}>
        <Reveal><span className="font-display text-[8rem] leading-none outline-text-gold sm:text-[11rem]">0{i + 1}</span></Reveal>
        <p className="-mt-6 mb-4 text-[11px] uppercase tracking-[0.4em] text-gold-400">{c.designer || "The Maison"}</p>
        <SplitText as="h3" text={c.name.split(" ").map((w, k, a) => (k === a.length - 1 ? `*${w}*` : w)).join(" ")} className="font-display text-5xl leading-none sm:text-7xl" />
        <Reveal delay={0.2}><p className="mt-6 max-w-md text-cream/55">{c.description}</p></Reveal>
        <Reveal delay={0.3}>
          <p className="mt-4 text-xs uppercase tracking-widest text-cream/35">{c.products?.length || 0} pieces</p>
          <Link to={`/collections/${c.slug}`} className="mt-8 inline-block"><Button variant="outline">Explore collection <ArrowRight size={15} /></Button></Link>
        </Reveal>
      </div>
    </div>
  );
}

export default function CollectionsShowcase({ collections }) {
  if (!collections?.length) return null;
  return (
    <section className="relative px-6 py-28 sm:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading eyebrow="Signature" title="Collections with a *story*" subtitle="Each collection is a narrative — told through precious metal and stone." />
        <div className="mt-24 space-y-32">{collections.slice(0, 3).map((c, i) => <Row key={c._id} c={c} i={i} />)}</div>
      </div>
    </section>
  );
}
