import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const urgencyColors = { low: "#10b981", medium: "#f59e0b", critical: "#e11d48" };
const urgencyBg = { low: "#f0fdf4", medium: "#fffbeb", critical: "#fff1f2" };

// Demo data for when API is unavailable
const demoData = [
  { _id: "1", bloodGroup: "O+", patientName: "Ravi Kumar", units: 2, hospitalName: "AIIMS Delhi", city: "New Delhi", emergencyLevel: "critical", requester: { name: "Sunita Kumar", _id: "x1" } },
  { _id: "2", bloodGroup: "A-", patientName: "Priya Sharma", units: 1, hospitalName: "Safdarjung Hospital", city: "New Delhi", emergencyLevel: "medium", requester: { name: "Ajay Sharma", _id: "x2" } },
  { _id: "3", bloodGroup: "B+", patientName: "Mohammed Ali", units: 3, hospitalName: "Max Hospital", city: "Mumbai", emergencyLevel: "low", requester: { name: "Fatima Ali", _id: "x3" } },
  { _id: "4", bloodGroup: "AB+", patientName: "Kavita Singh", units: 1, hospitalName: "Fortis Hospital", city: "Bangalore", emergencyLevel: "critical", requester: { name: "Rohit Singh", _id: "x4" } },
  { _id: "5", bloodGroup: "O-", patientName: "Arjun Nair", units: 4, hospitalName: "Apollo Hospital", city: "Chennai", emergencyLevel: "medium", requester: { name: "Meena Nair", _id: "x5" } },
  { _id: "6", bloodGroup: "B-", patientName: "Deepa Patel", units: 2, hospitalName: "Nanavati Hospital", city: "Mumbai", emergencyLevel: "low", requester: { name: "Vijay Patel", _id: "x6" } },
];

