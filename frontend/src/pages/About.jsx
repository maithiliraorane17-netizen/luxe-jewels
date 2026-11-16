import { Link } from "react-router-dom";
import { Gem, Award, Leaf } from "lucide-react";
import SplitText from "../components/fx/SplitText";
import Reveal from "../components/fx/Reveal";
import CountUp from "../components/fx/CountUp";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import { IMG, u } from "../utils/images";

const MILESTONES = [["1998", "A single workbench in Mumbai"], ["2006", "First flagship atelier opens"], ["2014", "100% conflict-free sourcing commitment"], ["2021", "Launch of our online maison"], ["Today", "12,000+ heirlooms delivered"]];

export default function About() {
  return (
    <div>
      <section className="px-6 pb-24 pt-20 text-center sm:px-10">
        <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-gold-400">Our story</p>
        <SplitText as="h1" immediate text="Crafted with passion, worn with *pride*" className="mx-auto max-w-5xl font-display text-5xl font-medium leading-[1] sm:text-8xl" />
        <Reveal delay={0.4}><p className="mx-auto mt-8 max-w-xl text-cream/55">For over two decades LuxeJewels has celebrated life's defining moments — blending traditional craftsmanship with contemporary design.</p></Reveal>
      </section>
      <section className="mx-auto grid max-w-[1300px] items-center gap-16 px-6 py-16 sm:px-10 lg:grid-cols-2">
        <Reveal><div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[32px] ring-1 ring-gold-400/20"><img src={u(IMG.roseGoldRing, 1000)} alt="" className="h-full w-full object-cover" /></div></Reveal>
        <div>
          <SectionHeading align="left" eyebrow="The workshop" title="Where metal meets *memory*" />
          <Reveal delay={0.2}><p className="mt-6 leading-relaxed text-cream/55">Every LuxeJewels piece begins as a sketch and ends in the hands of a master artisan. We cast, set and polish in small batches — never rushing the details that make a piece last generations.</p></Reveal>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-cream/10 pt-8">{[[26, "+", "Years"], [12000, "+", "Pieces"], [100, "%", "Certified"]].map(([n, s, l]) => <div key={l}><p className="font-display text-4xl gold-text"><CountUp to={n} suffix={s} /></p><p className="text-[11px] uppercase tracking-widest text-cream/40">{l}</p></div>)}</div>
        </div>
      </section>
      <section className="mx-auto max-w-[1300px] px-6 py-24 sm:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {[[Gem, "Master craftsmanship", "Hand-finished by artisans with decades of expertise."], [Award, "Certified quality", "Every gemstone independently graded and hallmarked."], [Leaf, "Responsible sourcing", "Conflict-free stones and recycled precious metals."]].map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 0.1}><div className="gold-card rounded-3xl p-8"><Icon className="mb-5 text-gold-400" size={30} strokeWidth={1.3} /><h3 className="font-display text-2xl">{t}</h3><p className="mt-2 text-sm text-cream/50">{d}</p></div></Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <SectionHeading eyebrow="Milestones" title="Our *journey*" />
        <div className="relative mt-16 border-l border-gold-400/25 pl-10">
          {MILESTONES.map(([y, t], i) => (
            <Reveal key={y} delay={i * 0.08} className="relative mb-12 last:mb-0"><span className="absolute -left-[46px] top-2 h-3 w-3 rounded-full bg-gold-400 shadow-[0_0_14px_3px_rgba(205,163,85,.6)]" /><p className="font-display text-3xl gold-text">{y}</p><p className="mt-1 text-cream/55">{t}</p></Reveal>
          ))}
        </div>
      </section>
      <section className="px-6 py-24 text-center"><SplitText as="h2" text="Find the piece that tells *your* story" className="mx-auto max-w-3xl font-display text-4xl sm:text-6xl" /><Link to="/products" className="mt-10 inline-block"><Button size="lg">Shop the collection</Button></Link></section>
    </div>
  );
}
