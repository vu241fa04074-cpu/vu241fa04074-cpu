import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheck, Search, CheckCircle2, XCircle,
  Clock3, FileText, Loader2, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getAllVerificationsAdmin, approveVerification, rejectVerification } from "../api/adminApi";

const inputClass = "bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm";

const statusConfig = {
  pending:  { icon: Clock3,       color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/20" },
  approved: { icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-500/15 border-green-500/20"  },
  rejected: { icon: XCircle,      color: "text-red-400",    bg: "bg-red-500/15 border-red-500/20"      },
};

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export default function AdminVerifications() {
  const [data, setData]         = useState({ requests: [], pagination: {} });
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]     = useState("");
  const [actioning, setActioning] = useState(null);
  const [remarksMap, setRemarksMap] = useState({});

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllVerificationsAdmin({ page, limit: 15, status: statusFilter });
      setData(res);
    } catch { toast.error("Failed to load requests."); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleApprove = async (id) => {
    try {
      setActioning(id + "approve");
      await approveVerification(id, remarksMap[id] || "");
      toast.success("Request approved!");
      setData((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => r._id === id ? { ...r, status: "approved", remarks: remarksMap[id] || "" } : r),
      }));
    } catch { toast.error("Approval failed."); }
    finally { setActioning(null); }
  };

  const handleReject = async (id) => {
    const remarks = remarksMap[id]?.trim();
    if (!remarks) { toast.error("Please enter a remark before rejecting."); return; }
    try {
      setActioning(id + "reject");
      await rejectVerification(id, remarks);
      toast.success("Request rejected.");
      setData((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => r._id === id ? { ...r, status: "rejected", remarks } : r),
      }));
    } catch { toast.error("Rejection failed."); }
    finally { setActioning(null); }
  };

  const filtered = search.trim()
    ? data.requests.filter((r) =>
        r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.itemType?.toLowerCase().includes(search.toLowerCase())
      )
    : data.requests;

  const { total = 0, pages = 1 } = data.pagination || {};

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck size={26} className="text-blue-400" /> Verification Requests
          </h1>
          <p className="text-slate-400 mt-1">{total} total requests across the platform.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or item type..." className={`${inputClass} pl-9 w-full`}
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className={`${inputClass} pl-9 pr-8`}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <ShieldCheck size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-white font-bold text-xl mb-2">No Requests Found</p>
          <p className="text-slate-400">No verification requests match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req, i) => {
            const cfg = statusConfig[req.status] || statusConfig.pending;
            const Icon = cfg.icon;
            const isActioning = actioning?.startsWith(req._id);
            return (
              <motion.div key={req._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-bold">{req.user?.name || "Unknown User"}</span>
                      <span className="text-slate-500 text-sm">@{req.user?.username}</span>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <Icon size={11} /> {req.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm">
                      <span className="capitalize font-medium text-slate-300">{req.itemType}</span>
                      {" · "}
                      <span className="text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    {req.remarks && (
                      <p className="text-slate-300 text-sm mt-2 bg-slate-800 rounded-lg px-3 py-1.5">
                        <span className="text-slate-500">Remark: </span>{req.remarks}
                      </p>
                    )}
                  </div>
                  {req.proofFile && (
                    <a href={`${API_BASE}${req.proofFile}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-blue-400 text-xs bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl hover:bg-blue-500/20 transition">
                      <FileText size={13} /> View Proof
                    </a>
                  )}
                </div>

                {req.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                    <input
                      type="text"
                      value={remarksMap[req._id] || ""}
                      onChange={(e) => setRemarksMap((prev) => ({ ...prev, [req._id]: e.target.value }))}
                      placeholder="Add admin remark (required for rejection)..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm"
                    />
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={isActioning}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 transition px-5 py-2.5 rounded-xl text-white text-sm font-semibold">
                      {actioning === req._id + "approve" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      disabled={isActioning}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 transition px-5 py-2.5 rounded-xl text-white text-sm font-semibold">
                      {actioning === req._id + "reject" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition text-white">
            <ChevronLeft size={18} />
          </button>
          <span className="text-slate-400 text-sm">Page {page} of {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
