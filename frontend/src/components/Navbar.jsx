import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useContext(AuthContext);

  const handleLogout = () => {
  logout();
  localStorage.clear();
  navigate("/login");
};

  return (
    <motion.div
      initial={{
        y: -20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className="flex justify-end items-center gap-4 mb-8"
    >
      <div/>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 w-full md:w-80">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white w-full"
          />
        </div>

        <button className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-white hover:bg-slate-800 transition">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <img
  src={
    user?.avatar ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user?.name || "User")
  }
            alt="profile"
            className="w-11 h-11 rounded-full"
          />

          <div className="hidden md:block">
            <h3 className="text-white font-semibold">
              {user?.name ||
                "User"}
            </h3>

            <p className="text-slate-400 text-sm">
              {user?.email ||
                "No Email"}
            </p>
          </div>
        </div>

        <button
          onClick={
            handleLogout
          }
          className="bg-red-600 hover:bg-red-700 transition p-3 rounded-xl text-white"
        >
          <LogOut size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default Navbar;