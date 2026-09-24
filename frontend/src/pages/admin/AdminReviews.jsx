import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/ui/Loader";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/reviews").then((res) => setReviews(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const moderate = async (id, isApproved) => {
    await api.put(`/reviews/${id}`, { isApproved });
    toast.success(isApproved ? "Review approved" : "Review hidden");
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    toast.success("Review deleted");
    load();
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Reviews</h1>
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{r.user?.name} <span className="text-ink-700/40">on</span> {r.product?.name}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gold-600">
                  {Array.from({ length: r.rating }).map((_, idx) => <Star key={idx} size={12} className="fill-gold-500" />)}
                </div>
              </div>
              <div className="flex gap-2">
                {!r.isApproved && (
                  <button onClick={() => moderate(r._id, true)} className="rounded-full bg-green-100 p-2 text-green-700"><Check size={14} /></button>
                )}
                {r.isApproved && (
                  <button onClick={() => moderate(r._id, false)} className="rounded-full bg-yellow-100 p-2 text-yellow-700"><X size={14} /></button>
                )}
                <button onClick={() => remove(r._id)} className="rounded-full bg-rose-100 p-2 text-rose-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-700/70">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
