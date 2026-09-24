import { motion } from "framer-motion";
import { Gem, Award, Leaf } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-b from-gold-900/10 to-ink-900 px-5 py-24 text-center sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Our Story</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Crafted with Passion, Worn with Pride</h1>
          <p className="mx-auto mt-6 max-w-2xl text-cream/55">
            For over two decades, LuxeJewels has been dedicated to creating exceptional jewelry that celebrates
            life's most meaningful moments — combining traditional craftsmanship with contemporary design.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          {[
            { icon: Gem, title: "Master Craftsmanship", text: "Every piece is hand-finished by skilled artisans with decades of expertise." },
            { icon: Award, title: "Certified Quality", text: "All gemstones are certified for authenticity and ethical sourcing." },
            { icon: Leaf, title: "Sustainable Practices", text: "We're committed to responsible sourcing and eco-conscious production." },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gold-card rounded-2xl p-8 text-center"
            >
              <Icon className="mx-auto mb-4 text-gold-400" size={32} />
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm text-cream/55">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
