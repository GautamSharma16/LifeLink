import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../lib/api";
import { toast } from "react-hot-toast";

export default function VolunteerDashboard() {
  const [online, setOnline] = useState(true);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [camps, setCamps] = useState([]);

  const fetchData = async () => {
    try {
      const [bloodRes, campRes] = await Promise.all([
        api.get("/blood?status=open"),
        api.get("/camps?status=scheduled")
      ]);
      if (bloodRes.data.success) setBloodRequests(bloodRes.data.data);
      if (campRes.data.success) setCamps(campRes.data.data);
    } catch (err) {
      console.error("Error fetching volunteer data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptBlood = async (id) => {
    try {
      const res = await api.put(`/blood/${id}/accept`);
      if (res.data.success) {
        toast.success("Request accepted!");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to accept request");
    }
  };

  const handleJoinCamp = async (id) => {
    try {
      const res = await api.post(`/camps/${id}/join`);
      if (res.data.success) {
        toast.success("Joined camp!");
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join camp");
    }
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontWeight: 700 }}>Volunteer Portal</h1>
          <p style={{ color: "#64748b" }}>Manage your availability and accept requests.</p>
        </div>
        <button 
          onClick={() => setOnline(!online)}
          style={{ background: online ? "#10b981" : "#e2e8f0", color: online ? "#fff" : "#64748b", padding: "12px 24px", borderRadius: 24, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: online ? "#fff" : "#94a3b8" }} />
          {online ? "You are Online" : "Go Online"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Requests Accepted", value: bloodRequests.length, icon: "🤝", color: "#3b82f6" },
          { label: "Live Camps", value: camps.length, icon: "🏆", color: "#f59e0b" },
          { label: "Donations Made", value: "5", icon: "🩸", color: "#e11d48" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.icon} {s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Live Nearby Requests</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {bloodRequests.length === 0 && <p className="text-slate-400">No active blood requests.</p>}
            {bloodRequests.map((req, i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", padding: 16, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <div style={{ background: "#e11d48", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 700, textTransform: "uppercase" }}>Critical</div>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{req.city}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Blood Needed ({req.bloodGroup})</h3>
                  <p className="text-sm text-slate-500">{req.hospitalName} • {req.units} Units</p>
                </div>
                <button 
                  onClick={() => handleAcceptBlood(req._id)}
                  style={{ background: "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", padding: "8px 16px", borderRadius: 12, border: "none", fontWeight: 600, cursor: "pointer" }}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Donation Camps</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {camps.length === 0 && <p className="text-slate-400">No upcoming camps.</p>}
            {camps.map((camp, i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", padding: 16, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{camp.title}</h3>
                  <p className="text-sm text-slate-500">{camp.hospital?.hospitalName} • {new Date(camp.date).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400">{camp.location}</p>
                </div>
                <button 
                  onClick={() => handleJoinCamp(camp._id)}
                  style={{ background: "#3b82f6", color: "#fff", padding: "8px 16px", borderRadius: 12, border: "none", fontWeight: 600, cursor: "pointer" }}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
