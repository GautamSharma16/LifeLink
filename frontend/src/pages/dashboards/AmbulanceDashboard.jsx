import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../lib/api";
import { toast } from "react-hot-toast";

export default function AmbulanceDashboard() {
  const [online, setOnline] = useState(true);
  const [requests, setRequests] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/ambulance?status=pending");
      if (res.data.success) setRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching ambulance requests", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await api.put(`/ambulance/${id}/accept`);
      if (res.data.success) {
        toast.success("Ride accepted!");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to accept ride");
    }
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontWeight: 700 }}>Driver Dashboard</h1>
        </div>
        <button 
          onClick={() => setOnline(!online)}
          style={{ background: online ? "#10b981" : "#e2e8f0", color: online ? "#fff" : "#64748b", padding: "12px 24px", borderRadius: 24, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: online ? "#fff" : "#94a3b8" }} />
          {online ? "On Duty" : "Off Duty"}
        </button>
      </div>

      <div className="amb-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
      <style>{`
        @media (max-width: 900px) {
          .amb-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        <div style={{ background: "#e2e8f0", borderRadius: 24, minHeight: 400, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 48 }}>🗺️</span>
              <p style={{ fontWeight: 600, marginTop: 8 }}>Live GPS Tracking enabled</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e11d48", borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(225,29,72,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>🚨</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#e11d48" }}>{requests.length > 0 ? "New Request" : "No Pending Rides"}</h2>
            </div>
            {requests.map((req, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Pickup: {req.pickupAddress}</p>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 4px" }}>To: {req.hospitalDestination}</p>
                <p style={{ fontSize: 13, color: "#e11d48", fontWeight: 700, marginBottom: 12 }}>Condition: {req.patientCondition}</p>
                <button 
                  onClick={() => handleAccept(req._id)}
                  style={{ width: "100%", background: "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", padding: "12px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Accept Ride
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Today's History</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p className="text-slate-400 text-sm">No completed trips today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
