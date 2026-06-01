import { ShieldCheck } from "lucide-react";

export default function BrandLogo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-200">
        <span className="absolute inset-0 rounded-2xl border border-white/20" />
        <ShieldCheck size={24} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span>
          <span className="block text-sm font-black leading-tight tracking-wide text-slate-950">VERIFOLIO</span>
          <span className="block text-xs font-semibold text-slate-500">Digital Platform</span>
        </span>
      )}
    </span>
  );
}
