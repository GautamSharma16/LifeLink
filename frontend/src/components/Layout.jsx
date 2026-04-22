import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import { isLoggedIn } from "../lib/auth";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("lifelink_token");
    localStorage.removeItem("lifelink_user");
    window.dispatchEvent(new Event("lifelink-auth-changed"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar isLoggedIn={isLoggedIn()} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
}