import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Trophy, Plus, Pencil, Trash2, X, Loader2, BadgeCheck } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from "../api/achievementApi";

const inputClass = "app-input";
const emptyForm = { title: "", description: "", category: "", file: null };

const categoryColors = {
  Competition: "bg-amber-50 text-amber-700 border-amber-100",
  Award: "bg-violet-50 text-violet-700 border-violet-100",
  Recognition: "bg-blue-50 text-blue-700 border-blue-100",
  Academic: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { setItems(await getAchievements()); }
    catch { toast.error("Failed to load achievements"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm((prev) => ({ ...prev, file: e.target.files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("category", form.category.trim());
      if (form.file) fd.append("proofFile", form.file);

      if (editingId) {
        const updated = await updateAchievement(editingId, fd);
        setItems((prev) => prev.map((a) => (a._id === editingId ? updated : a)));
        toast.success("Achievement updated!");
        setEditingId(null);
      } else {
        const created = await createAchievement(fd);
        setItems((prev) => [created, ...prev]);
        toast.success("Achievement added!");
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally { setSubmitting(false); }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({ title: item.title, description: item.description, category: item.category || "", file: null });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await deleteAchievement(id);
      setItems((prev) => prev.filter((a) => a._id !== id));
      toast.success("Achievement deleted.");
    } catch { toast.error("Delete failed."); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Achievements</h1>
          <p className="text-slate-600 mt-1">Showcase your awards, competitions, and recognitions.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
          <Plus size={18} /> Add Achievement
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="app-card mb-8 overflow-hidden p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <Trophy size={20} className="text-amber-600" />
                {editingId ? "Edit Achievement" : "Add Achievement"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="text-slate-400 hover:text-slate-950 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="app-label">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. 1st Place Hackathon" className={inputClass} required />
                </div>
                <div>
                  <label className="app-label">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                    <option value="">Select Category</option>
                    <option>Competition</option>
                    <option>Award</option>
                    <option>Recognition</option>
                    <option>Academic</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="app-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder="Describe your achievement..." className={`${inputClass} resize-none`} required />
              </div>
              <div className="mb-5">
                <label className="app-label">Upload Proof (PDF/Image)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange}
                  className={`${inputClass} cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700`} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition px-6 py-3 rounded-xl text-white font-semibold text-sm">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Saving..." : editingId ? "Update" : "Add Achievement"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                  className="app-button-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader /></div>
      ) : items.length === 0 ? (
        <div className="app-card p-16 text-center">
          <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-950 mb-2">No Achievements Yet</h2>
          <p className="text-slate-600">Add your first achievement to showcase your talent.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="app-card p-5 transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
                    {item.verified && (
                      <span className="flex items-center gap-1 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">{item.description}</p>
                  {item.category && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColors[item.category] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-slate-600">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
