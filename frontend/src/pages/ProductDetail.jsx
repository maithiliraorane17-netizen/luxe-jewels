import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { formatPrice } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";

const tabs = ["Description", "Details", "Reviews"];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/slug/${slug}`).then((res) => {
      setProduct(res.data);
      api.get(`/reviews/product/${res.data._id}`).then((r) => setReviews(r.data));
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader full />;
  if (!product) return <p className="py-24 text-center">Product not found.</p>;

  const wished = isWishlisted(product._id);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gold-900/10 to-ink-900 shadow-soft"
          >
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-3xl text-gold-300">LuxeJewels</span>
              </div>
            )}
          </motion.div>
          {product.images?.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                    activeImg === i ? "border-gold-500" : "border-transparent"
                  }`}
                >
                  <img src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          {product.designer && <p className="text-xs uppercase tracking-[0.3em] text-gold-400">{product.designer}</p>}
          <h1 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Star size={16} className="fill-gold-500 text-gold-500" />
              {product.ratingsAverage || "New"} {product.ratingsCount > 0 && `(${product.ratingsCount} reviews)`}
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-semibold text-cream">{formatPrice(product.discountPrice)}</span>
                <span className="text-lg text-cream/25 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-semibold text-cream">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mt-6 text-cream/65">{product.shortDescription || product.description.slice(0, 160)}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-cream/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3"><Minus size={16} /></button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3"><Plus size={16} /></button>
            </div>
            <Button
              variant="gold"
              className="flex-1"
              onClick={() => {
                addItem(product, qty);
                toast.success("Added to bag");
              }}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={16} /> {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
            </Button>
            <button
              onClick={() => {
                toggle(product._id);
                toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/15"
            >
              <Heart size={18} className={wished ? "fill-gold-500 text-gold-500" : ""} />
            </button>
          </div>

          <div className="mt-8 flex gap-6 text-xs text-cream/50">
            <span className="flex items-center gap-2"><Truck size={16} className="text-gold-400" /> Free insured shipping</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-gold-400" /> Certified authentic</span>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-t border-cream/10 pt-6">
            <div className="flex gap-6">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 text-sm font-medium ${
                    tab === t ? "border-b-2 border-gold-500 text-cream" : "text-cream/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="pt-6 text-sm text-cream/65"
              >
                {tab === "Description" && <p>{product.description}</p>}
                {tab === "Details" && (
                  <ul className="space-y-2">
                    <li><strong>Metal:</strong> {product.metalType || "—"}</li>
                    <li><strong>Gemstone:</strong> {product.gemstone || "—"}</li>
                    <li><strong>Style:</strong> {product.style || "—"}</li>
                    <li><strong>Dimensions:</strong> {product.dimensions || "—"}</li>
                    <li><strong>Weight:</strong> {product.weight || "—"}</li>
                    <li><strong>Care:</strong> {product.careInstructions || "Store in a dry place, away from direct sunlight."}</li>
                  </ul>
                )}
                {tab === "Reviews" && (
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p>No reviews yet. Be the first to share your thoughts.</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r._id} className="border-b border-cream/10 pb-3">
                          <div className="flex items-center gap-2 font-medium text-cream">
                            {r.user?.name}
                            <span className="flex items-center gap-1 text-xs text-gold-400">
                              <Star size={12} className="fill-gold-500" /> {r.rating}
                            </span>
                          </div>
                          <p className="mt-1">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
