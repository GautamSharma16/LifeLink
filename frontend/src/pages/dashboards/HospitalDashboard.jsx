import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../lib/api";
import { toast } from "react-hot-toast";

export default function HospitalDashboard() {
  const [user, setUser] = useState(null);
  const [beds, setBeds] = useState(0);
  const [requests, setRequests] = useState([]);
  const [showCampForm, setShowCampForm] = useState(false);
  const [campData, setCampData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    city: ""
  });

  const fetchData = async () => {
    try {
      const uRes = await api.get("/auth/me");
      if (uRes.data.success) {
        setUser(uRes.data.data);
        setBeds(uRes.data.data.availableBeds || 0);
      }
      const reqRes = await api.get("/blood?status=open");
      if (reqRes.data.success) setRequests(reqRes.data.data);
    } catch (err) {
      console.error("Error fetching hospital data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBeds = async (newBeds) => {
    try {
      const res = await api.put("/auth/update-profile", { availableBeds: newBeds });
      if (res.data.success) {
        setBeds(newBeds);
        toast.success("Beds updated");
      }
    } catch (err) {
      toast.error("Failed to update beds");
    }
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/camps", { ...campData, city: user.city });
      if (res.data.success) {
        toast.success("Donation camp created!");
        setShowCampForm(false);
        setCampData({ title: "", description: "", date: "", time: "", location: "", city: "" });
      }
    } catch (err) {
      toast.error("Failed to create camp");
    }
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontWeight: 700 }}>{user?.hospitalName || "Hospital Admin"}</h1>
          <p style={{ color: "#64748b" }}>Manage resources and incoming requests.</p>
        </div>
        <button 
          onClick={() => setShowCampForm(true)}
          style={{ background: "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", padding: "12px 24px", borderRadius: 14, border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Organize Camp 🩸
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Available Beds (Live)</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <p style={{ fontSize: 40, fontWeight: 800, color: "#10b981", margin: 0 }}>{beds}</p>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => updateBeds(beds - 1)} style={{ background: "#f1f5f9", border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>-</button>
              <button onClick={() => updateBeds(beds + 1)} style={{ background: "#f1f5f9", border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>+</button>
            </div>
          </div>
        </motion.div>

        {[
          { label: "ICU Available", value: user?.icuBeds || 0, color: "#3b82f6" },
          { label: "Oxygen Cylinders", value: user?.oxygenCylinders || 0, color: "#8b5cf6" },
          { label: "Active Requests", value: requests.length, color: "#e11d48" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.1 }}
            style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {showCampForm && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Organize Blood Donation Camp</h2>
          <form className="camp-form" onSubmit={handleCreateCamp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <style>{`
              @media (max-width: 600px) {
                .camp-form {
                  grid-template-columns: 1fr !important;
                }
                .camp-form > .col-span-2 {
                  grid-column: span 1 !important;
                }
              }
            `}</style>
            <input placeholder="Camp Title" className="p-3 border rounded-xl" required onChange={e => setCampData({...campData, title: e.target.value})} />
            <input placeholder="Location" className="p-3 border rounded-xl" required onChange={e => setCampData({...campData, location: e.target.value})} />
            <input type="date" className="p-3 border rounded-xl" required onChange={e => setCampData({...campData, date: e.target.value})} />
            <input type="time" className="p-3 border rounded-xl" required onChange={e => setCampData({...campData, time: e.target.value})} />
            <textarea placeholder="Description" className="p-3 border rounded-xl col-span-2" required onChange={e => setCampData({...campData, description: e.target.value})} />
            <div className="col-span-2 flex gap-4">
              <button type="submit" style={{ background: "#e11d48", color: "#fff", padding: "12px 24px", borderRadius: 12, border: "none", fontWeight: 700 }}>Create Camp</button>
              <button type="button" onClick={() => setShowCampForm(false)} className="p-3">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Live Blood Requests</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map((req, i) => (
            <div key={i} style={{ border: "1px solid #e2e8f0", padding: 16, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{req.bloodGroup} Needed</h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{req.patientName} • ETA: 15 mins</p>
              </div>
              <span style={{ background: "#fff1f2", color: "#e11d48", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>CRITICAL</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
