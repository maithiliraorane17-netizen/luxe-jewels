import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "" });

  const load = () => {
    setLoading(true);
    api.get("/blogs").then((res) => setBlogs(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/blogs", form);
      toast.success("Article published");
      setShowForm(false);
      setForm({ title: "", excerpt: "", content: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this article?")) return;
    await api.delete(`/blogs/${id}`);
    toast.success("Article removed");
    load();
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Blog</h1>
        <Button variant="gold" onClick={() => setShowForm(true)}><Plus size={16} /> New Article</Button>
      </div>

      <div className="space-y-4">
        {blogs.map((b, i) => (
          <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-soft">
            <div>
              <h3 className="font-display text-lg">{b.title}</h3>
              <p className="text-sm text-ink-700/60">{b.excerpt}</p>
            </div>
            <button onClick={() => remove(b._id)} className="text-ink-700/40 hover:text-rose-500"><Trash2 size={16} /></button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4" onClick={() => setShowForm(false)}>
            <motion.form initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-cream p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl">New Article</h3>
                <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <input placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <textarea required rows={6} placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
              </div>
              <Button type="submit" variant="gold" className="mt-5 w-full">Publish Article</Button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
