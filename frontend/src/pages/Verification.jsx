import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheck, Plus, Clock3, CheckCircle2, XCircle,
  Loader2, Upload, FileText, X,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getMyVerifications, createVerificationRequest } from "../api/verificationApi";
import { getProjects } from "../api/projectApi";
import { getCertifications } from "../api/certificationApi";
import { getAchievements } from "../api/achievementApi";

const inputClass = "app-input";

const statusConfig = {
  pending:  { icon: Clock3,        color: "text-amber-700", bg: "bg-amber-50 border-amber-100", label: "Pending"  },
  approved: { icon: CheckCircle2,  color: "text-emerald-700",  bg: "bg-emerald-50 border-emerald-100",  label: "Approved" },
  rejected: { icon: XCircle,       color: "text-red-700",    bg: "bg-red-50 border-red-100",      label: "Rejected" },
};

export default function Verification() {
  const [requests, setRequests]     = useState([]);
  const [projects, setProjects]     = useState([]);
  const [certs, setCerts]           = useState([]);
  const [achievements, setAch]      = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm] = useState({ itemType: "project", itemId: "", file: null });

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const [reqs, proj, cert, ach] = await Promise.all([
        getMyVerifications(),
        getProjects(),
        getCertifications(),
        getAchievements(),
      ]);
      setRequests(reqs);
      setProjects(proj);
      setCerts(cert);
      setAch(ach);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  const getItemOptions = () => {
    if (form.itemType === "project")       return projects;
    if (form.itemType === "certification") return certs;
    if (form.itemType === "achievement")   return achievements;
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.itemId) { toast.error("Please select an item to verify."); return; }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("itemType", form.itemType);
      fd.append("itemId",   form.itemId);
      if (form.file) fd.append("proofFile", form.file);
      const created = await createVerificationRequest(fd);
      setRequests((prev) => [created, ...prev]);
      toast.success("Verification request submitted!");
      setForm({ itemType: "project", itemId: "", file: null });
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally { setSubmitting(false); }
  };

  const counts = {
    pending:  requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Verification</h1>
          <p className="text-slate-600 mt-1">Submit and track verification requests for your credentials.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(counts).map(([status, count]) => {
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          return (
            <div key={status} className={`border rounded-2xl p-4 flex items-center gap-3 ${cfg.bg}`}>
              <Icon size={20} className={cfg.color} />
              <div>
                <div className="text-xl font-bold text-slate-950">{count}</div>
                <div className="text-slate-600 text-xs">{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="app-card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600" /> New Verification Request
            </h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-950 transition">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="app-label">Item Type</label>
                <select value={form.itemType}
                  onChange={(e) => setForm((p) => ({ ...p, itemType: e.target.value, itemId: "" }))}
                  className={inputClass}>
                  <option value="project">Project</option>
                  <option value="certification">Certification</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              <div>
                <label className="app-label">Select Item</label>
                <select value={form.itemId}
                  onChange={(e) => setForm((p) => ({ ...p, itemId: e.target.value }))}
                  className={inputClass} required>
                  <option value="">-- Select --</option>
                  {getItemOptions().map((item) => (
                    <option key={item._id} value={item._id}>{item.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label className="app-label">
                Upload Proof Document (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 text-center hover:border-blue-300 transition">
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setForm((p) => ({ ...p, file: e.target.files[0] }))}
                  className="text-slate-600 text-sm" />
                {form.file && (
                  <p className="text-emerald-700 text-xs mt-2 flex items-center justify-center gap-1">
                    <FileText size={12} /> {form.file.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition px-6 py-3 rounded-xl text-white font-semibold text-sm">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="app-button-secondary">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="app-card p-16 text-center">
          <ShieldCheck size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-950 mb-2">No Verification Requests</h2>
          <p className="text-slate-600">Submit a request to get your credentials officially verified.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, i) => {
            const cfg = statusConfig[req.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <motion.div key={req._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`border rounded-2xl p-5 ${cfg.bg}`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-950 font-semibold capitalize">{req.itemType}</span>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      Submitted: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    {req.remarks && (
                      <p className="text-slate-700 text-sm mt-2 rounded-lg bg-white/70 px-3 py-2">
                        <span className="text-slate-500">Remark: </span>{req.remarks}
                      </p>
                    )}
                  </div>
                  {req.proofFile && (
                    <a href={`${import.meta.env.VITE_API_URL?.replace("/api","") || "http://localhost:5000"}${req.proofFile}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-blue-700 text-xs hover:text-blue-800 transition bg-white px-3 py-2 rounded-lg">
                      <FileText size={13} /> View Proof
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
