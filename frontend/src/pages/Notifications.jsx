import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { toast } from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'blood': return '🩸';
      case 'ambulance': return '🚑';
      case 'camp': return '🏥';
      default: return '🔔';
    }
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, fontWeight: 700, margin: 0 }}>Alerts & Notifications</h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>Stay updated with real-time emergency requests and activity.</p>
        </div>
        <button
          onClick={fetchNotifications}
          style={{ background: "#f1f5f9", border: "none", padding: "10px 16px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Loading notifications...</div>
        ) : (
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !n.read && markRead(n._id)}
                style={{
                  background: n.read ? "rgba(255,255,255,0.5)" : "#fff",
                  border: `1px solid ${n.read ? "#e2e8f0" : "#e11d4833"}`,
                  borderRadius: 20,
                  padding: "20px 24px",
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: n.read ? "none" : "0 4px 20px rgba(225,29,72,0.08)",
                  position: "relative"
                }}
              >
                {!n.read && <div style={{ position: "absolute", top: 20, right: 20, width: 8, height: 8, borderRadius: "50%", background: "#e11d48" }} />}
                <div style={{ width: 50, height: 50, borderRadius: 14, background: n.read ? "#f1f5f9" : "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {getIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: n.read ? "#64748b" : "#1e293b" }}>{n.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={(e) => deleteNotification(n._id, e)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 4, borderRadius: 8 }}
                        title="Delete notification"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: n.read ? "#94a3b8" : "#475569", margin: 0, lineHeight: 1.5 }}>{n.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#f8fafc", borderRadius: 24, border: "2px dashed #e2e8f0" }}>
            <span style={{ fontSize: 40 }}>📭</span>
            <h3 style={{ marginTop: 16, fontWeight: 700 }}>All caught up!</h3>
            <p style={{ color: "#64748b" }}>You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
