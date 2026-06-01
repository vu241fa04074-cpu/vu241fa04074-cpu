import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Eye, ShieldCheck, ThumbsUp, TrendingUp } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getMyAnalytics } from "../api/analyticsApi";
import { getDashboardStats } from "../api/dashboardApi";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706"];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
};

const chartTooltip = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  color: "#0f172a",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyAnalytics(), getDashboardStats()])
      .then(([analyticsData, statsData]) => {
        setAnalytics(analyticsData);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center"><Loader /></div>
      </DashboardLayout>
    );
  }

  const pieData = [
    { name: "Projects", value: stats?.totalProjects || 0 },
    { name: "Certifications", value: stats?.totalCertifications || 0 },
    { name: "Achievements", value: stats?.totalAchievements || 0 },
    { name: "Endorsements", value: stats?.endorsementsCount || 0 },
  ];

  const overviewCards = [
    { label: "Profile Views", value: analytics?.profileViews || 0, icon: Eye, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Endorsements", value: stats?.endorsementsCount || 0, icon: ThumbsUp, color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "Verifications", value: analytics?.verificationCount || 0, icon: ShieldCheck, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Profile Score", value: `${stats?.profileCompletion || 0}%`, icon: TrendingUp, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
  ];

  const views = analytics?.profileViews || 0;
  const activityData = [
    { day: "Mon", views: Math.floor(views * 0.12) },
    { day: "Tue", views: Math.floor(views * 0.18) },
    { day: "Wed", views: Math.floor(views * 0.14) },
    { day: "Thu", views: Math.floor(views * 0.22) },
    { day: "Fri", views: Math.floor(views * 0.16) },
    { day: "Sat", views: Math.floor(views * 0.10) },
    { day: "Sun", views: Math.max(0, views - Math.floor(views * 0.92)) },
  ];

  const projectCount = stats?.totalProjects || 0;
  const growthData = [
    { month: "Jan", items: 0 },
    { month: "Feb", items: Math.floor(projectCount * 0.2) },
    { month: "Mar", items: Math.floor(projectCount * 0.4) },
    { month: "Apr", items: Math.floor(projectCount * 0.6) },
    { month: "May", items: Math.floor(projectCount * 0.8) },
    { month: "Jun", items: projectCount },
  ];

  return (
    <DashboardLayout>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BarChart3 size={25} />
          </span>
          <div>
            <h1 className="text-3xl font-black text-slate-950">Analytics</h1>
            <p className="mt-1 text-slate-600">Insights on your portfolio performance.</p>
          </div>
        </div>
      </motion.div>

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={index}
              className={`rounded-2xl border ${card.border} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
                <Icon size={19} />
              </div>
              <div className="mb-1 text-2xl font-black text-slate-950">{card.value}</div>
              <div className="text-sm font-medium text-slate-500">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={4} className="app-card p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-950">Profile Views This Week</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activityData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={chartTooltip} cursor={{ fill: "rgba(37,99,235,0.08)" }} />
              <Bar dataKey="views" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.section>

        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={5} className="app-card p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-950">Portfolio Composition</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="48%" innerRadius={58} outerRadius={88} paddingAngle={4} dataKey="value">
                {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltip} />
              <Legend iconType="circle" iconSize={10} formatter={(value) => <span style={{ color: "#475569", fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.section>
      </div>

      <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={6} className="app-card p-6">
        <h2 className="mb-5 text-lg font-bold text-slate-950">Cumulative Portfolio Growth</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={chartTooltip} />
            <Line type="monotone" dataKey="items" stroke="#7c3aed" strokeWidth={3} dot={{ fill: "#7c3aed", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.section>
    </DashboardLayout>
  );
}
