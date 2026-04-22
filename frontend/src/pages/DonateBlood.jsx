import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const urgencyColors = { low: "#10b981", medium: "#f59e0b", critical: "#e11d48" };
const urgencyBg = { low: "#f0fdf4", medium: "#fffbeb", critical: "#fff1f2" };
const urgencyIcons = { low: "🟢", medium: "🟡", critical: "🔴" };

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    setShowMobileFilters(false);
    if (!filtered.length) toast.error("No results found");
  };

  const resetFilters = () => {
    setCity(""); setBloodGroup(""); setUrgency("");
    setData(demoData);
    toast.success("Filters cleared");
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .blood-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .blood-card:hover {
          transform: translateY(-4px);
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #e11d48 !important;
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1) !important;
        }
        
        @media (max-width: 768px) {
          input, select, button {
            font-size: 16px !important;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      {/* Hero Section with Background Image */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2d1b4e 100%)",
        padding: "clamp(48px, 8vw, 80px) 24px",
        textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Animated background elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(225,29,72,0.3), transparent)",
            filter: "blur(60px)",
            pointerEvents: "none"
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent)",
            filter: "blur(70px)",
            pointerEvents: "none"
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-block", marginBottom: 20 }}
          >
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#fda4af",
              background: "rgba(253, 164, 175, 0.15)",
              padding: "8px 20px",
              borderRadius: 40,
              backdropFilter: "blur(10px)"
            }}>
              🩸 BE A HERO
            </span>
          </motion.div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            Donate Blood, <br />
            <span style={{ color: "#fda4af", display: "inline-block" }}>Save Lives</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            maxWidth: 550,
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Browse open blood requests and accept one to help a patient in need. Every donation saves up to 3 lives.
          </p>

          {/* Stats Row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 5vw, 48px)",
            marginTop: 40,
            flexWrap: "wrap"
          }}>
            {[
              { value: "12k+", label: "Active Donors" },
              { value: "342", label: "Lives Saved" },
              { value: "30min", label: "Avg Response" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, color: "#fda4af" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom wave decoration */}
        <svg
          style={{ position: "absolute", bottom: -1, left: 0, width: "100%" }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#f8fafc"
            opacity="1"
          />
        </svg>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Mobile Filter Toggle */}
        <div style={{ display: "none", marginBottom: 20 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{
              width: "100%",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer"
            }}
          >
            <span>🔍 Filter Requests</span>
            <span>{showMobileFilters ? "▲" : "▼"}</span>
          </motion.button>
        </div>

        {/* Filter Bar - Desktop & Mobile */}
        <AnimatePresence>
          {(showMobileFilters || window.innerWidth > 768) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: "24px 28px",
                marginBottom: 32,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9"
              }}
            >
              <div style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "flex-end"
              }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                    📍 City
                  </label>
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    style={{
                      width: "100%",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s"
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                    🩸 Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">All groups</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                    ⚡ Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">All levels</option>
                    <option value="critical">🔴 Critical</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyFilters}
                    style={{
                      background: "linear-gradient(135deg, #e11d48, #be123c)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 14,
                      padding: "12px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Apply Filters
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetFilters}
                    style={{
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    Reset
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #fee2e2, #fff1f2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20
            }}>
              🩸
            </div>
            <div>
              <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Open Requests
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                {data.length} {data.length === 1 ? "request" : "requests"} waiting for donors
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{
              background: "#fff1f2",
              color: "#e11d48",
              fontSize: 12,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e11d48" }} />
              Critical: {data.filter(d => d.emergencyLevel === "critical").length}
            </span>
            <span style={{
              background: "#fffbeb",
              color: "#d97706",
              fontSize: 12,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
              Medium: {data.filter(d => d.emergencyLevel === "medium").length}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-content-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 32,
          alignItems: "start"
        }}>
        <style>{`
          @media (max-width: 1100px) {
            .main-content-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
          {/* Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24
          }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 80, gridColumn: "1/-1" }}>
                <div style={{
                  width: 50,
                  height: 50,
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#e11d48",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 20px"
                }} />
                <p style={{ color: "#64748b" }}>Loading requests...</p>
              </div>
            ) : data.length === 0 ? (
              <div style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "60px 24px",
                background: "#fff",
                borderRadius: 28,
                border: "1px solid #f1f5f9"
              }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🩸</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No Requests Found</h3>
                <p style={{ color: "#64748b" }}>Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              data.map((p, i) => {
                const isOwn = p.requester?._id === userId;
                const lvl = p.emergencyLevel || "medium";
                return (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="blood-card"
                    style={{
                      background: "#fff",
                      borderRadius: 28,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: `1px solid ${isOwn ? "#bbf7d0" : "#f1f5f9"}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  >
                    {/* Colored top bar */}
                    <div style={{ height: 5, background: urgencyColors[lvl] }} />

                    <div style={{ padding: "24px" }}>
                      {/* Header with Blood Group */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 20
                      }}>
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: 20,
                          background: `linear-gradient(135deg, ${urgencyColors[lvl]}20, ${urgencyColors[lvl]}08)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 26,
                          fontWeight: 800,
                          color: urgencyColors[lvl],
                          border: `2px solid ${urgencyColors[lvl]}30`
                        }}>
                          {p.bloodGroup}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <span style={{
                            background: urgencyBg[lvl],
                            color: urgencyColors[lvl],
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "5px 12px",
                            borderRadius: 30,
                            textTransform: "capitalize",
                            display: "flex",
                            alignItems: "center",
                            gap: 5
                          }}>
                            {urgencyIcons[lvl]} {lvl}
                          </span>
                          {isOwn && (
                            <span style={{
                              background: "#f0fdf4",
                              color: "#16a34a",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "5px 12px",
                              borderRadius: 30
                            }}>
                              ✓ Your Request
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Patient Name */}
                      <h3 style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 16,
                        lineHeight: 1.3
                      }}>
                        {p.patientName}
                      </h3>

                      {/* Details Grid */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 12,
                        marginBottom: 20
                      }}>
                        {[
                          { icon: "🏥", label: "Hospital", value: p.hospitalName },
                          { icon: "📍", label: "City", value: p.city },
                          { icon: "👤", label: "Requested by", value: p.requester?.name || "Anonymous" },
                          { icon: "🩸", label: "Units needed", value: `${p.units} unit${p.units > 1 ? "s" : ""}` },
                        ].map(row => (
                          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14 }}>{row.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{row.label}</div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#334155", lineHeight: 1.3 }}>
                                {row.value.length > 25 ? `${row.value.slice(0, 22)}...` : row.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      {!isOwn && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAccept(p._id)}
                          disabled={accepting === p._id}
                          style={{
                            width: "100%",
                            background: accepting === p._id ? "#94a3b8" : `linear-gradient(135deg, ${urgencyColors[lvl]}, ${urgencyColors[lvl]}dd)`,
                            color: "#fff",
                            border: "none",
                            borderRadius: 20,
                            padding: "14px 20px",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: accepting === p._id ? "not-allowed" : "pointer",
                            fontFamily: "'Inter', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            transition: "all 0.3s"
                          }}
                        >
                          {accepting === p._id ? (
                            <>
                              <span style={{
                                width: 18,
                                height: 18,
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "#fff",
                                borderRadius: "50%",
                                animation: "spin 0.8s linear infinite"
                              }} />
                              Accepting...
                            </>
                          ) : (
                            <>💉 Accept & Donate →</>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Side Panel */}
          <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Emergency Alerts Card */}
            <div style={{
              background: "linear-gradient(135deg, #fff, #fff5f6)",
              borderRadius: 28,
              padding: "24px",
              border: "1px solid #fee2e2",
              boxShadow: "0 4px 20px rgba(225,29,72,0.08)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  background: "#fff1f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24
                }}>
                  🚨
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#e11d48" }}>Emergency Alerts</h3>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Urgent requests near you</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {data.filter(d => d.emergencyLevel === "critical").slice(0, 3).map((alert, idx) => (
                  <div key={alert._id} style={{
                    padding: 16,
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #fee2e2",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>🔴</span>
                        <span style={{ fontWeight: 800, color: "#e11d48", fontSize: 15 }}>{alert.bloodGroup} Needed</span>
                      </div>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>Just now</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#334155", margin: "0 0 12px", lineHeight: 1.5 }}>
                      {alert.patientName} requires {alert.units} unit{alert.units > 1 ? "s" : ""} at {alert.hospitalName.split(" ")[0]}.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAccept(alert._id)}
                      style={{
                        background: "linear-gradient(135deg, #e11d48, #be123c)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "10px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        width: "100%"
                      }}
                    >
                      Help Now →
                    </motion.button>
                  </div>
                ))}
                {data.filter(d => d.emergencyLevel === "critical").length === 0 && (
                  <div style={{ textAlign: "center", padding: "30px 20px" }}>
                    <span style={{ fontSize: 48, opacity: 0.5 }}>✅</span>
                    <p style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>No critical alerts in your area.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Impact Card with Image */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <div style={{
                height: 120,
                backgroundImage: "url('https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }} />
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Donation Impact</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginBottom: 20 }}>
                  Every donation can save up to 3 lives. Your contribution matters more than you think.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "14px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fda4af" }}>342</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Lives Saved</div>
                  </div>
                  <div style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "14px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fda4af" }}>12k+</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Active Donors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div style={{
              background: "#fff",
              borderRadius: 28,
              padding: "24px",
              border: "1px solid #f1f5f9",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>❤️</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Not sure if you can donate?</h4>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                Check our eligibility guidelines before accepting a request.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "none",
                  borderRadius: 14,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Learn More →
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style>{`
        @media (max-width: 1024px) {
          .filter-bar {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .filter-bar > div {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-bar > div:last-child {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}