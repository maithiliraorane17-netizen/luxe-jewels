import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import toast from "react-hot-toast";

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wished = isWishlisted(product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} added to bag`);
  };

  const handleWish = (e) => {
    e.preventDefault();
    toggle(product._id);
    toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="gold-card relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900">
          {product.images?.[0] ? (
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
              <span className="font-display text-2xl text-gold-500/40">LuxeJewels</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {product.isNewArrival && (
            <span className="absolute left-3 top-3 rounded-full border border-gold-400/40 bg-ink-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-300 backdrop-blur">
              New
            </span>
          )}

          <motion.button
            onClick={handleWish}
            whileTap={{ scale: 0.85 }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass-dark"
          >
            <Heart size={16} className={wished ? "fill-gold-400 text-gold-400" : "text-cream"} />
          </motion.button>

          <motion.div
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            className="absolute inset-x-0 bottom-0 flex justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-900 shadow-gold"
            >
              <ShoppingBag size={14} /> Add to Bag
            </motion.button>
          </motion.div>
        </div>

        <div className="mt-4 space-y-1">
          {product.designer && <p className="text-xs uppercase tracking-widest text-gold-400/80">{product.designer}</p>}
          <h3 className="font-display text-lg text-cream">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-cream/60">
              {product.discountPrice ? (
                <>
                  <span className="mr-2 text-cream/30 line-through">{formatPrice(product.price)}</span>
                  <span className="font-semibold text-gold-300">{formatPrice(product.discountPrice)}</span>
                </>
              ) : (
                <span className="font-semibold text-gold-300">{formatPrice(product.price)}</span>
              )}
            </p>
            {product.ratingsCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-cream/50">
                <Star size={12} className="fill-gold-400 text-gold-400" /> {product.ratingsAverage}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
