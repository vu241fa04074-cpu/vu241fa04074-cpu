import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderKanban, Award, Trophy, Eye, ThumbsUp,
  ShieldCheck, Clock3, TrendingUp, ArrowRight,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import Loader from "../components/Loader";
import { getDashboardStats } from "../api/dashboardApi";
import { AuthContext } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      // Stats fail gracefully
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { title: "Projects", value: stats?.totalProjects ?? 0, icon: <FolderKanban size={20} />, link: "/projects" },
    { title: "Certifications", value: stats?.totalCertifications ?? 0, icon: <Award size={20} />, link: "/certifications" },
    { title: "Achievements", value: stats?.totalAchievements ?? 0, icon: <Trophy size={20} />, link: "/achievements" },
    { title: "Profile Views", value: stats?.profileViews ?? 0, icon: <Eye size={20} /> },
    { title: "Endorsements", value: stats?.endorsementsCount ?? 0, icon: <ThumbsUp size={20} />, link: "/endorsements" },
    { title: "Verified", value: stats?.totalVerifications ?? 0, icon: <ShieldCheck size={20} /> },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here&apos;s an overview of your portfolio performance.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.1}>
            <StatCard title={card.title} value={card.value} icon={card.icon} link={card.link} />
          </motion.div>
        ))}
      </div>

      {/* Chart + Profile Completion */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0.6}
          className="xl:col-span-2"
        >
          <AnalyticsChart />
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0.7}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" />
            Profile Status
          </h2>

          {stats?.pendingVerifications > 0 && (
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
              <Clock3 size={16} className="text-yellow-400" />
              <span className="text-yellow-300 text-sm">
                {stats.pendingVerifications} pending verification{stats.pendingVerifications > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Profile Completion</span>
              <span className="text-white font-semibold">{stats?.profileCompletion ?? 20}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.profileCompletion ?? 20}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            Complete your profile to maximize visibility and earn more endorsements.
          </p>

          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl text-white font-semibold text-sm"
          >
            Complete Profile
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0.9}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Add Project", to: "/projects", icon: FolderKanban, color: "bg-blue-600" },
            { label: "Add Certificate", to: "/certifications", icon: Award, color: "bg-green-600" },
            { label: "Add Achievement", to: "/achievements", icon: Trophy, color: "bg-purple-600" },
            { label: "Get Verified", to: "/verification", icon: ShieldCheck, color: "bg-orange-600" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className={`${action.color} hover:opacity-90 transition rounded-xl p-4 flex flex-col items-center gap-2 text-center`}
              >
                <Icon size={22} className="text-white" />
                <span className="text-white text-sm font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
