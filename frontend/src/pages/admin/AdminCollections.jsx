import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", designer: "", isFeatured: false });

  const load = () => {
    setLoading(true);
    api.get("/collections").then((res) => setCollections(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/collections", form);
      toast.success("Collection created");
      setShowForm(false);
      setForm({ name: "", description: "", designer: "", isFeatured: false });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this collection?")) return;
    await api.delete(`/collections/${id}`);
    toast.success("Collection removed");
    load();
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Collections</h1>
        <Button variant="gold" onClick={() => setShowForm(true)}><Plus size={16} /> New Collection</Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg">{c.name}</h3>
                <p className="text-xs text-ink-700/50">{c.designer}</p>
              </div>
              <button onClick={() => remove(c._id)} className="text-ink-700/40 hover:text-rose-500"><Trash2 size={16} /></button>
            </div>
            <p className="mt-2 text-sm text-ink-700/70">{c.description}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4" onClick={() => setShowForm(false)}>
            <motion.form initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-2xl bg-cream p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl">New Collection</h3>
                <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <input placeholder="Designer" value={form.designer} onChange={(e) => setForm({ ...form, designer: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
              </div>
              <Button type="submit" variant="gold" className="mt-5 w-full">Create Collection</Button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
