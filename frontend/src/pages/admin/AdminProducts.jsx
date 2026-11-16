import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, ImagePlus, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";

const METALS = ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold"];
const EMPTY = { name: "", description: "", shortDescription: "", price: "", discountPrice: "", category: "", designer: "", metalType: "Gold", gemstone: "", style: "", dimensions: "", weight: "", careInstructions: "", stock: 0, isFeatured: false, isNewArrival: false, images: [] };

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  const load = () => Promise.all([api.get("/products?limit=200"), api.get("/categories")]).then(([p, c]) => { setList(p.data.products); setCats(c.data); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const shown = useMemo(() => list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())), [list, q]);

  const openNew = () => { setEditing(null); setF({ ...EMPTY, category: cats[0]?._id || "" }); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setF({ ...EMPTY, ...p, category: p.category?._id || p.category, discountPrice: p.discountPrice || "" }); setOpen(true); };

  const upload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData(); files.forEach((x) => fd.append("images", x));
      const { data } = await api.post("/products/upload-images", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setF((s) => ({ ...s, images: [...s.images, ...data.urls] })); toast.success("Uploaded");
    } catch (err) { toast.error(err.response?.data?.message || "Upload failed — check Cloudinary keys"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const save = async (e) => {
    e.preventDefault();
    const { _id, createdAt, updatedAt, __v, slug, ratingsAverage, ratingsCount, collections, ...body } = f;
    body.price = Number(body.price); body.stock = Number(body.stock);
    body.discountPrice = body.discountPrice ? Number(body.discountPrice) : undefined;
    try {
      if (editing) await api.put(`/products/${editing._id}`, body); else await api.post("/products", body);
      toast.success(editing ? "Product updated" : "Product created"); setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Error saving"); }
  };
  const del = async (id) => { if (!confirm("Delete this product?")) return; await api.delete(`/products/${id}`); toast.success("Deleted"); load(); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  if (loading) return <Loader full />;
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold">Products <span className="text-lg text-black/35">({list.length})</span></h1>
        <div className="flex gap-3">
          <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" /><input className="field pl-9" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm text-white hover:bg-gold-600"><Plus size={16} /> Add</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#faf6ec] text-xs uppercase tracking-wider text-black/50"><tr>{["", "Name", "Category", "Metal", "Price", "Stock", ""].map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{shown.map((p) => (
            <tr key={p._id} className="border-t border-black/5 hover:bg-[#faf6ec]/50">
              <td className="px-4 py-3"><div className="h-12 w-12 overflow-hidden rounded-lg bg-black/5">{p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}</div></td>
              <td className="px-4 py-3 font-medium">{p.name}</td><td className="px-4 py-3 text-black/60">{p.category?.name}</td><td className="px-4 py-3 text-black/60">{p.metalType}</td>
              <td className="px-4 py-3">{formatPrice(p.price)}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs ${p.stock <= 5 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"}`}>{p.stock}</span></td>
              <td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => openEdit(p)} className="text-black/40 hover:text-gold-600"><Pencil size={16} /></button><button onClick={() => del(p._id)} className="text-black/40 hover:text-rose-500"><Trash2 size={16} /></button></div></td>
            </tr>))}</tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} wide dark={false}>
        <form onSubmit={save} className="space-y-3 p-7">
          <h3 className="font-display text-2xl">{editing ? "Edit product" : "New product"}</h3>
          <div className="flex flex-wrap gap-3">
            {f.images.map((im) => <div key={im} className="group relative h-20 w-20 overflow-hidden rounded-lg"><img src={im} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => setF({ ...f, images: f.images.filter((x) => x !== im) })} className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white group-hover:flex"><X size={12} /></button></div>)}
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/20 text-black/40 hover:border-gold-500">{uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}<span className="text-[10px]">Add</span><input type="file" accept="image/*" multiple hidden onChange={upload} disabled={uploading} /></label>
          </div>
          <input required className="field" placeholder="Name" value={f.name} onChange={set("name")} />
          <textarea required rows={3} className="field" placeholder="Description" value={f.description} onChange={set("description")} />
          <input className="field" placeholder="Short description" value={f.shortDescription} onChange={set("shortDescription")} />
          <div className="grid grid-cols-3 gap-3"><input required type="number" className="field" placeholder="Price" value={f.price} onChange={set("price")} /><input type="number" className="field" placeholder="Discount price" value={f.discountPrice} onChange={set("discountPrice")} /><input type="number" className="field" placeholder="Stock" value={f.stock} onChange={set("stock")} /></div>
          <div className="grid grid-cols-2 gap-3"><select required className="field" value={f.category} onChange={set("category")}><option value="">Category</option>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select><select className="field" value={f.metalType} onChange={set("metalType")}>{METALS.map((m) => <option key={m}>{m}</option>)}</select></div>
          <div className="grid grid-cols-3 gap-3"><input className="field" placeholder="Gemstone" value={f.gemstone} onChange={set("gemstone")} /><input className="field" placeholder="Style" value={f.style} onChange={set("style")} /><input className="field" placeholder="Designer" value={f.designer} onChange={set("designer")} /></div>
          <div className="grid grid-cols-2 gap-3"><input className="field" placeholder="Dimensions" value={f.dimensions} onChange={set("dimensions")} /><input className="field" placeholder="Weight" value={f.weight} onChange={set("weight")} /></div>
          <textarea rows={2} className="field" placeholder="Care instructions" value={f.careInstructions} onChange={set("careInstructions")} />
          <div className="flex gap-6 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={f.isFeatured} onChange={set("isFeatured")} /> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={f.isNewArrival} onChange={set("isNewArrival")} /> New arrival</label></div>
          <button className="w-full rounded-lg bg-ink-900 py-3 text-sm font-medium text-white hover:bg-gold-600">{editing ? "Update product" : "Create product"}</button>
        </form>
      </Modal>
    </div>
  );
}
