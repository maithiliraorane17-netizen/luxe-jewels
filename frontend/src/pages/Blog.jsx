import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import api from "../api/axios";
import SplitText from "../components/fx/SplitText";
import Reveal from "../components/fx/Reveal";
import Loader from "../components/ui/Loader";
import { GALLERY, u } from "../utils/images";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/blogs").then((r) => setPosts(r.data)).finally(() => setLoading(false)); }, []);
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-14 sm:px-10">
      <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-gold-400">The journal</p>
      <SplitText as="h1" immediate text="Stories & *inspiration*" className="font-display text-5xl sm:text-8xl" />
      {loading ? <Loader full /> : posts.length === 0 ? <p className="mt-20 text-cream/50">No articles yet — check back soon.</p> : (
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((b, i) => (
            <Reveal key={b._id} delay={(i % 3) * 0.1}>
              <Link to={`/blog/${b.slug}`} data-cursor="view" data-cursor-label="Read" className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-ink-800"><img src={b.coverImage || u(GALLERY[i % GALLERY.length], 800)} alt="" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" /></div>
                <p className="mt-5 text-xs uppercase tracking-widest text-cream/35">{new Date(b.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</p>
                <h3 className="mt-2 flex items-start justify-between gap-3 font-display text-2xl transition-colors group-hover:text-gold-200">{b.title}<ArrowUpRight className="mt-1 flex-shrink-0 text-gold-400 opacity-0 transition group-hover:opacity-100" size={20} /></h3>
                <p className="mt-2 text-sm text-cream/50 line-clamp-2">{b.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
