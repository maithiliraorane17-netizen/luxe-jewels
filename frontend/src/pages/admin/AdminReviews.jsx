import { useEffect, useState } from "react";
import { Check, EyeOff, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/ui/Loader";

export default function AdminReviews() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState({});
  const load = () => api.get("/reviews").then((r) => setList(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const mod = async (id, body) => { await api.put(`/reviews/${id}`, body); toast.success("Updated"); load(); };
  const del = async (id) => { if (!confirm("Delete review?")) return; await api.delete(`/reviews/${id}`); load(); };
  if (loading) return <Loader full />;
  return (
    <div>
      <h1 className="mb-6 font-display text-4xl font-semibold">Reviews</h1>
      <div className="space-y-4">
        {list.length === 0 && <p className="text-black/50">No reviews yet.</p>}
        {list.map((r) => (
          <div key={r._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-medium">{r.user?.name} <span className="text-black/40">on</span> {r.product?.name}</p><div className="mt-1 flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={13} className="fill-gold-500 text-gold-500" />)}</div></div>
              <div className="flex gap-2">
                <button onClick={() => mod(r._id, { isApproved: !r.isApproved })} title={r.isApproved ? "Hide" : "Approve"} className={`rounded-full p-2 ${r.isApproved ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}>{r.isApproved ? <EyeOff size={14} /> : <Check size={14} />}</button>
                <button onClick={() => del(r._id)} className="rounded-full bg-rose-100 p-2 text-rose-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="mt-3 text-sm text-black/65">{r.comment}</p>
            {r.adminReply && <p className="mt-3 rounded-lg bg-[#faf6ec] p-3 text-xs">Your reply: {r.adminReply}</p>}
            <div className="mt-3 flex gap-2"><input className="field" placeholder="Reply publicly…" value={reply[r._id] || ""} onChange={(e) => setReply({ ...reply, [r._id]: e.target.value })} /><button onClick={() => { mod(r._id, { adminReply: reply[r._id] }); setReply({ ...reply, [r._id]: "" }); }} className="rounded-lg bg-ink-900 px-4 text-sm text-white hover:bg-gold-600">Reply</button></div>
          </div>))}
      </div>
    </div>
  );
}
