import {
  LayoutDashboard,
  User,
  FolderKanban,
  BadgeCheck,
  Trophy,
  ShieldCheck,
  ThumbsUp,
  BarChart3,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { logout, user } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },

    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },

    {
      name: "Certifications",
      path: "/certifications",
      icon: BadgeCheck,
    },

    {
      name: "Achievements",
      path: "/achievements",
      icon: Trophy,
    },

    {
      name: "Verification",
      path: "/verification",
      icon: ShieldCheck,
    },

    {
      name: "Endorsements",
      path: "/endorsements",
      icon: ThumbsUp,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 p-6 hidden lg:flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white">
          VeriFolio
        </h1>

        <p className="text-slate-400 mt-2 text-sm">
          Digital Portfolio Platform
        </p>
      </div>

      <nav className="mt-10 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}

        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <ShieldCheck size={20} />

            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => {
            logout();
            localStorage.clear();
            navigate("/login");
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all"
        >
          <LogOut size={18} />

          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;