import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import api from "../api/axios";
import SplitText from "../components/fx/SplitText";
import Reveal from "../components/fx/Reveal";
import Loader from "../components/ui/Loader";
import { COLLECTION_IMAGES, u } from "../utils/images";

export default function Collections() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/collections").then((r) => setList(r.data)).finally(() => setLoading(false)); }, []);
  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-24 pt-14 sm:px-10">
      <p className="mb-4 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400"><span className="h-px w-10 bg-gold-400/50" /> Signature stories</p>
      <SplitText as="h1" immediate text="Our *collections*" className="font-display text-5xl font-medium sm:text-8xl" />
      <Reveal delay={0.3}><p className="mt-6 max-w-lg text-cream/50">Each collection is a narrative — inspired by nature, heritage and modern elegance.</p></Reveal>
      {loading ? <Loader full /> : (
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {list.map((c, i) => (
            <Reveal key={c._id} delay={(i % 2) * 0.1} className={i % 2 ? "md:mt-20" : ""}>
              <Link to={`/collections/${c.slug}`} data-cursor="view" data-cursor-label="Explore" className="group relative block aspect-[4/5] overflow-hidden rounded-[32px] ring-1 ring-gold-400/15">
                <img src={u(COLLECTION_IMAGES[i % COLLECTION_IMAGES.length], 1000)} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                  <div><p className="text-[11px] uppercase tracking-[0.3em] text-gold-300">{c.designer}</p><h3 className="mt-2 font-display text-4xl sm:text-5xl">{c.name}</h3><p className="mt-2 max-w-sm text-sm text-cream/55">{c.description}</p></div>
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-gold-300/40 transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-300 group-hover:text-ink-950"><ArrowUpRight /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
