import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Trophy,
  ShieldCheck,
  ThumbsUp,
  BarChart3,
  User,
  LogOut,
  Menu,
  ChevronRight,
  Settings,
  ExternalLink,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getMyProfile } from "../api/profileApi";
import BrandLogo from "../components/BrandLogo";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Certifications", to: "/certifications", icon: Award },
  { label: "Achievements", to: "/achievements", icon: Trophy },
  { label: "Verification", to: "/verification", icon: ShieldCheck },
  { label: "Endorsements", to: "/endorsements", icon: ThumbsUp },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
];

const ADMIN_ITEMS = [
  { label: "Admin Dashboard", to: "/admin", icon: Settings },
  { label: "Verifications", to: "/admin/verifications", icon: ShieldCheck },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
  const profileImage = profile?.profileImage ? `${apiOrigin}${profile.profileImage}` : "";
  const publicProfilePath = user?.username ? `/u/${user.username}` : "/profile";

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch(() => {
        if (active) setProfile(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user?.role === "admin"
    ? [...ADMIN_ITEMS, ...NAV_ITEMS]
    : NAV_ITEMS;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <BrandLogo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt={user?.name || "Profile"}
              className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {user?.name?.[0] || "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/profile"
          className="mb-2 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          <User size={16} /> Profile Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 z-50 h-full w-64 border-r border-slate-200 bg-white lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <BrandLogo compact />
            <span className="font-bold text-slate-950">VERIFOLIO</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <Menu size={22} />
          </button>
        </header>

        <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-slate-200 bg-white/85 px-8 py-4 backdrop-blur lg:flex">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Workspace</p>
            <p className="text-sm font-medium text-slate-500">Manage your public verification portfolio</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={publicProfilePath} target="_blank" className="app-button-secondary px-4 py-2">
              <ExternalLink size={16} />
              Public Page
            </Link>
            <Link to="/profile" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-blue-200">
              {profileImage ? (
                <img src={profileImage} alt={user?.name || "Profile"} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {user?.name?.[0] || "U"}
                </span>
              )}
              <span className="text-left">
                <span className="block text-sm font-bold text-slate-950">{user?.name || "Profile"}</span>
                <span className="block text-xs text-slate-500">Profile</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
