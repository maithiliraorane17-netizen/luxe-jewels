import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import api from "../api/axios";
import { useWishlistStore } from "../store/wishlistStore";
import ProductCard from "../components/product/ProductCard";
import SplitText from "../components/fx/SplitText";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";

export default function Wishlist() {
  const ids = useWishlistStore((s) => s.ids);
  const [map, setMap] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const missing = ids.filter((id) => !map[id]);
    if (!missing.length) return setLoading(false);
    Promise.all(missing.map((id) => api.get(`/products/${id}`).then((r) => r.data).catch(() => null)))
      .then((res) => setMap((m) => ({ ...m, ...Object.fromEntries(res.filter(Boolean).map((p) => [p._id, p])) })))
      .finally(() => setLoading(false));
  }, [ids]);
  const products = ids.map((id) => map[id]).filter(Boolean);
  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-14 sm:px-10">
      <SplitText as="h1" immediate text="My *wishlist*" className="mb-14 font-display text-5xl sm:text-7xl" />
      {loading ? <Loader /> : products.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-24 text-center"><Heart size={52} className="text-gold-400/40" strokeWidth={1} /><p className="font-display text-3xl">Nothing saved yet</p><Link to="/products"><Button>Discover pieces</Button></Link></div>
      ) : <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">{products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>}
    </div>
  );
}
