import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Award, Trophy,
  ShieldCheck, ThumbsUp, BarChart3, User,
  LogOut, Menu, X, ChevronRight, Settings,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",      to: "/dashboard",     icon: LayoutDashboard },
  { label: "Profile",        to: "/profile",       icon: User            },
  { label: "Projects",       to: "/projects",      icon: FolderKanban    },
  { label: "Certifications", to: "/certifications",icon: Award           },
  { label: "Achievements",   to: "/achievements",  icon: Trophy          },
  { label: "Verification",   to: "/verification",  icon: ShieldCheck     },
  { label: "Endorsements",   to: "/endorsements",  icon: ThumbsUp        },
  { label: "Analytics",      to: "/analytics",     icon: BarChart3       },
];

const ADMIN_ITEMS = [
  { label: "Admin Dashboard",    to: "/admin",                icon: Settings    },
  { label: "Verifications",      to: "/admin/verifications",  icon: ShieldCheck },
];

export default function DashboardLayout({ children }) {
  const { user, logout }  = useContext(AuthContext);
  const location          = useLocation();
  const navigate          = useNavigate();
  const [open, setOpen]   = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user?.role === "admin"
    ? [...ADMIN_ITEMS, ...NAV_ITEMS]
    : NAV_ITEMS;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
        <ShieldCheck size={22} className="text-blue-500" />
        <span className="text-xl font-bold text-white">VeriFolio</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Topbar */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500" />
            <span className="font-bold text-white">VeriFolio</span>
          </div>
          <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white transition">
            <Menu size={22} />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