export default function DonateBlood() {
  const navigate = useNavigate();
  const [data, setData] = useState(demoData);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("");
  const [accepting, setAccepting] = useState(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem("lifelink_user") || "null"); } catch { return null; } })();
  const userId = user?._id;

  const fetchData = async () => {
    setLoading(true);
    try {
      let q = "?status=open";
      if (bloodGroup) q += `&bloodGroup=${bloodGroup}`;
      if (city) q += `&city=${city}`;
      const { data: res } = await api.get(`/blood${q}`);
      setData(res.data?.length ? res.data : demoData);
    } catch {
      // Use demo data on error
      let filtered = demoData;
      if (bloodGroup) filtered = filtered.filter(d => d.bloodGroup === bloodGroup);
      if (city) filtered = filtered.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
      if (urgency) filtered = filtered.filter(d => d.emergencyLevel === urgency);
      setData(filtered);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAccept = async (id) => {
    if (!userId) { toast.error("Please login first"); navigate("/login"); return; }
    setAccepting(id);
    try {
      const { data: res } = await api.patch(`/blood/${id}/accept`);
      if (res.success) { toast.success("Accepted! Check your profile."); navigate("/profile"); }
      else toast.error(res.message || "Failed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Accepted! (demo mode)");
    } finally { setAccepting(null); }
  };

  const applyFilters = () => {
    let filtered = demoData;
    if (bloodGroup) filtered = filtered.filter(d => d.bloodGroup === bloodGroup);
    if (city) filtered = filtered.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
    if (urgency) filtered = filtered.filter(d => d.emergencyLevel === urgency);
    setData(filtered);
    if (!filtered.length) toast.error("No results found");
  };

  const resetFilters = () => {
    setCity(""); setBloodGroup(""); setUrgency("");
    setData(demoData);
    toast.success("Filters cleared");
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .font-display { font-family:'Instrument Serif',serif; }
        input:focus, select:focus { outline:none; border-color:#e11d48!important; box-shadow:0 0 0 3px rgba(225,29,72,0.1)!important; }
        .dark .filter-bar { background:#1e293b!important; border-color:#334155!important; }
        .dark input, .dark select { background:#0f172a!important; border-color:#334155!important; color:#f1f5f9!important; }
        .dark .blood-card { background:#1e293b!important; border-color:#334155!important; }
        .dark .label-muted { color:#94a3b8!important; }
      `}</style>

      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", padding: "56px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div animate={{ scale: [1,1.2,1], opacity: [0.2,0.35,0.2] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: "absolute", top: -40, right: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(225,29,72,0.4),transparent)", filter: "blur(50px)", pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#fda4af", display: "block", marginBottom: 12 }}>Be a Hero</span>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Donate Blood, <em style={{ color: "#fda4af" }}>Save Lives</em></h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Browse open blood requests and accept one to help a patient in need.</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: "-40px auto 0", padding: "0 24px 60px" }}>

        {/* Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="filter-bar" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "20px 24px", marginBottom: 32, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", boxShadow: "0 4px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>City</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Filter by city..." style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Blood Group</label>
            <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: "#fff", boxSizing: "border-box" }}>
              <option value="">All groups</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Urgency</label>
            <select value={urgency} onChange={e => setUrgency(e.target.value)} style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: "#fff", boxSizing: "border-box" }}>
              <option value="">All levels</option>
              <option value="critical">🔴 Critical</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={applyFilters} style={{ background: "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
              Apply Filters
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={resetFilters} style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 10, padding: "11px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Results Count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={{ color: "#64748b", fontSize: 14 }}><strong style={{ color: "#1e293b" }}>{data.length}</strong> request{data.length !== 1 ? "s" : ""} found</p>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: "#fff1f2", color: "#e11d48", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>🔴 {data.filter(d=>d.emergencyLevel==="critical").length} Critical</span>
            <span style={{ background: "#fffbeb", color: "#92400e", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>🟡 {data.filter(d=>d.emergencyLevel==="medium").length} Medium</span>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#e11d48", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#64748b" }}>Loading requests...</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
            <AnimatePresence>
              {data.map((p, i) => {
                const isOwn = p.requester?._id === userId;
                const lvl = p.emergencyLevel || "medium";
                return (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }} className="blood-card" style={{ background: "#fff", border: `1px solid ${isOwn ? "#bbf7d0" : "#e2e8f0"}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.05)", transition: "all 0.3s" }}>
                    {/* Card top accent */}
                    <div style={{ height: 4, background: urgencyColors[lvl] }} />

                    <div style={{ padding: "24px 24px 20px" }}>
                      {/* Header row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${urgencyColors[lvl]},${urgencyColors[lvl]}aa)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff" }}>
                          {p.bloodGroup}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span style={{ background: urgencyBg[lvl], color: urgencyColors[lvl], fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" }}>
                            {lvl === "critical" ? "🔴" : lvl === "medium" ? "🟡" : "🟢"} {lvl}
                          </span>
                          {isOwn && <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Your Request</span>}
                        </div>
                      </div>

                      {/* Patient info */}
                      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: "#1e293b" }}>{p.patientName}</h3>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { icon: "🏥", label: "Hospital", value: p.hospitalName },
                          { icon: "📍", label: "City", value: p.city },
                          { icon: "👤", label: "Requested by", value: p.requester?.name || "Anonymous" },
                          { icon: "🩸", label: "Units needed", value: `${p.units} unit${p.units > 1 ? "s" : ""}` },
                        ].map(row => (
                          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 14 }}>{row.icon}</span>
                            <span className="label-muted" style={{ fontSize: 12, color: "#94a3b8", minWidth: 90 }}>{row.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {!isOwn && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => handleAccept(p._id)} disabled={accepting === p._id} style={{ marginTop: 18, width: "100%", background: accepting === p._id ? "#94a3b8" : "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: accepting === p._id ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(225,29,72,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s" }}>
                          {accepting === p._id ? (<><span style={{ display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} /> Accepting...</>) : "💉 Accept & Donate"}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!loading && !data.length && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🩸</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No Requests Found</h3>
            <p style={{ color: "#64748b" }}>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}