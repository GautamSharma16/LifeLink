import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("lifelink_token");
    localStorage.removeItem("lifelink_user");
    window.dispatchEvent(new Event("lifelink-auth-changed"));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <Navbar isLoggedIn onLogout={handleLogout} />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
