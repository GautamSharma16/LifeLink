import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const ambulanceTypes = [
  { id: "basic", label: "Basic Life Support", desc: "For non-critical transport with trained staff", icon: "🚑", price: "₹500–800", color: "#3b82f6", gradient: "from-blue-500 to-blue-600" },
  { id: "advanced", label: "Advanced Life Support", desc: "ICU-equipped ambulance with paramedics", icon: "🏥", price: "₹1200–2000", color: "#e11d48", gradient: "from-rose-500 to-rose-600" },
  { id: "patient", label: "Patient Transport", desc: "For discharge, routine checkups, and transfers", icon: "🚐", price: "₹300–500", color: "#10b981", gradient: "from-emerald-500 to-emerald-600" },
  { id: "air", label: "Air Ambulance", desc: "Critical long-distance emergency transport", icon: "✈️", price: "₹50,000+", color: "#8b5cf6", gradient: "from-purple-500 to-purple-600" },
];

const statusColors = { assigned: "#f59e0b", completed: "#10b981", pending: "#3b82f6", cancelled: "#94a3b8", enroute: "#8b5cf6" };

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
    if (!selectedType) { toast.error("Please select an ambulance type"); return; }
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
      toast.success("Ambulance dispatched successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to request ambulance");
    } finally { setLoading(false); }
  };

  const handleTrack = () => {
    const found = recentRequests.find(r => r._id === trackId.trim());
    if (found) setTracked(found);
    else toast.error("Request ID not found. Please check and try again.");
  };

  const getETA = () => {
    const mins = Math.floor(Math.random() * 15) + 5;
    return `${mins}-${mins + 5} minutes`;
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important; }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .pulse { animation: pulse-ring 2s ease-out infinite; }
        .ambulance-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .ambulance-card:hover { transform: translateY(-4px); }
      `}</style>

      {/* Hero Section with Animated Ambulance */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #1e293b 0%, #1e3a5f 50%, #0f172a 100%)",
        padding: "clamp(50px, 8vw, 80px) 24px",
        textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Animated Background Elements */}
        <motion.div
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "20%", left: "5%", fontSize: 100, opacity: 0.05 }}
        >
          🚑
        </motion.div>
        <motion.div
          animate={{ x: [50, -50, 50] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "10%", right: "5%", fontSize: 80, opacity: 0.05 }}
        >
          ✚
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ display: "inline-block", marginBottom: 20 }}
          >
            <span style={{
              background: "rgba(59,130,246,0.2)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 50,
              padding: "8px 24px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#93c5fd",
              display: "inline-block",
              backdropFilter: "blur(10px)"
            }}>
              🚨 24/7 EMERGENCY DISPATCH
            </span>
          </motion.div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            Emergency <span style={{ color: "#60a5fa" }}>Ambulance</span><br />
            At Your Service
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 550,
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Request an ambulance in seconds. Our fleet is available 24/7 across all major cities.
          </p>

          {/* Emergency Numbers */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 40,
            flexWrap: "wrap"
          }}>
            {[
              { num: "102", label: "National Ambulance", color: "#e11d48" },
              { num: "108", label: "Disaster Management", color: "#f59e0b" },
              { num: "100", label: "Police", color: "#3b82f6" }
            ].map(emergency => (
              <motion.a
                key={emergency.num}
                href={`tel:${emergency.num}`}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: `linear-gradient(135deg, ${emergency.color}, ${emergency.color}dd)`,
                  color: "#fff",
                  textDecoration: "none",
                  padding: "12px 28px",
                  borderRadius: 50,
                  fontSize: 18,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                }}
              >
                <span style={{ fontSize: 20 }}>📞</span> {emergency.num} <span style={{ fontSize: 13, fontWeight: 500 }}>{emergency.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "-40px auto 0", padding: "0 24px 60px" }}>

        {/* Tab Bar - Glass Effect */}
        <div style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 20,
          padding: "6px",
          display: "flex",
          gap: 6,
          marginBottom: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,255,255,0.3)"
        }}>
          {[
            { id: "request", label: "🚑 Request Ambulance", icon: "🚑" },
            { id: "track", label: "📍 Track Your Ride", icon: "📍" },
            { id: "info", label: "ℹ️ Services & Pricing", icon: "ℹ️" }
          ].map(t => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              whileHover={{ scale: tab !== t.id ? 1.02 : 1 }}
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: 16,
                border: "none",
                background: tab === t.id ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "transparent",
                color: tab === t.id ? "#fff" : "#64748b",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "request" && (
            <motion.div
              key="request"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    textAlign: "center",
                    background: "#fff",
                    borderRadius: 32,
                    padding: "60px 40px",
                    maxWidth: 500,
                    margin: "0 auto",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      fontSize: 50
                    }}
                  >
                    🚑
                  </motion.div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: "#0f172a" }}>Ambulance Dispatched!</h2>
                  <p style={{ color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
                    Your ambulance is on the way. Estimated arrival in <strong>{getETA()}</strong>.
                  </p>
                  <div style={{
                    background: "#f1f5f9",
                    borderRadius: 16,
                    padding: "20px",
                    marginBottom: 24,
                    display: "inline-block"
                  }}>
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Your Request ID</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#3b82f6", letterSpacing: 1 }}>{requestId}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ pickup: "", drop: "", contact: "", notes: "", patientCondition: "stable" });
                      setSelectedType("");
                    }}
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 14,
                      padding: "14px 32px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    New Request →
                  </motion.button>
                </motion.div>
              ) : (
                <div className="amb-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <style>{`
                  @media (max-width: 900px) {
                    .amb-grid {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}</style>
                  {/* Left - Ambulance Types */}
                  <div>
                    <div style={{
                      background: "#fff",
                      borderRadius: 28,
                      padding: "28px",
                      marginBottom: 24,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: "1px solid #f1f5f9"
                    }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 24 }}>🚑</span> Select Ambulance Type
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {ambulanceTypes.map(t => (
                          <motion.div
                            key={t.id}
                            whileHover={{ x: 6 }}
                            onClick={() => setSelectedType(t.id)}
                            style={{
                              display: "flex",
                              gap: 16,
                              alignItems: "center",
                              padding: "16px 20px",
                              border: `2px solid ${selectedType === t.id ? t.color : "#e2e8f0"}`,
                              borderRadius: 20,
                              cursor: "pointer",
                              background: selectedType === t.id ? `${t.color}08` : "#fff",
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{
                              width: 56,
                              height: 56,
                              borderRadius: 18,
                              background: `${t.color}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 28
                            }}>
                              {t.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 16, color: selectedType === t.id ? t.color : "#1e293b" }}>{t.label}</div>
                              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{t.desc}</div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: t.color }}>{t.price}</div>
                            {selectedType === t.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ width: 24, height: 24, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}
                              >
                                ✓
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                      background: "linear-gradient(135deg, #1e293b, #1e3a5f)",
                      borderRadius: 28,
                      padding: "28px",
                      color: "#fff"
                    }}>
                      <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Why Choose Us?</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                          { icon: "⏱️", text: "Average response time: 8 minutes" },
                          { icon: "👨‍⚕️", text: "Trained paramedics & life support" },
                          { icon: "📍", text: "GPS-tracked vehicles" },
                          { icon: "💳", text: "Cashless insurance tie-ups" }
                        ].map(f => (
                          <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{f.icon}</span>
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{f.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right - Request Form */}
                  <div>
                    <div style={{
                      background: "#fff",
                      borderRadius: 28,
                      padding: "32px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: "1px solid #f1f5f9"
                    }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Request Details</h3>
                      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>📍 Pickup Location *</label>
                          <input
                            value={form.pickup}
                            onChange={e => setForm(p => ({ ...p, pickup: e.target.value }))}
                            placeholder="Street address, landmark, city"
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "14px 16px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif",
                              transition: "all 0.2s"
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>🏥 Destination Hospital *</label>
                          <input
                            value={form.drop}
                            onChange={e => setForm(p => ({ ...p, drop: e.target.value }))}
                            placeholder="Hospital name or address"
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "14px 16px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif"
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>📞 Contact Number *</label>
                          <input
                            value={form.contact}
                            onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                            placeholder="+91 98765 43210"
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "14px 16px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif"
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Patient Condition</label>
                          <select
                            value={form.patientCondition}
                            onChange={e => setForm(p => ({ ...p, patientCondition: e.target.value }))}
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "14px 16px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif",
                              background: "#fff",
                              cursor: "pointer"
                            }}
                          >
                            <option value="stable">🟢 Stable — Conscious & responsive</option>
                            <option value="serious">🟡 Serious — Needs immediate care</option>
                            <option value="critical">🔴 Critical — Life threatening</option>
                            <option value="unconscious">⚫ Unconscious / Unresponsive</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Additional Notes</label>
                          <textarea
                            value={form.notes}
                            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                            rows={3}
                            placeholder="Any specific instructions, landmarks, or medical details..."
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "14px 16px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif",
                              resize: "vertical"
                            }}
                          />
                        </div>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                          style={{
                            background: loading ? "#94a3b8" : "linear-gradient(135deg, #e11d48, #be123c)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 18,
                            padding: "18px 24px",
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            boxShadow: "0 8px 25px rgba(225,29,72,0.3)"
                          }}
                        >
                          {loading ? (
                            <>
                              <span style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                              Dispatching...
                            </>
                          ) : (
                            "🚑 Request Ambulance Now"
                          )}
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "track" && (
            <motion.div
              key="track"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{
                  background: "#fff",
                  borderRadius: 28,
                  padding: "36px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9"
                }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Track Your Ambulance</h3>
                  <p style={{ color: "#64748b", marginBottom: 24 }}>Enter your request ID to get real-time updates</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <input
                      value={trackId}
                      onChange={e => setTrackId(e.target.value)}
                      placeholder="Enter Request ID (e.g., AMB-1023)"
                      style={{
                        flex: 1,
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 14,
                        padding: "14px 16px",
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif"
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTrack}
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 14,
                        padding: "14px 28px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Track
                    </motion.button>
                  </div>
                </div>

                {tracked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: 24,
                      background: "#fff",
                      borderRadius: 28,
                      padding: "32px",
                      border: "1px solid #f1f5f9"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <div>
                        <p style={{ fontSize: 12, color: "#64748b" }}>Request ID</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{tracked._id}</p>
                      </div>
                      <span style={{
                        background: `${statusColors[tracked.status]}15`,
                        color: statusColors[tracked.status],
                        padding: "6px 16px",
                        borderRadius: 30,
                        fontSize: 13,
                        fontWeight: 700
                      }}>
                        {tracked.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>

                    {/* Status Timeline */}
                    <div style={{ marginBottom: 24 }}>
                      {[
                        { label: "Request Received", status: true, time: "Just now" },
                        { label: "Ambulance Dispatched", status: tracked.status !== "pending", time: "2 min ago" },
                        { label: "En Route to Pickup", status: tracked.status === "assigned" || tracked.status === "enroute", time: "Estimated" },
                        { label: "Arrived at Destination", status: tracked.status === "completed", time: "Pending" }
                      ].map((step, idx) => (
                        <div key={step.label} style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: step.status ? "#10b981" : "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 14,
                            marginRight: 16
                          }}>
                            {step.status ? "✓" : idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{step.label}</div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{step.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Driver Info */}
                    {tracked.driver && (
                      <div style={{
                        background: "#f8fafc",
                        borderRadius: 20,
                        padding: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16
                      }}>
                        <div style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          color: "#fff"
                        }}>
                          👨‍✈️
                        </div>
                        <div>
                          <p style={{ fontSize: 12, color: "#64748b" }}>Driver</p>
                          <p style={{ fontWeight: 700, fontSize: 16 }}>{tracked.driver.name}</p>
                          <p style={{ fontSize: 13, color: "#3b82f6" }}>{tracked.driver.phone}</p>
                        </div>
                        <motion.a
                          href={`tel:${tracked.driver.phone}`}
                          whileHover={{ scale: 1.05 }}
                          style={{
                            marginLeft: "auto",
                            background: "#10b981",
                            color: "#fff",
                            padding: "10px 16px",
                            borderRadius: 12,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 600
                          }}
                        >
                          Call Driver
                        </motion.a>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {tab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 40 }}>
                {ambulanceTypes.map(t => (
                  <motion.div
                    key={t.id}
                    whileHover={{ y: -8 }}
                    style={{
                      background: "#fff",
                      borderRadius: 24,
                      padding: "32px 24px",
                      textAlign: "center",
                      border: `1px solid ${t.color}20`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div style={{
                      width: 70,
                      height: 70,
                      borderRadius: 30,
                      background: `${t.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      margin: "0 auto 20px"
                    }}>
                      {t.icon}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: t.color }}>{t.label}</h3>
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, lineHeight: 1.5 }}>{t.desc}</p>
                    <div style={{
                      background: `${t.color}10`,
                      borderRadius: 16,
                      padding: "12px",
                      fontSize: 18,
                      fontWeight: 800,
                      color: t.color
                    }}>
                      {t.price}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Section */}
              <div style={{
                background: "#fff",
                borderRadius: 28,
                padding: "36px",
                border: "1px solid #f1f5f9"
              }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Frequently Asked Questions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                  {[
                    { q: "How fast is the response time?", a: "Average response time is 8-12 minutes depending on your location and traffic conditions." },
                    { q: "Are paramedics available?", a: "Yes, all our ambulances come with trained paramedics and basic life support equipment." },
                    { q: "Do you accept insurance?", a: "We have tie-ups with major insurance providers. Cashless treatment is available." },
                    { q: "Can I track the ambulance?", a: "Yes! Once your request is confirmed, you'll receive a tracking ID to monitor live location." }
                  ].map(faq => (
                    <div key={faq.q} style={{ padding: "16px", background: "#f8fafc", borderRadius: 20 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#0f172a" }}>❓ {faq.q}</p>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}