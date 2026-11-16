import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/ui/Loader";

export default function AdminUsers() {
  const me = useAuthStore((s) => s.user);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get("/auth/users").then((r) => setList(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const upd = async (id, body) => { await api.put(`/auth/users/${id}`, body); toast.success("Updated"); load(); };
  const del = async (id) => { if (!confirm("Remove this user?")) return; await api.delete(`/auth/users/${id}`); load(); };
  if (loading) return <Loader full />;
  return (
    <div>
      <h1 className="mb-6 font-display text-4xl font-semibold">Users <span className="text-lg text-black/35">({list.length})</span></h1>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-[#faf6ec] text-xs uppercase tracking-wider text-black/50"><tr>{["Name", "Email", "Role", "Active", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{list.map((u) => (
            <tr key={u._id} className="border-t border-black/5">
              <td className="px-4 py-3 font-medium">{u.name}</td><td className="px-4 py-3 text-black/60">{u.email}</td>
              <td className="px-4 py-3"><select disabled={u._id === me._id} value={u.role} onChange={(e) => upd(u._id, { role: e.target.value })} className="rounded-lg border border-black/10 px-2 py-1 text-xs"><option>customer</option><option>admin</option></select></td>
              <td className="px-4 py-3"><button disabled={u._id === me._id} onClick={() => upd(u._id, { isActive: !u.isActive })} className={`rounded-full px-3 py-1 text-xs ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>{u.isActive ? "Active" : "Disabled"}</button></td>
              <td className="px-4 py-3">{u._id !== me._id && <button onClick={() => del(u._id)} className="text-black/30 hover:text-rose-500"><Trash2 size={16} /></button>}</td>
            </tr>))}</tbody></table>
      </div>
    </div>
  );
}
