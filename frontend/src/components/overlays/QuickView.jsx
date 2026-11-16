import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Stars from "../ui/Stars";
import { useUI } from "../../store/uiStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/format";

export default function QuickView() {
  const product = useUI((s) => s.quickView);
  const close = useUI((s) => s.closeQuickView);
  const openCart = useUI((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);
  const [img, setImg] = useState(0);
  useEffect(() => setImg(0), [product]);
  useEffect(() => { if (product) window.__lenis?.stop(); else window.__lenis?.start(); }, [product]);

  return (
    <Modal open={!!product} onClose={close} wide>
      {product && (
        <div className="grid md:grid-cols-2">
          <div className="p-4 md:p-6">
            <div className="aspect-square overflow-hidden rounded-2xl bg-ink-800">{product.images?.[img] && <img src={product.images[img]} alt={product.name} className="h-full w-full object-cover" />}</div>
            {product.images?.length > 1 && (
              <div className="mt-3 flex gap-2">{product.images.map((im, i) => <button key={i} onClick={() => setImg(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${i === img ? "border-gold-400" : "border-transparent opacity-60"}`}><img src={im} alt="" className="h-full w-full object-cover" /></button>)}</div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400">{[product.metalType, product.gemstone].filter((x) => x && x !== "None").join(" · ")}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight">{product.name}</h2>
            <div className="mt-3 flex items-center gap-2"><Stars value={product.ratingsAverage} /><span className="text-xs text-cream/40">({product.ratingsCount || 0})</span></div>
            <p className="mt-4 text-2xl font-semibold text-gold-300">{formatPrice(product.discountPrice || product.price)}</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/55 line-clamp-4">{product.shortDescription || product.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="gold" className="flex-1" disabled={product.stock === 0} onClick={() => { addItem(product, 1); toast.success("Added to bag"); close(); openCart(); }}><ShoppingBag size={16} /> {product.stock === 0 ? "Sold out" : "Add to bag"}</Button>
              <Link to={`/products/${product.slug}`} onClick={close}><Button variant="outline" className="w-full">Full details <ArrowUpRight size={15} /></Button></Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
