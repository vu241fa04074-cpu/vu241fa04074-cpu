import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, FolderKanban, Award, Trophy,
  ShieldCheck, Clock3, CheckCircle2, XCircle,
  ArrowRight, BarChart3,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getAdminStats } from "../api/adminApi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader /></div></DashboardLayout>;

  const cards = [
    { label: "Total Users",          value: stats?.totalUsers                || 0, icon: Users,         color: "text-blue-400",   bg: "bg-blue-500/10"   },
    { label: "Total Projects",        value: stats?.totalProjects             || 0, icon: FolderKanban,  color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Certifications",        value: stats?.totalCertifications       || 0, icon: Award,         color: "text-green-400",  bg: "bg-green-500/10"  },
    { label: "Achievements",          value: stats?.totalAchievements         || 0, icon: Trophy,        color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Pending Verifications", value: stats?.pendingRequests           || 0, icon: Clock3,        color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Approved",              value: stats?.approvedRequests          || 0, icon: CheckCircle2,  color: "text-emerald-400",bg: "bg-emerald-500/10"},
    { label: "Rejected",              value: stats?.rejectedRequests          || 0, icon: XCircle,       color: "text-red-400",    bg: "bg-red-500/10"    },
    { label: "Total Verifications",   value: stats?.totalVerificationRequests || 0, icon: ShieldCheck,   color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
  ];

  return (
    <DashboardLayout>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 size={24} className="text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-slate-400">Platform-wide statistics and management overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.08}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-colors">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={card.color} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-slate-500 text-xs">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Alert */}
      {(stats?.pendingRequests || 0) > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.7}
          className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3 size={20} className="text-orange-400" />
            <div>
              <p className="text-white font-semibold">{stats.pendingRequests} pending verification request{stats.pendingRequests > 1 ? "s" : ""}</p>
              <p className="text-slate-400 text-sm">Review and approve or reject user submissions.</p>
            </div>
          </div>
          <Link to="/admin/verifications"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-xl text-white text-sm font-semibold">
            Review <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.8}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/verifications"
            className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition rounded-xl p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-blue-400" />
              <div>
                <p className="text-white font-semibold text-sm">Manage Verifications</p>
                <p className="text-slate-500 text-xs">Review all verification requests</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
          </Link>
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-purple-400" />
              <div>
                <p className="text-white font-semibold text-sm">Manage Users</p>
                <p className="text-slate-500 text-xs">View and manage all users</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500" />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
