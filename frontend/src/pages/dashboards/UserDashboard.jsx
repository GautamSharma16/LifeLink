import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../../lib/api";

const chartData = [
  { name: "Mon", blood: 4, donations: 2, ambulance: 1 },
  { name: "Tue", blood: 7, donations: 3, ambulance: 0 },
  { name: "Wed", blood: 3, donations: 1, ambulance: 2 },
  { name: "Thu", blood: 9, donations: 4, ambulance: 1 },
  { name: "Fri", blood: 6, donations: 2, ambulance: 3 },
  { name: "Sat", blood: 11, donations: 5, ambulance: 1 },
  { name: "Sun", blood: 8, donations: 3, ambulance: 2 },
];

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBloodRequests: 0,
    totalAmbulanceRequests: 0,
    totalVolunteerRequests: 0,
    totalDonations: 0,
    openRequests: 0,
  });
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const u = localStorage.getItem("lifelink_user");
    if (u) setUser(JSON.parse(u));

    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/activity"),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (activityRes.data.success) {
          setActivity(activityRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontWeight: 700 }}>
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "User Dashboard"}
          </h1>
          <p style={{ color: "#64748b" }}>Track your emergency requests and contributions.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Blood Requests Sent", value: stats.totalBloodRequests, icon: "🩸", color: "#e11d48" },
          { label: "Ambulance Bookings", value: stats.totalAmbulanceRequests, icon: "🚑", color: "#3b82f6" },
          { label: "Volunteer Requests", value: stats.totalVolunteerRequests, icon: "🤝", color: "#f59e0b" },
          { label: "Total Donations", value: stats.totalDonations, icon: "✅", color: "#10b981" },
          { label: "Open Requests", value: stats.openRequests, icon: "⏳", color: "#8b5cf6" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.icon} {s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Request Blood", icon: "🩸", to: "/request-blood", bg: "#fff1f2", color: "#e11d48" },
          { label: "Book Ambulance", icon: "🚑", to: "/ambulance", bg: "#eff6ff", color: "#3b82f6" },
          { label: "Find Hospital", icon: "🏥", to: "/hospitals", bg: "#f0fdf4", color: "#10b981" },
          { label: "Volunteers", icon: "🤝", to: "/volunteers", bg: "#f5f3ff", color: "#8b5cf6" },
        ].map((a, i) => (
          <Link key={i} to={a.to} style={{ textDecoration: "none" }}>
            <motion.div whileHover={{ y: -4 }} style={{ background: a.bg, border: `1px solid ${a.color}33`, borderRadius: 24, padding: "24px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: a.color }}>{a.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="user-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <style>{`
          @media (max-width: 900px) {
            .user-dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="blood" fill="#e11d48" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ambulance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="donations" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {activity.length === 0 && (
              <p style={{ fontSize: 13, color: "#64748b" }}>No recent activity yet.</p>
            )}
            {activity.map((act) => (
              <div key={act._id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#e11d48" }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", margin: 0 }}>{act.title}</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{act.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
