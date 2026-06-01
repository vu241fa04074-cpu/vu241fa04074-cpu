import { Link } from "react-router-dom";

export default function StatCard({ title, value, icon, link }) {
  const inner = (
    <div className="app-card flex h-full flex-col gap-2 p-4 transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <span className="text-blue-600">{icon}</span>
      </div>
      <span className="text-2xl font-bold text-slate-950">{value}</span>
    </div>
  );
  return link ? <Link to={link} className="block h-full">{inner}</Link> : inner;
}
