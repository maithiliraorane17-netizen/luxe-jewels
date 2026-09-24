import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useWishlistStore } from "../store/wishlistStore";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

export default function Wishlist() {
  const { ids } = useWishlistStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return; }
    Promise.all(ids.map((id) => api.get(`/products/${id}`).then((r) => r.data).catch(() => null)))
      .then((res) => setProducts(res.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 font-display text-3xl font-semibold">
        My Wishlist
      </motion.h1>
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="text-cream/50">Your wishlist is empty. Start adding pieces you love.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
