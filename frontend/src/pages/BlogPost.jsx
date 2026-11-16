import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import SplitText from "../components/fx/SplitText";
import Reveal from "../components/fx/Reveal";
import Loader from "../components/ui/Loader";
import { GALLERY, u } from "../utils/images";

export default function BlogPost() {
  const { slug } = useParams();
  const [b, setB] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get(`/blogs/${slug}`).then((r) => setB(r.data)).catch(() => setB(null)).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <Loader full />;
  if (!b) return <div className="py-40 text-center"><p className="font-display text-4xl">Article not found</p><Link to="/blog" className="mt-6 inline-block text-gold-300">Back to journal</Link></div>;
  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 pt-14 sm:px-10">
      <Link to="/blog" className="text-xs uppercase tracking-widest text-cream/40 underline-grow hover:text-gold-300">← Journal</Link>
      <p className="mt-10 text-xs uppercase tracking-widest text-gold-400">{new Date(b.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}{b.author?.name && ` · ${b.author.name}`}</p>
      <SplitText as="h1" immediate text={b.title} className="mt-4 font-display text-4xl leading-tight sm:text-6xl" />
      <Reveal delay={0.2}><div className="mt-10 aspect-[16/9] overflow-hidden rounded-3xl"><img src={b.coverImage || u(GALLERY[0], 1200)} alt="" className="h-full w-full object-cover" /></div></Reveal>
      <div className="mt-12 space-y-6 text-lg leading-relaxed text-cream/65">{b.content.split(/\n+/).map((p, i) => <Reveal key={i}><p>{p}</p></Reveal>)}</div>
    </article>
  );
}
