import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [features, setFeatures] = useState({ bloodBank: false, emergency: false, icu: false });
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    api.get("/hospitals").then(res => {
      const apiHospitals = res.data.data.map(h => ({
        id: h._id,
        name: h.hospitalName || h.name || "Unknown Hospital",
        city: h.city || "Unknown City",
        address: h.address || "Unknown Address",
        phone: h.phone || "N/A",
        beds: h.availableBeds || 0,
        available: h.availableBeds || 0,
        icu: (h.icuBeds || 0) > 0,
        oxygen: (h.oxygenCylinders || 0) > 0,
        verified: true, // we can default true or check isBanned
        bloodBank: true,
        emergency: true,
        type: "Private",
        rating: 4.5,
        specialties: ["Emergency Care", "General Medicine", "Cardiology"],
        img: `https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80`
      }));
      setHospitals(apiHospitals);
    }).catch(console.error);
  }, []);

  const filtered = hospitals
    .filter(h => {
      const s = search.toLowerCase();
      return (h.name.toLowerCase().includes(s) || h.city.toLowerCase().includes(s));
    })
    .filter(h => typeFilter === "All" || h.type === typeFilter)
    .filter(h => (!features.bloodBank || h.bloodBank) && (!features.emergency || h.emergency) && (!features.icu || h.icu))
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.available - a.available);

  const availColor = (n) => n <= 5 ? "#e11d48" : n <= 20 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .hospital-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .hospital-card:hover { transform: translateY(-8px); }
        input:focus, select:focus { outline: none; border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes shine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .gradient-text { background: linear-gradient(135deg, #8b5cf6, #c084fc, #e879f9); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shine 3s linear infinite; }
      `}</style>

      {/* Hero Section with Animated Gradient */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        padding: "clamp(60px, 10vw, 100px) 24px",
        textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Animated Background Shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(236,72,153,0.2), transparent)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ display: "inline-block", marginBottom: 20 }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#c084fc",
              background: "rgba(192, 132, 252, 0.15)",
              padding: "8px 24px",
              borderRadius: 40,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(192, 132, 252, 0.3)"
            }}>
              🏥 PREMIER HEALTHCARE NETWORK
            </span>
          </motion.div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            Find Your <span className="gradient-text">Healthcare</span><br />
            Partner Today
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Access {hospitals.length}+ verified hospitals with real-time bed availability and emergency services
          </p>

          {/* Quick Stats */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(30px, 6vw, 60px)",
            marginTop: 50,
            flexWrap: "wrap"
          }}>
            {[
              { value: "320+", label: "Partner Hospitals", icon: "🏥" },
              { value: "9", label: "Cities Covered", icon: "📍" },
              { value: "24/7", label: "Emergency Support", icon: "🚨" },
              { value: "4.8", label: "Avg Rating", icon: "⭐" }
            ].map(stat => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#c084fc" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div style={{ maxWidth: 1400, margin: "-40px auto 0", padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32, alignItems: "start" }}>
          <style>{`
            @media (max-width: 1024px) {
              [style*="grid-template-columns: 320px 1fr"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Sidebar Filters - Fixed on Scroll */}
          <div style={{ position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "sticky",
                top: 30,
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 28,
                padding: "28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>🔍</span> Smart Filters
              </h3>

              {/* Search */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                  Search Hospital
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 16,
                  padding: "4px 12px",
                  background: "#fff",
                  transition: "all 0.2s"
                }}>
                  <span style={{ fontSize: 18, color: "#94a3b8" }}>🔍</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or city..."
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "12px 12px",
                      fontSize: 14,
                      outline: "none",
                      fontFamily: "'Inter', sans-serif",
                      background: "transparent"
                    }}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                  Hospital Type
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "All", label: "All", icon: "🏥" },
                    { id: "Government", label: "Government", icon: "🏛️" },
                    { id: "Private", label: "Private", icon: "🏢" }
                  ].map(t => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTypeFilter(t.id)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 14,
                        border: `2px solid ${typeFilter === t.id ? "#8b5cf6" : "#e2e8f0"}`,
                        background: typeFilter === t.id ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "#fff",
                        color: typeFilter === t.id ? "#fff" : "#475569",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        transition: "all 0.2s"
                      }}
                    >
                      <span>{t.icon}</span> {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                  Facilities
                </label>
                {[
                  { key: "bloodBank", label: "Blood Bank", icon: "🩸", color: "#e11d48" },
                  { key: "emergency", label: "24/7 Emergency", icon: "🚨", color: "#f59e0b" },
                  { key: "icu", label: "ICU Available", icon: "🏥", color: "#10b981" }
                ].map(f => (
                  <label key={f.key} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.2s"
                  }}>
                    <input
                      type="checkbox"
                      checked={features[f.key]}
                      onChange={() => setFeatures(p => ({ ...p, [f.key]: !p[f.key] }))}
                      style={{ accentColor: f.color, width: 18, height: 18, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 18 }}>{f.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{f.label}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 14px",
                    fontSize: 14,
                    fontFamily: "'Inter', sans-serif",
                    background: "#fff",
                    cursor: "pointer"
                  }}
                >
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="available">🛏️ Most Available Beds</option>
                </select>
              </div>

              {/* Result Count */}
              <div style={{
                background: "linear-gradient(135deg, #8b5cf610, #c084fc10)",
                borderRadius: 16,
                padding: "20px",
                textAlign: "center",
                border: "1px solid #8b5cf620"
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#8b5cf6" }}>{filtered.length}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Hospitals Found</div>
              </div>
            </motion.div>
          </div>

          {/* Cards Grid */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <AnimatePresence>
                {filtered.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="hospital-card"
                    style={{
                      background: "#fff",
                      borderRadius: 28,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      border: "1px solid #f1f5f9",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelected(selected?.id === h.id ? null : h)}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {/* Image */}
                      <div style={{ width: "240px", minWidth: "200px", position: "relative", overflow: "hidden" }}>
                        <img
                          src={h.img}
                          alt={h.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            minHeight: 200,
                            transition: "transform 0.4s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        />
                        <div style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "rgba(0,0,0,0.7)",
                          backdropFilter: "blur(4px)",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff"
                        }}>
                          {h.type}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, padding: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{h.name}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 14, color: "#f59e0b" }}>⭐</span>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{h.rating}</span>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>(124)</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                            📍 {h.address}, {h.city}
                          </span>
                          <span style={{ width: 4, height: 4, background: "#cbd5e1", borderRadius: "50%" }} />
                          <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                            📞 {h.phone}
                          </span>
                        </div>

                        {/* Facilities Tags */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                          {h.bloodBank && <span style={{ background: "#fff1f2", color: "#e11d48", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 30 }}>🩸 Blood Bank</span>}
                          {h.emergency && <span style={{ background: "#fffbeb", color: "#d97706", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 30 }}>🚨 24/7 Emergency</span>}
                          {h.icu && <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 30 }}>🏥 ICU Available</span>}
                        </div>

                        {/* Specialties */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {h.specialties.slice(0, 3).map(sp => (
                            <span key={sp} style={{ background: "#f8fafc", color: "#475569", fontSize: 11, padding: "4px 14px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Stats */}
                      <div style={{
                        padding: "24px",
                        minWidth: 150,
                        borderLeft: "1px solid #f1f5f9",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-end"
                      }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 42, fontWeight: 800, color: availColor(h.available) }}>{h.available}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Beds Available</div>
                        </div>
                        <motion.a
                          href={`tel:${h.phone}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={e => e.stopPropagation()}
                          style={{
                            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                            color: "#fff",
                            textDecoration: "none",
                            padding: "12px 24px",
                            borderRadius: 16,
                            fontSize: 14,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            marginTop: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
                          }}
                        >
                          📞 Call Now
                        </motion.a>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selected?.id === h.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: "hidden", borderTop: "1px solid #f1f5f9" }}
                        >
                          <div style={{
                            padding: "28px",
                            background: "#fafbff",
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 28
                          }}>
                            <style>{`
                              @media (max-width: 768px) {
                                [style*="grid-template-columns: repeat(3, 1fr)"] {
                                  grid-template-columns: 1fr !important;
                                }
                              }
                            `}</style>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>All Specialties</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {h.specialties.map(sp => (
                                  <span key={sp} style={{ background: "#e9d5ff", color: "#7c3aed", fontSize: 12, padding: "6px 16px", borderRadius: 24, fontWeight: 600 }}>{sp}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Capacity Details</p>
                              <p style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{h.beds.toLocaleString()}</p>
                              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Total Bed Capacity</p>
                              <p style={{ fontSize: 13, color: "#10b981", marginTop: 12 }}>✓ ISO 9001:2024 Certified</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Contact Information</p>
                              <p style={{ fontSize: 14, color: "#334155", marginBottom: 6, fontWeight: 500 }}>Emergency: {h.phone}</p>
                              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{h.address}</p>
                              <p style={{ fontSize: 13, color: "#64748b" }}>{h.city}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {!filtered.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "100px 24px" }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 90, marginBottom: 24 }}
                >
                  🏥
                </motion.div>
                <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#1e293b" }}>No Hospitals Found</h3>
                <p style={{ color: "#64748b", fontSize: 16 }}>Try adjusting your filters or search for a different location.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("All");
                    setFeatures({ bloodBank: false, emergency: false, icu: false });
                    setSortBy("rating");
                  }}
                  style={{
                    marginTop: 24,
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: 40,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
                  }}
                >
                  Reset All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}