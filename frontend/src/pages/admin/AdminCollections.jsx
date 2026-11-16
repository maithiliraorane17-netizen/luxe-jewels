import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";

const EMPTY = { name: "", description: "", designer: "", isFeatured: false };

export default function AdminCollections() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(EMPTY);
  const load = () => api.get("/collections").then((r) => setList(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    try { if (editing) await api.put(`/collections/${editing._id}`, f); else await api.post("/collections", f); toast.success("Saved"); setOpen(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };
  const del = async (id) => { if (!confirm("Delete this collection?")) return; await api.delete(`/collections/${id}`); load(); };
  if (loading) return <Loader full />;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="font-display text-4xl font-semibold">Collections</h1><button onClick={() => { setEditing(null); setF(EMPTY); setOpen(true); }} className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm text-white hover:bg-gold-600"><Plus size={16} /> New</button></div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <div key={c._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex justify-between"><div><h3 className="font-display text-xl">{c.name}</h3><p className="text-xs text-black/40">{c.designer} · {c.products?.length || 0} products</p></div><div className="flex gap-3 text-black/40"><button onClick={() => { setEditing(c); setF({ name: c.name, description: c.description || "", designer: c.designer || "", isFeatured: c.isFeatured }); setOpen(true); }} className="hover:text-gold-600"><Pencil size={16} /></button><button onClick={() => del(c._id)} className="hover:text-rose-500"><Trash2 size={16} /></button></div></div>
            <p className="mt-3 text-sm text-black/60">{c.description}</p>
          </div>))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} dark={false}>
        <form onSubmit={save} className="space-y-3 p-7"><h3 className="font-display text-2xl">{editing ? "Edit" : "New"} collection</h3>
          <input required className="field" placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className="field" placeholder="Designer" value={f.designer} onChange={(e) => setF({ ...f, designer: e.target.value })} />
          <textarea rows={3} className="field" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.isFeatured} onChange={(e) => setF({ ...f, isFeatured: e.target.checked })} /> Featured</label>
          <button className="w-full rounded-lg bg-ink-900 py-3 text-sm text-white hover:bg-gold-600">Save</button></form>
      </Modal>
    </div>
  );
}
