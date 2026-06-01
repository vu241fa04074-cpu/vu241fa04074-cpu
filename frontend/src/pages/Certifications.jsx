import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Award, Plus, Pencil, Trash2, X, Loader2,
  BadgeCheck, ExternalLink, Calendar, Building,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import {
  getCertifications, createCertification,
  updateCertification, deleteCertification,
} from "../api/certificationApi";

const inputClass = "app-input";
const emptyForm = { title: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", file: null };

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCerts(); }, []);

  const fetchCerts = async () => {
    try {
      const data = await getCertifications();
      setCerts(data);
    } catch { toast.error("Failed to load certifications"); }
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
    if (!form.title.trim() || !form.issuer.trim()) {
      toast.error("Title and issuer are required.");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("issuer", form.issuer.trim());
      fd.append("issueDate", form.issueDate);
      fd.append("credentialId", form.credentialId.trim());
      fd.append("credentialUrl", form.credentialUrl.trim());
      if (form.file) fd.append("certificateFile", form.file);

      if (editingId) {
        const updated = await updateCertification(editingId, fd);
        setCerts((prev) => prev.map((c) => (c._id === editingId ? updated : c)));
        toast.success("Certification updated!");
        setEditingId(null);
      } else {
        const created = await createCertification(fd);
        setCerts((prev) => [created, ...prev]);
        toast.success("Certification added!");
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      file: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      setCerts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Certification deleted.");
    } catch { toast.error("Delete failed."); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Certifications</h1>
          <p className="text-slate-600 mt-1">Showcase your verified professional certifications.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
        >
          <Plus size={18} />
          Add Certificate
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="app-card mb-8 overflow-hidden p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <Award size={20} className="text-emerald-600" />
                {editingId ? "Edit Certification" : "Add Certification"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="text-slate-400 hover:text-slate-950 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="app-label">Certificate Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="AWS Certified Developer" className={inputClass} required />
                </div>
                <div>
                  <label className="app-label">Issuing Organization *</label>
                  <input name="issuer" value={form.issuer} onChange={handleChange}
                    placeholder="Amazon Web Services" className={inputClass} required />
                </div>
                <div>
                  <label className="app-label">Issue Date</label>
                  <input name="issueDate" type="date" value={form.issueDate} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="app-label">Credential ID</label>
                  <input name="credentialId" value={form.credentialId} onChange={handleChange}
                    placeholder="e.g. AWS-12345" className={inputClass} />
                </div>
                <div>
                  <label className="app-label">Credential URL</label>
                  <input name="credentialUrl" value={form.credentialUrl} onChange={handleChange}
                    placeholder="https://verify.example.com/..." className={inputClass} />
                </div>
                <div>
                  <label className="app-label">Upload Certificate (PDF/Image)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange}
                    className={`${inputClass} cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700`} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition px-6 py-3 rounded-xl text-white font-semibold text-sm">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {submitting ? "Saving..." : editingId ? "Update" : "Add Certificate"}
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
      ) : certs.length === 0 ? (
        <div className="app-card p-16 text-center">
          <Award size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-950 mb-2">No Certifications Yet</h2>
          <p className="text-slate-600">Add your certifications to boost your credibility.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="app-card p-5 transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-lg font-bold text-slate-950">{cert.title}</h2>
                    {cert.verified && (
                      <span className="flex items-center gap-1 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm mb-1">
                    <Building size={13} />
                    {cert.issuer}
                  </div>
                  {cert.issueDate && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                      <Calendar size={12} />
                      {cert.issueDate}
                    </div>
                  )}
                  {cert.credentialId && (
                    <div className="text-slate-500 text-xs mb-2">ID: {cert.credentialId}</div>
                  )}
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs transition">
                      <ExternalLink size={12} /> Verify Certificate
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(cert)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-slate-600">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(cert._id)}
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
