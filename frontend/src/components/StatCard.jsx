import { Link } from "react-router-dom";

export default function StatCard({ title, value, icon, link }) {
  const inner = (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors rounded-2xl p-4 flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-medium">{title}</span>
        <span className="text-blue-400">{icon}</span>
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
  return link ? <Link to={link} className="block h-full">{inner}</Link> : inner;
}
