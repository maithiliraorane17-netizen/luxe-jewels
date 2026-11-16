import { useEffect, useState } from "react";
import { Truck, ShieldCheck, RotateCcw, Banknote } from "lucide-react";
import api from "../api/axios";
import useCategories from "../hooks/useCategories";
import Marquee from "../components/fx/Marquee";
import Reveal from "../components/fx/Reveal";
import SectionHeading from "../components/ui/SectionHeading";
import ProductCard from "../components/product/ProductCard";
import Hero from "./home/Hero";
import CategoryTiles from "./home/CategoryTiles";
import FeaturedGallery from "./home/FeaturedGallery";
import BrandStory from "./home/BrandStory";
import CollectionsShowcase from "./home/CollectionsShowcase";
import MetalTabs from "./home/MetalTabs";
import Craft from "./home/Craft";
import Testimonials from "./home/Testimonials";
import InstagramGrid from "./home/InstagramGrid";
import Newsletter from "./home/Newsletter";

const WORDS = ["Diamonds", "Gold", "Platinum", "Emeralds", "Pearls", "Sapphires", "Heritage", "Craft"];
const TRUST = [
  [Truck, "Free insured shipping", "On orders above ₹20,000"],
  [Banknote, "UPI, Cards & COD", "Pay the way you prefer"],
  [ShieldCheck, "Certified authentic", "Every gemstone graded"],
  [RotateCcw, "30-day returns", "Easy, no-questions policy"],
];

export default function Home() {
  const categories = useCategories();
  const [featured, setFeatured] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get("/products?featured=true&limit=8").then((r) => setFeatured(r.data.products)).catch(() => {});
    api.get("/products?newArrival=true&limit=4").then((r) => setArrivals(r.data.products)).catch(() => {});
    api.get("/collections").then((r) => setCollections(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Hero />
      <section className="border-y border-gold-400/10 bg-ink-900 py-7">
        <Marquee duration={45} items={WORDS} itemClass="mx-8 gap-8 font-display text-5xl font-medium outline-text sm:text-7xl after:ml-8 after:text-gold-500/50 after:content-['✦']" />
      </section>
      <section className="mx-auto grid max-w-[1500px] gap-8 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {TRUST.map(([Icon, t, d], i) => (
          <Reveal key={t} delay={i * 0.08} className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/25 text-gold-300"><Icon size={20} strokeWidth={1.4} /></span>
            <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-cream/40">{d}</p></div>
          </Reveal>
        ))}
      </section>
      <CategoryTiles categories={categories} />
      <FeaturedGallery products={featured} />
      <BrandStory />
      <CollectionsShowcase collections={collections} />
      <MetalTabs />
      {arrivals.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10">
          <SectionHeading eyebrow="Just landed" title="New *arrivals*" subtitle="Fresh from the atelier — the newest additions to our line." />
          <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">{arrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
        </section>
      )}
      <Craft />
      <Testimonials />
      <InstagramGrid />
      <Newsletter />
    </div>
  );
}
