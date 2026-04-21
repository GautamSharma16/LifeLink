import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import { isLoggedIn } from "../lib/auth";
import toast from "react-hot-toast";

export default function PublicLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/about" ||
        window.location.pathname === "/services" ||
        window.location.pathname === "/contact"
      ) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("lifelink_token");
    localStorage.removeItem("lifelink_user");
    window.dispatchEvent(new Event("lifelink-auth-changed"));
    toast.success("Logged out successfully");
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-rose-50 dark:from-slate-950 dark:to-slate-900">
      <Navbar 
        isLoggedIn={isLoggedIn()} 
        onLogout={handleLogout}
      />
      <main className="min-h-[calc(100vh-80px)]">
        {children || <Outlet />}
      </main>
      <footer className="border-t border-slate-200/50 bg-white/80 backdrop-blur-xl dark:bg-slate-900/70 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; 2025 LifeLink BloodBank. Every drop counts. | 24/7 Emergency: +91-11-1234-5678</p>
      </footer>
    </div>
  );
}

