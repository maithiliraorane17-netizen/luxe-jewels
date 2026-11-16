import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";

const EMPTY = { title: "", excerpt: "", content: "", coverImage: "" };

export default function AdminBlog() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(EMPTY);
  const load = () => api.get("/blogs").then((r) => setList(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    try { if (editing) await api.put(`/blogs/${editing._id}`, f); else await api.post("/blogs", f); toast.success("Saved"); setOpen(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };
  const del = async (id) => { if (!confirm("Delete article?")) return; await api.delete(`/blogs/${id}`); load(); };
  if (loading) return <Loader full />;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="font-display text-4xl font-semibold">Blog</h1><button onClick={() => { setEditing(null); setF(EMPTY); setOpen(true); }} className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm text-white hover:bg-gold-600"><Plus size={16} /> New article</button></div>
      <div className="space-y-3">{list.map((b) => (
        <div key={b._id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"><div><h3 className="font-display text-lg">{b.title}</h3><p className="text-sm text-black/50">{b.excerpt}</p></div><div className="flex gap-3 text-black/40"><button onClick={() => { setEditing(b); setF({ title: b.title, excerpt: b.excerpt || "", content: b.content, coverImage: b.coverImage || "" }); setOpen(true); }} className="hover:text-gold-600"><Pencil size={16} /></button><button onClick={() => del(b._id)} className="hover:text-rose-500"><Trash2 size={16} /></button></div></div>))}</div>
      <Modal open={open} onClose={() => setOpen(false)} wide dark={false}>
        <form onSubmit={save} className="space-y-3 p-7"><h3 className="font-display text-2xl">{editing ? "Edit" : "New"} article</h3>
          <input required className="field" placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <input className="field" placeholder="Cover image URL (optional)" value={f.coverImage} onChange={(e) => setF({ ...f, coverImage: e.target.value })} />
          <input className="field" placeholder="Excerpt" value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} />
          <textarea required rows={9} className="field" placeholder="Content (blank line = new paragraph)" value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} />
          <button className="w-full rounded-lg bg-ink-900 py-3 text-sm text-white hover:bg-gold-600">Publish</button></form>
      </Modal>
    </div>
  );
}
