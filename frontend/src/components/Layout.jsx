import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import { isLoggedIn } from "../lib/auth";
import { socket } from "../lib/socket";

export default function Layout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      socket.connect();
      
      const user = JSON.parse(localStorage.getItem("lifelink_user") || "{}");
      
      socket.on("blood_request_created", (data) => {
        if (data.city === user.city) {
          toast.custom((t) => (
            <div style={{ background: "#fff", padding: "16px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #e11d4833", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>🩸</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "#1e293b" }}>New Blood Request!</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{data.bloodGroup} needed at {data.hospitalName}</p>
              </div>
            </div>
          ), { duration: 6000 });
        }
      });

      socket.on("ambulance_request_created", (data) => {
        if (user.role === "ambulance_driver" && data.city === user.city) {
          toast.custom((t) => (
            <div style={{ background: "#0f172a", color: "#fff", padding: "16px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>🚑</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>New Emergency Ride!</p>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Pickup: {data.pickupAddress}</p>
              </div>
            </div>
          ), { duration: 8000 });
        }
      });

      socket.on("blood_request_accepted", (data) => {
        if (data.requester === user._id) {
          toast.success("Someone accepted your blood request!", { icon: "❤️", duration: 6000 });
        }
      });

      socket.on("camp_created", (data) => {
        if (user.role === "volunteer" && data.city === user.city) {
          toast.custom((t) => (
            <div style={{ background: "#f5f3ff", color: "#7c3aed", padding: "16px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(124,58,237,0.1)", border: "1px solid #7c3aed33", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>🏥</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>New Blood Camp!</p>
                <p style={{ margin: 0, fontSize: "13px" }}>A new camp was organized in {data.city}</p>
              </div>
            </div>
          ), { duration: 7000 });
        }
      });
    }

    return () => {
      socket.off("blood_request_created");
      socket.off("ambulance_request_created");
      socket.off("blood_request_accepted");
      socket.off("camp_created");
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lifelink_token");
    localStorage.removeItem("lifelink_user");
    window.dispatchEvent(new Event("lifelink-auth-changed"));
    socket.disconnect();
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