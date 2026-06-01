import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { getDashboardStats } from "../api/dashboardApi";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsChart() {
  const [data, setData] = useState(days.map((day) => ({ day, items: 0 })));

  useEffect(() => {
    getDashboardStats().then((s) => {
      const total = (s?.totalProjects || 0) + (s?.totalCertifications || 0) + (s?.totalAchievements || 0);
      const weights = [0.1, 0.18, 0.15, 0.22, 0.16, 0.1, 0.09];
      setData(days.map((day, i) => ({ day, items: Math.round(total * weights[i]) })));
    }).catch(() => {});
  }, []);

  return (
    <div className="app-card h-full p-6">
      <h2 className="mb-5 text-xl font-bold text-slate-950">Weekly Activity</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#0f172a" }}
            cursor={{ fill: "rgba(37,99,235,0.08)" }}
          />
          <Bar dataKey="items" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
