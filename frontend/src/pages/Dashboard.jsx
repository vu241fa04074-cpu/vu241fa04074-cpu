import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Clock3,
  Eye,
  FolderKanban,
  ShieldCheck,
  ThumbsUp,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getDashboardStats } from "../api/dashboardApi";
import AnalyticsChart from "../components/AnalyticsChart";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import DashboardLayout from "../layouts/DashboardLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06 },
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
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
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

  const actions = [
    { label: "Add Project", to: "/projects", icon: FolderKanban, color: "border-blue-200 bg-blue-50 text-blue-700" },
    { label: "Add Certificate", to: "/certifications", icon: Award, color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    { label: "Add Achievement", to: "/achievements", icon: Trophy, color: "border-violet-200 bg-violet-50 text-violet-700" },
    { label: "Get Verified", to: "/verification", icon: ShieldCheck, color: "border-amber-200 bg-amber-50 text-amber-700" },
  ];

  const completion = stats?.profileCompletion ?? 20;

  return (
    <DashboardLayout>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">
          Welcome back, {user?.name?.split(" ")[0] || "User"}
        </h1>
        <p className="mt-1 text-slate-600">Here&apos;s an overview of your portfolio performance.</p>
      </motion.div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card, index) => (
          <motion.div key={card.title} variants={fadeUp} initial="hidden" animate="visible" custom={index}>
            <StatCard title={card.title} value={card.value} icon={card.icon} link={card.link} />
          </motion.div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} className="xl:col-span-2">
          <AnalyticsChart />
        </motion.div>

        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={7} className="app-card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-950">
            <TrendingUp size={20} className="text-blue-600" />
            Profile Status
          </h2>

          {stats?.pendingVerifications > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <Clock3 size={16} className="text-amber-600" />
              <span className="text-sm text-amber-700">
                {stats.pendingVerifications} pending verification{stats.pendingVerifications > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="mb-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Profile Completion</span>
              <span className="font-semibold text-slate-950">{completion}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="h-2.5 rounded-full bg-blue-600"
              />
            </div>
          </div>

          <p className="mb-5 text-sm leading-relaxed text-slate-600">
            Complete your profile, add coding links, and upload your best projects to improve your public portfolio.
          </p>

          <Link to="/profile" className="app-button-primary w-full py-3">
            Complete Profile
            <ArrowRight size={16} />
          </Link>
        </motion.section>
      </div>

      <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={8} className="app-card p-6">
        <h2 className="mb-5 text-xl font-bold text-slate-950">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className={`${action.color} flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition hover:shadow-sm`}
              >
                <Icon size={22} />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.section>
    </DashboardLayout>
  );
}
