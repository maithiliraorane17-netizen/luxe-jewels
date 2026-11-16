import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../../components/ui/SectionHeading";
import Reveal from "../../components/fx/Reveal";
import { CATEGORY_IMAGES, u } from "../../utils/images";

const FALLBACK = [
  { _id: "", name: "Rings", slug: "rings", description: "Elegant rings for every occasion" },
  { _id: "", name: "Necklaces", slug: "necklaces", description: "Statement necklaces" },
  { _id: "", name: "Earrings", slug: "earrings", description: "Timeless earrings" },
  { _id: "", name: "Bracelets", slug: "bracelets", description: "Delicate bracelets" },
];

export default function CategoryTiles({ categories }) {
  const items = (categories?.length ? categories : FALLBACK).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10">
      <SectionHeading eyebrow="The Maison" title="Shop by *category*" subtitle="Four families of fine jewelry — each crafted to be worn, loved and inherited." />
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.1} className={i % 2 === 1 ? "lg:mt-16" : ""}>
            <Link to={c._id ? `/products?category=${c._id}` : "/products"} data-cursor="view" data-cursor-label="Shop" className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] bg-ink-800 ring-1 ring-gold-400/10">
              <img src={u(CATEGORY_IMAGES[c.slug] || CATEGORY_IMAGES.rings, 800)} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent transition-opacity duration-500 group-hover:from-ink-950/95" />
              <span className="absolute left-6 top-6 font-display text-sm italic text-gold-300/80">0{i + 1}</span>
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl">{c.name}</h3>
                  <p className="mt-1 max-w-[16ch] text-xs leading-snug text-cream/50 opacity-0 transition-all duration-500 group-hover:opacity-100">{c.description}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/40 text-gold-200 transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-300 group-hover:text-ink-950"><ArrowUpRight size={18} /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
