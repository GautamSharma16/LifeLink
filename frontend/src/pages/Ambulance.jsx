import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const ambulanceTypes = [
  { id: "basic", label: "Basic Life Support", desc: "For non-critical transport", icon: "🚑", price: "₹500–800", color: "#3b82f6" },
  { id: "advanced", label: "Advanced Life Support", desc: "ICU-equipped ambulance", icon: "🏥", price: "₹1200–2000", color: "#e11d48" },
  { id: "patient", label: "Patient Transport", desc: "For discharge/regular visits", icon: "🚐", price: "₹300–500", color: "#10b981" },
  { id: "air", label: "Air Ambulance", desc: "Critical long-distance cases", icon: "✈️", price: "₹50,000+", color: "#8b5cf6" },
];

const statusColors = { "assigned": "#f59e0b", "completed": "#10b981", "pending": "#3b82f6", "cancelled": "#94a3b8" };

export default function Ambulance() {
  const [tab, setTab] = useState("request");
  const [selectedType, setSelectedType] = useState("");
  const [form, setForm] = useState({ pickup: "", drop: "", contact: "", notes: "", patientCondition: "stable" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (tab === "track") {
      api.get("/ambulance").then(res => setRecentRequests(res.data.data)).catch(console.error);
    }
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) { toast.error("Please select ambulance type"); return; }
    if (!form.pickup || !form.drop || !form.contact) { toast.error("Please fill all required fields"); return; }
    setLoading(true);
    try {
      const payload = {
        pickupAddress: form.pickup,
        hospitalDestination: form.drop,
        city: form.pickup.split(',').pop().trim() || "Unknown",
        patientCondition: form.patientCondition,
        contact: form.contact,
        type: selectedType,
        notes: form.notes
      };
      const { data } = await api.post("/ambulance", payload);
      setRequestId(data.data._id);
      setSubmitted(true);
      toast.success("Ambulance dispatched!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to request ambulance");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = () => {
    const found = recentRequests.find(r => r._id === trackId.trim());
    if (found) setTracked(found);
    else toast.error("Request ID not found.");
  };

  const inputStyle = {
    width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 14px",
    fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif", background: "#fff",
    color: "#1e293b", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
        .font-display{font-family:'Instrument Serif',serif;}
        input:focus,select:focus,textarea:focus{border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,0.1)!important;}
        .dark .amb-card{background:#1e293b!important;border-color:#334155!important;}
        .dark input,.dark select,.dark textarea{background:#0f172a!important;border-color:#334155!important;color:#f1f5f9!important;}
        .dark .tab-bar{background:#1e293b!important;border-color:#334155!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes ping{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.5}}
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1e293b,#1e3a5f)", padding: "56px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div animate={{ x: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: "absolute", top: "40%", left: "10%", fontSize: 80, opacity: 0.08 }}>🚑</motion.div>
        <motion.div animate={{ x: [20, -20, 20] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: "absolute", top: "30%", right: "10%", fontSize: 60, opacity: 0.06 }}>✚</motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 50, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "ping 2s infinite" }} />
            <span style={{ color: "#93c5fd", fontSize: 13, fontWeight: 600 }}>24/7 Emergency Dispatch</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Emergency <em style={{ color: "#93c5fd" }}>Ambulance</em></h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500, margin: "0 auto 28px" }}>Request an ambulance or track your dispatch in real-time.</p>
          {/* Quick call */}
          <a href="tel:102" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#e11d48", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15, boxShadow: "0 8px 30px rgba(225,29,72,0.4)" }}>
            📞 Call 102 — National Ambulance
          </a>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1100, margin: "-40px auto 0", padding: "0 24px 60px" }}>

        {/* Tab Bar */}
        <div className="tab-bar" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "6px", display: "flex", gap: 4, marginBottom: 32, boxShadow: "0 4px 30px rgba(0,0,0,0.06)" }}>
          {[{ id: "request", label: "🚑 Request Ambulance" }, { id: "track", label: "📍 Track Request" }, { id: "info", label: "ℹ️ Types & Pricing" }].map(t => (
            <motion.button key={t.id} onClick={() => setTab(t.id)} whileHover={{ scale: tab !== t.id ? 1.02 : 1 }} style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: "none", background: tab === t.id ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "transparent", color: tab === t.id ? "#fff" : "#64748b", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "request" && (
            <motion.div key="request" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "60px 24px" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>✓</motion.div>
                  <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Ambulance Dispatched!</h2>
                  <p style={{ color: "#64748b", marginBottom: 8 }}>Your ambulance is on the way. Track your request below.</p>
                  <div style={{ display: "inline-block", background: "#fff", border: "2px solid #3b82f6", borderRadius: 16, padding: "16px 32px", marginBottom: 24 }}>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Your Request ID</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: "#3b82f6", margin: 0 }}>{requestId}</p>
                  </div>
                  <br />
                  <motion.button whileHover={{ scale: 1.03 }} onClick={() => { setSubmitted(false); setForm({ pickup: "", drop: "", contact: "", notes: "", patientCondition: "stable" }); setSelectedType(""); }} style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    New Request
                  </motion.button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div>
                    {/* Type selection */}
                    <div className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px", marginBottom: 20 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Select Ambulance Type *</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {ambulanceTypes.map(t => (
                          <motion.div key={t.id} whileHover={{ x: 4 }} onClick={() => setSelectedType(t.id)} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", border: `2px solid ${selectedType === t.id ? t.color : "#e2e8f0"}`, borderRadius: 14, cursor: "pointer", background: selectedType === t.id ? `${t.color}0d` : "#fff", transition: "all 0.2s" }}>
                            <span style={{ fontSize: 28 }}>{t.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: selectedType === t.id ? t.color : "#1e293b" }}>{t.label}</div>
                              <div style={{ fontSize: 12, color: "#94a3b8" }}>{t.desc}</div>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.price}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Quick contacts */}
                    <div className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "24px" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Emergency Numbers</h3>
                      {[{ label: "National Ambulance", num: "102", color: "#e11d48" }, { label: "Disaster Management", num: "108", color: "#f59e0b" }, { label: "Police", num: "100", color: "#3b82f6" }, { label: "Fire", num: "101", color: "#f97316" }].map(c => (
                        <a key={c.num} href={`tel:${c.num}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: `${c.color}0d`, borderRadius: 10, marginBottom: 8, textDecoration: "none" }}>
                          <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{c.label}</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: c.color }}>{c.num}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px" }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Request Details</h3>
                      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>📍 Pickup Location *</label>
                          <input value={form.pickup} onChange={e => setForm(p => ({...p, pickup: e.target.value}))} placeholder="Street, Area, City" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>🏥 Drop Location *</label>
                          <input value={form.drop} onChange={e => setForm(p => ({...p, drop: e.target.value}))} placeholder="Hospital / Destination" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>📞 Contact Number *</label>
                          <input value={form.contact} onChange={e => setForm(p => ({...p, contact: e.target.value}))} placeholder="+91 98765 43210" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>🏥 Patient Condition</label>
                          <select value={form.patientCondition} onChange={e => setForm(p => ({...p, patientCondition: e.target.value}))} style={{ ...inputStyle, cursor: "pointer" }}>
                            <option value="stable">Stable — Conscious & responsive</option>
                            <option value="serious">Serious — Needs immediate care</option>
                            <option value="critical">Critical — Life threatening</option>
                            <option value="unconscious">Unconscious / Unresponsive</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>📝 Additional Notes</label>
                          <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} rows={3} placeholder="Any specific medical details, address landmarks..." style={{ ...inputStyle, resize: "vertical" }} />
                        </div>
                        <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loading} style={{ background: loading ? "#94a3b8" : "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 8px 30px rgba(225,29,72,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          {loading ? <><span style={{ display:"inline-block",width:18,height:18,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} /> Dispatching...</> : "🚑 Request Ambulance Now"}
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "track" && (
            <motion.div key="track" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "32px", maxWidth: 600, margin: "0 auto 24px" }}>
                <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Track Your Ambulance</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  <input value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="Enter Request ID (e.g. AMB-1023)" style={{ ...inputStyle, flex: 1 }} />
                  <motion.button whileHover={{ scale: 1.03 }} onClick={handleTrack} style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
                    Track
                  </motion.button>
                </div>
              </div>

              {tracked && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "32px", maxWidth: 600, margin: "0 auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700 }}>{tracked.id}</h3>
                    <span style={{ background: `${statusColors[tracked.status]}15`, color: statusColors[tracked.status], fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>{tracked.status}</span>
                  </div>
                  {[["🚑 Type", tracked.type], ["📍 Pickup", tracked.pickup], ["🏥 Drop", tracked.drop], ["👨‍✈️ Driver", tracked.driver], ["🚗 Vehicle", tracked.vehicle], ["⏱️ ETA", tracked.eta]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 14, color: "#64748b" }}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{val}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Recent Requests */}
              <div className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px", maxWidth: 600, margin: "24px auto 0" }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#64748b" }}>Your Recent Requests</h4>
                {recentRequests.map(r => (
                  <motion.div key={r._id} whileHover={{ x: 4 }} onClick={() => setTrackId(r._id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f8fafc", borderRadius: 12, marginBottom: 8, cursor: "pointer" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r._id}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.patientCondition} Patient</div>
                    </div>
                    <span style={{ background: `${statusColors[r.status]}15`, color: statusColors[r.status], fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>{r.status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "info" && (
            <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20, marginBottom: 32 }}>
                {ambulanceTypes.map(t => (
                  <motion.div key={t.id} whileHover={{ y: -6 }} className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{t.icon}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: t.color }}>{t.label}</h3>
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, lineHeight: 1.5 }}>{t.desc}</p>
                    <div style={{ background: `${t.color}10`, color: t.color, borderRadius: 12, padding: "10px", fontWeight: 800, fontSize: 16 }}>{t.price}</div>
                  </motion.div>
                ))}
              </div>

              {/* FAQ */}
              <div className="amb-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "32px" }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>What to Expect</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { n: "01", title: "Request & Confirm", desc: "Submit your request with pickup and drop details." },
                    { n: "02", title: "Dispatch in Minutes", desc: "Nearest available ambulance is dispatched immediately." },
                    { n: "03", title: "Track in Real-Time", desc: "Use your Request ID to track the ambulance location." },
                    { n: "04", title: "Safe Transport", desc: "Trained paramedics ensure safe patient transport." },
                  ].map(s => (
                    <div key={s.n} style={{ display: "flex", gap: 14, padding: "16px", background: "#f8fafc", borderRadius: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#e2e8f0", flexShrink: 0 }}>{s.n}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}