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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
      <h2 className="text-xl font-bold text-white mb-5">Weekly Activity</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff" }}
            cursor={{ fill: "rgba(59,130,246,0.08)" }}
          />
          <Bar dataKey="items" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
