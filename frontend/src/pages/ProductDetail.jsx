import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { formatPrice, COD_LIMIT } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import { useRecentStore } from "../store/recentStore";
import { useUI } from "../store/uiStore";
import Button from "../components/ui/Button";
import Stars from "../components/ui/Stars";
import Accordion from "../components/ui/Accordion";
import Loader from "../components/ui/Loader";
import Magnetic from "../components/fx/Magnetic";
import SectionHeading from "../components/ui/SectionHeading";
import ProductCard from "../components/product/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState("");
  const ctaRef = useRef(null);
  const ctaVisible = useInView(ctaRef);

  const addItem = useCartStore((s) => s.addItem);
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const addRecent = useRecentStore((s) => s.add);
  const recent = useRecentStore((s) => s.items);
  const openCart = useUI((s) => s.openCart);
  const user = useAuthStore((s) => s.user);

  const loadReviews = (id) => api.get(`/reviews/product/${id}`).then((r) => setReviews(r.data)).catch(() => {});

  useEffect(() => {
    setLoading(true); setImg(0); setQty(1);
    api.get(`/products/slug/${slug}`).then((r) => {
      const p = r.data;
      setProduct(p); addRecent(p); loadReviews(p._id);
      api.get(`/products?category=${p.category?._id || p.category}&limit=5`).then((x) => setRelated(x.data.products.filter((y) => y._id !== p._id).slice(0, 4))).catch(() => {});
    }).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader full />;
  if (!product) return <div className="py-40 text-center"><p className="font-display text-4xl">Piece not found</p><Link to="/products" className="mt-6 inline-block text-gold-300 underline-grow">Back to shop</Link></div>;

  const wished = ids.includes(product._id);
  const price = product.discountPrice || product.price;
  const soldOut = product.stock === 0;
  const images = product.images?.length ? product.images : [];
  const avg = Number(product.ratingsAverage) || 0;

  const add = () => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); toast.success("Added to bag"); openCart(); };
  const checkPin = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) return toast.error("Enter a valid 6-digit pincode");
    setEta(new Date(Date.now() + 4 * 864e5).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
  };
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-8 sm:px-10">
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-cream/40">
        <Link to="/" className="hover:text-gold-300">Home</Link> / <Link to="/products" className="hover:text-gold-300">Shop</Link> / <span className="text-cream/70">{product.category?.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] xl:gap-20">
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
            {images.map((im, i) => <button key={i} onClick={() => setImg(i)} className={`h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-20 ${i === img ? "border-gold-400" : "border-transparent opacity-50 hover:opacity-100"}`}><img src={im} alt="" className="h-full w-full object-cover" /></button>)}
          </div>
          <div data-cursor="view" data-cursor-label="Zoom" onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))} onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }} className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[28px] bg-ink-800 ring-1 ring-gold-400/15">
            <AnimatePresence mode="wait">
              <motion.img key={img} src={images[img]} alt={product.name} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
            {images[img] && <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: zoom.on ? 1 : 0, backgroundImage: `url(${images[img]})`, backgroundSize: "230%", backgroundPosition: `${zoom.x}% ${zoom.y}%` }} />}
            {product.isNewArrival && <span className="absolute left-5 top-5 rounded-full border border-gold-400/40 bg-ink-950/70 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-300 backdrop-blur">New</span>}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.designer && <p className="text-[11px] uppercase tracking-[0.35em] text-gold-400">{product.designer}</p>}
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3"><Stars value={avg} size={16} /><span className="text-sm text-cream/45">{avg ? `${avg.toFixed(1)} · ${product.ratingsCount} review${product.ratingsCount === 1 ? "" : "s"}` : "No reviews yet"}</span></div>
          <div className="mt-7 flex items-baseline gap-4"><span className="font-display text-4xl text-gold-200">{formatPrice(price)}</span>{product.discountPrice && <span className="text-lg text-cream/30 line-through">{formatPrice(product.price)}</span>}</div>
          <p className="mt-1 text-xs text-cream/40">or {formatPrice(Math.round(price / 6))}/month for 6 months · inclusive of taxes</p>
          <p className="mt-6 leading-relaxed text-cream/60">{product.shortDescription || product.description}</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[["Metal", product.metalType], ["Stone", product.gemstone], ["Style", product.style]].map(([k, v]) => <div key={k} className="rounded-2xl border border-cream/10 px-3 py-3"><p className="text-[10px] uppercase tracking-widest text-cream/35">{k}</p><p className="mt-1 text-sm text-gold-200">{v || "—"}</p></div>)}
          </div>
          <p className={`mt-6 flex items-center gap-2 text-xs ${soldOut ? "text-rose-400" : product.stock <= 5 ? "text-amber-300" : "text-emerald-400"}`}>
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-current" /><span className="relative inline-flex h-2 w-2 rounded-full bg-current" /></span>
            {soldOut ? "Currently sold out" : product.stock <= 5 ? `Only ${product.stock} left — order soon` : "In stock — ready to ship"}
          </p>

          <div ref={ctaRef} className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-cream/20">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-4 text-cream/60 hover:text-gold-300"><Minus size={15} /></button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} className="p-4 text-cream/60 hover:text-gold-300"><Plus size={15} /></button>
            </div>
            <Magnetic className="flex-1" strength={0.15}>
              <Button size="lg" className="w-full" onClick={add} disabled={soldOut}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={added ? "a" : "b"} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="flex items-center gap-2">
                    {added ? <><Check size={16} /> Added to bag</> : <><ShoppingBag size={16} /> {soldOut ? "Sold out" : "Add to bag"}</>}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </Magnetic>
            <button aria-label="Wishlist" onClick={() => { toggle(product._id); toast.success(wished ? "Removed from wishlist" : "Saved to wishlist"); }} className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-cream/20 transition hover:border-gold-400">
              <motion.span key={String(wished)} animate={{ scale: [0.5, 1.35, 1] }}><Heart size={20} className={wished ? "fill-gold-400 text-gold-400" : ""} /></motion.span>
            </button>
          </div>
          <Button variant="outline" size="lg" className="mt-3 w-full" disabled={soldOut} onClick={() => { addItem(product, qty); navigate(user ? "/checkout" : "/login?redirect=/checkout"); }}>Buy it now</Button>

          <form onSubmit={checkPin} className="mt-6 flex items-center gap-3 rounded-2xl border border-cream/10 p-2 pl-5">
            <Truck size={16} className="text-gold-400" />
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter pincode for delivery date" className="flex-1 bg-transparent text-sm outline-none placeholder:text-cream/30" />
            <button className="rounded-full bg-cream/10 px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-gold-400 hover:text-ink-950">Check</button>
          </form>
          <AnimatePresence>{eta && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-emerald-400">Free insured delivery by {eta}{price <= COD_LIMIT ? " · Cash on Delivery available" : ""}</motion.p>}</AnimatePresence>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-cream/50">
            <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-gold-400" /> Certified authentic</span>
            <span className="flex items-center gap-2"><RotateCcw size={15} className="text-gold-400" /> 30-day returns</span>
            <span className="flex items-center gap-2"><Banknote size={15} className="text-gold-400" /> UPI · Cards · COD</span>
          </div>

          <Accordion className="mt-10" items={[
            { title: "Description", content: product.description },
            { title: "Details & dimensions", content: <ul className="space-y-1"><li>Metal: {product.metalType || "—"}</li><li>Gemstone: {product.gemstone || "—"}</li><li>Dimensions: {product.dimensions || "—"}</li><li>Weight: {product.weight || "—"}</li><li>SKU: {product.sku || product._id.slice(-8).toUpperCase()}</li></ul> },
            { title: "Care instructions", content: product.careInstructions || "Store separately in the supplied pouch, away from moisture and direct sunlight. Clean gently with a soft cloth; avoid contact with perfumes and chemicals." },
            { title: "Shipping, payment & returns", content: `Free insured shipping on orders above ₹20,000. Delivered in 3–5 business days in signature packaging. Pay with UPI, cards or netbanking — or choose Cash on Delivery for orders up to ${formatPrice(COD_LIMIT)}. Easy 30-day returns on unworn pieces.` },
          ]} defaultOpen={0} />
        </div>
      </div>

      <section className="mt-32 grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <SectionHeading align="left" eyebrow="Reviews" title="What clients *say*" />
          <div className="mt-10 flex items-center gap-6"><p className="font-display text-7xl gold-text">{avg ? avg.toFixed(1) : "–"}</p><div><Stars value={avg} size={18} /><p className="mt-1 text-xs text-cream/40">{product.ratingsCount} review{product.ratingsCount === 1 ? "" : "s"}</p></div></div>
          <div className="mt-6 space-y-2">
            {dist.map(({ n, c }) => <div key={n} className="flex items-center gap-3 text-xs text-cream/50"><span className="w-3">{n}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10"><motion.div initial={{ width: 0 }} whileInView={{ width: reviews.length ? `${(c / reviews.length) * 100}%` : 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-gold-400" /></div><span className="w-4">{c}</span></div>)}
          </div>
          <ReviewForm productId={product._id} user={user} onDone={() => loadReviews(product._id)} />
        </div>
        <div className="space-y-6">
          {reviews.length === 0 ? <p className="text-cream/45">No reviews yet — be the first to share your thoughts.</p> : reviews.map((r) => (
            <div key={r._id} className="gold-card rounded-3xl p-6">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 font-display text-ink-950">{r.user?.name?.[0] || "G"}</span><div><p className="text-sm font-medium">{r.user?.name || "Guest"}</p><Stars value={r.rating} size={12} /></div></div><span className="text-xs text-cream/30">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span></div>
              {r.title && <p className="mt-4 font-display text-lg">{r.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-cream/60">{r.comment}</p>
              {r.adminReply && <p className="mt-4 rounded-xl bg-gold-400/10 p-3 text-xs text-gold-200"><b>LuxeJewels:</b> {r.adminReply}</p>}
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && <section className="mt-32"><SectionHeading eyebrow="Complete the look" title="You may also *love*" /><div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">{related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div></section>}

      {recent.filter((r) => r._id !== product._id).length > 0 && (
        <section className="mt-28">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400">Recently viewed</p>
          <div className="no-scrollbar flex gap-4 overflow-x-auto">
            {recent.filter((r) => r._id !== product._id).map((r) => (
              <Link key={r._id} to={`/products/${r.slug}`} className="gold-card flex w-64 flex-shrink-0 items-center gap-3 rounded-2xl p-3">
                <div className="h-20 w-16 overflow-hidden rounded-xl bg-ink-800">{r.image && <img src={r.image} alt="" className="h-full w-full object-cover" />}</div>
                <div><p className="font-display leading-snug">{r.name}</p><p className="mt-1 text-sm text-gold-300">{formatPrice(r.price)}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {!ctaVisible && !soldOut && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.4 }} className="glass-dark fixed inset-x-0 bottom-0 z-[90] flex items-center justify-between gap-4 px-5 py-3 lg:hidden">
            <div><p className="line-clamp-1 text-sm">{product.name}</p><p className="font-semibold text-gold-300">{formatPrice(price)}</p></div>
            <Button size="sm" onClick={add}><ShoppingBag size={14} /> Add</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewForm({ productId, user, onDone }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  if (!user) return <p className="mt-10 text-sm text-cream/50"><Link to="/login" className="text-gold-300 underline-grow">Sign in</Link> to write a review.</p>;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await api.post("/reviews", { productId, rating, title, comment }); toast.success("Thank you for your review!"); setTitle(""); setComment(""); onDone(); }
    catch (err) { toast.error(err.response?.data?.message || "Could not submit review"); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="gold-card mt-10 space-y-4 rounded-3xl p-6">
      <p className="font-display text-xl">Write a review</p>
      <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setRating(n)} className={`text-2xl transition hover:scale-125 ${n <= rating ? "text-gold-400" : "text-cream/20"}`}>★</button>)}</div>
      <input className="input-dark" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea required rows={4} className="input-dark" placeholder="Share your experience…" value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button disabled={busy}>{busy ? "Submitting…" : "Submit review"}</Button>
    </form>
  );
}
