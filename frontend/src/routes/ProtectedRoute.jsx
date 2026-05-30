import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader size={40} /></div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
