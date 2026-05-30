import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute    from "./routes/ProtectedRoute";
import AdminRoute        from "./routes/AdminRoute";
import Loader            from "./components/Loader";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Projects = lazy(() => import("./pages/Projects"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Verification = lazy(() => import("./pages/Verification"));
const Endorsements = lazy(() => import("./pages/Endorsements"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminVerifications = lazy(() => import("./pages/AdminVerifications"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <Loader />
  </div>
);

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1e293b", color: "#fff", border: "1px solid #334155" },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/"             element={<Landing />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/u/:username"  element={<PublicProfile />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/profile"        element={<Profile />} />
            <Route path="/projects"       element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/achievements"   element={<Achievements />} />
            <Route path="/verification"   element={<Verification />} />
            <Route path="/endorsements"   element={<Endorsements />} />
            <Route path="/analytics"      element={<Analytics />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"                element={<AdminDashboard />} />
            <Route path="/admin/verifications"  element={<AdminVerifications />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
