import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Gem, PenTool, Hammer, BadgeCheck } from "lucide-react";
import SectionHeading from "../../components/ui/SectionHeading";
import Reveal from "../../components/fx/Reveal";

const steps = [
  { icon: Gem, t: "Ethical sourcing", d: "Conflict-free diamonds and recycled precious metals, traced from mine to atelier." },
  { icon: PenTool, t: "Design", d: "Every piece begins as a hand sketch, refined in wax and 3D until the proportions sing." },
  { icon: Hammer, t: "Handcrafting", d: "Master artisans cast, set and polish each piece — often over a hundred hours of work." },
  { icon: BadgeCheck, t: "Certification", d: "Independently graded, hallmarked and delivered with a lifetime craftsmanship warranty." },
];

export default function Craft() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  return (
    <section ref={ref} className="relative overflow-hidden border-y border-gold-400/10 bg-ink-900 px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading eyebrow="The Atelier" title="From stone to *heirloom*" />
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-cream/10 lg:block"><motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500" /></div>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.12}>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/40 bg-ink-900 text-gold-300"><Icon size={24} strokeWidth={1.3} /><span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-[11px] font-bold text-ink-950">{i + 1}</span></div>
                <h3 className="mt-6 font-display text-2xl">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/50">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
