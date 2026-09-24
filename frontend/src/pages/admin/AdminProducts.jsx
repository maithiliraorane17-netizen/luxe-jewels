import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, ImagePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

const emptyForm = {
  name: "", description: "", shortDescription: "", price: "", category: "",
  metalType: "Gold", gemstone: "", style: "", stock: 0, isFeatured: false, isNewArrival: false, images: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/products?limit=100"), api.get("/categories")])
      .then(([p, c]) => { setProducts(p.data.products); setCategories(c.data); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, category: p.category?._id || p.category });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/products", form);
        toast.success("Product created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving product");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product removed");
    load();
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("images", f));
      const res = await api.post("/products/upload-images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, images: [...(f.images || []), ...res.data.urls] }));
      toast.success("Image(s) uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed — check Cloudinary keys in .env");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) => {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Products</h1>
        <Button variant="gold" onClick={openNew}><Plus size={16} /> Add Product</Button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-50 text-xs uppercase tracking-wider text-ink-700/60">
            <tr>
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-t border-ink-900/5 hover:bg-gold-50/40"
              >
                <td className="px-5 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-gold-50">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] text-gold-300">No image</div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 text-ink-700/70">{p.category?.name}</td>
                <td className="px-5 py-3">{formatPrice(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.stock <= 5 ? "bg-rose-100 text-rose-600" : "bg-green-100 text-green-700"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(p)} className="text-ink-700/60 hover:text-gold-600"><Pencil size={16} /></button>
                    <button onClick={() => remove(p._id)} className="text-ink-700/60 hover:text-rose-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={submit}
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl">{editing ? "Edit Product" : "New Product"}</h3>
                <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-700/60">Product Images</label>
                  <div className="flex flex-wrap gap-3">
                    {(form.images || []).map((img) => (
                      <div key={img} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-ink-900/15">
                        <img src={img} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-ink-900/20 text-ink-700/50 hover:border-gold-400 hover:text-gold-600">
                      {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                      <span className="text-[10px]">{uploading ? "Uploading…" : "Add"}</span>
                      <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
                <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <input placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                  <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                </div>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm">
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select value={form.metalType} onChange={(e) => setForm({ ...form, metalType: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm">
                  {["Gold", "Silver", "Platinum", "Rose Gold", "White Gold"].map((m) => <option key={m}>{m}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Gemstone" value={form.gemstone} onChange={(e) => setForm({ ...form, gemstone: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                  <input placeholder="Style" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm" />
                </div>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} /> New Arrival</label>
                </div>
              </div>
              <Button type="submit" variant="gold" className="mt-5 w-full">{editing ? "Update Product" : "Create Product"}</Button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
