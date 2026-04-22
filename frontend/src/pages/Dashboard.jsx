import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const mockStats = {
  totalBloodRequests: 24,
  totalDonations: 8,
  totalAmbulanceRequests: 3,
  totalVolunteerRequests: 12,
  openRequests: 5,
  completedToday: 3,
};

const chartData = [
  { name: "Mon", blood: 4, donations: 2, ambulance: 1 },
  { name: "Tue", blood: 7, donations: 3, ambulance: 0 },
  { name: "Wed", blood: 3, donations: 1, ambulance: 2 },
  { name: "Thu", blood: 9, donations: 4, ambulance: 1 },
  { name: "Fri", blood: 6, donations: 2, ambulance: 3 },
  { name: "Sat", blood: 11, donations: 5, ambulance: 1 },
  { name: "Sun", blood: 8, donations: 3, ambulance: 2 },
];

const pieData = [
  { name: "Blood Requests", value: 45, color: "#e11d48" },
  { name: "Donations", value: 28, color: "#10b981" },
  { name: "Ambulance", value: 12, color: "#3b82f6" },
  { name: "Volunteers", value: 15, color: "#8b5cf6" },
];

const recentActivity = [
  { type: "blood", msg: "New blood request — O+ needed at AIIMS Delhi", time: "2 min ago", color: "#e11d48" },
  { type: "donation", msg: "Rahul V accepted your blood request", time: "18 min ago", color: "#10b981" },
  { type: "ambulance", msg: "Ambulance dispatched to Sector 15", time: "45 min ago", color: "#3b82f6" },
  { type: "volunteer", msg: "3 volunteers joined your city network", time: "1 hr ago", color: "#8b5cf6" },
  { type: "blood", msg: "Request fulfilled — AB- at Safdarjung Hospital", time: "2 hr ago", color: "#10b981" },
];

const quickActions = [
  { label: "Request Blood", icon: "🩸", to: "/request-blood", color: "#e11d48", bg: "#fff1f2" },
  { label: "Donate Blood", icon: "💉", to: "/donate-blood", color: "#db2777", bg: "#fdf2f8" },
  { label: "Call Ambulance", icon: "🚑", to: "/ambulance", color: "#3b82f6", bg: "#eff6ff" },
  { label: "Find Hospital", icon: "🏥", to: "/hospitals", color: "#10b981", bg: "#f0fdf4" },
  { label: "Volunteers", icon: "🤝", to: "/volunteers", color: "#8b5cf6", bg: "#f5f3ff" },
  { label: "Notifications", icon: "🔔", to: "/notifications", color: "#f59e0b", bg: "#fffbeb" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const u = localStorage.getItem("lifelink_user");
    if (u) setUser(JSON.parse(u));
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .font-display { font-family:'Instrument Serif',serif; }
        .stat-card { background:#fff; border:1px solid #e2e8f0; border-radius:20px; padding:24px; transition:all 0.2s; }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.08); }
        .dark .stat-card { background:#1e293b; border-color:#334155; }
        .dark .card-white { background:#1e293b!important; border-color:#334155!important; }
        .dark .text-sm-muted { color:#94a3b8!important; }
        .dark .act-item { border-color:#334155!important; }
        .dark .act-item:hover { background:#1e293b!important; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 4 }}>{greeting} 👋</p>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 700, lineHeight: 1.2 }}>
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "Emergency Dashboard"}
          </h1>
        </div>
        <Link to="/request-blood" style={{ background: "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", textDecoration: "none", padding: "14px 24px", borderRadius: 14, fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px rgba(225,29,72,0.3)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          🩸 Emergency Request
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Blood Requests", value: mockStats.totalBloodRequests, icon: "🩸", color: "#e11d48", change: "+3 today" },
          { label: "Donations Made", value: mockStats.totalDonations, icon: "💉", color: "#10b981", change: "+1 today" },
          { label: "Ambulance Calls", value: mockStats.totalAmbulanceRequests, icon: "🚑", color: "#3b82f6", change: "0 today" },
          { label: "Volunteer Requests", value: mockStats.totalVolunteerRequests, icon: "🤝", color: "#8b5cf6", change: "+2 today" },
          { label: "Open Requests", value: mockStats.openRequests, icon: "⏳", color: "#f59e0b", change: "Active" },
          { label: "Completed Today", value: mockStats.completedToday, icon: "✅", color: "#10b981", change: "Great!" },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p className="text-sm-muted" style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</p>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: s.color, lineHeight: 1.1, margin: "8px 0 4px" }}>{s.value}</p>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{s.change}</span>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div className="card-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px", marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
          {quickActions.map((a, i) => (
            <Link key={a.label} to={a.to} style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.04, y: -3 }} style={{ background: a.bg, border: `1px solid ${a.color}22`, borderRadius: 16, padding: "20px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, marginBottom: 32 }}>
        {/* Bar Chart */}
        <motion.div className="card-white" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Weekly Activity</h2>
          <p className="text-sm-muted" style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Requests and donations over the past 7 days</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", fontSize: 13 }} />
              <Bar dataKey="blood" name="Blood" fill="#e11d48" radius={[6, 6, 0, 0]} />
              <Bar dataKey="donations" name="Donations" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ambulance" name="Ambulance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div className="card-white" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Request Breakdown</h2>
          <p className="text-sm-muted" style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Distribution by type</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div className="card-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Activity</h2>
          <Link to="/notifications" style={{ color: "#e11d48", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>View all →</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {recentActivity.map((a, i) => (
            <motion.div key={i} className="act-item" whileHover={{ x: 4, background: "#f8fafc" }} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid #f1f5f9", cursor: "default", transition: "all 0.2s", borderRadius: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
              <p style={{ fontSize: 14, flex: 1, color: "#334155" }}>{a.msg}</p>
              <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{a.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}