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
        name: h.name,
        city: h.city,
        address: h.address,
        phone: h.contactNumber,
        beds: h.bedsAvailable,
        available: h.bedsAvailable,
        icu: h.icuAvailable > 0,
        oxygen: h.oxygenAvailable,
        verified: h.verified,
        bloodBank: true, // Mocking
        emergency: true, // Mocking
        type: "Private", // Mocking
        rating: 4.5, // Mocking
        specialties: ["General Medicine"], // Mocking
        img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80" // Default
      }));
      setHospitals(apiHospitals);
    }).catch(console.error);
  }, []);

  const filtered = hospitals
    .filter(h => {
      const s = search.toLowerCase();
      return (h.name.toLowerCase().includes(s) || h.city.toLowerCase().includes(s) || h.specialties.some(sp => sp.toLowerCase().includes(s)));
    })
    .filter(h => typeFilter === "All" || h.type === typeFilter)
    .filter(h => (!features.bloodBank || h.bloodBank) && (!features.emergency || h.emergency) && (!features.icu || h.icu))
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.available - a.available);

  const availColor = (n) => n <= 5 ? "#e11d48" : n <= 20 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .font-display{font-family:'Instrument Serif',serif;}
        input:focus,select:focus{outline:none;border-color:#8b5cf6!important;}
        .dark .h-card{background:#1e293b!important;border-color:#334155!important;}
        .dark .sidebar{background:#1e293b!important;border-color:#334155!important;}
        .dark input,.dark select{background:#0f172a!important;border-color:#334155!important;color:#f1f5f9!important;}
        .dark .chip{background:#334155!important;color:#cbd5e1!important;}
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", padding: "56px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c4b5fd", display: "block", marginBottom: 12 }}>Hospital Network</span>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Find <em style={{ color: "#c4b5fd" }}>Hospitals</em> Near You</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Search across {hospitals.length}+ partner hospitals — filter by type, specialties, and facilities.</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: "-40px auto 0", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

        {/* Sidebar Filters */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sidebar" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "24px", position: "sticky", top: 88 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🔍 Search & Filter</h3>

          <div style={{ marginBottom: 20 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hospital, specialty..." style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Type</label>
            {["All", "Government", "Private"].map(t => (
              <motion.button key={t} whileTap={{ scale: 0.97 }} onClick={() => setTypeFilter(t)} style={{ display: "block", width: "100%", marginBottom: 6, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${typeFilter === t ? "#8b5cf6" : "#e2e8f0"}`, background: typeFilter === t ? "#f5f3ff" : "#fff", color: typeFilter === t ? "#7c3aed" : "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
                {t === "Government" ? "🏛️" : t === "Private" ? "🏢" : "🏥"} {t}
              </motion.button>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Facilities</label>
            {[["bloodBank", "🩸 Blood Bank"], ["emergency", "🚨 24/7 Emergency"], ["icu", "🏥 ICU"]].map(([key, label]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                <input type="checkbox" checked={features[key]} onChange={() => setFeatures(p => ({ ...p, [key]: !p[key] }))} style={{ accentColor: "#8b5cf6", width: 16, height: 16 }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
              </label>
            ))}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", background: "#fff", boxSizing: "border-box" }}>
              <option value="rating">⭐ Highest Rated</option>
              <option value="available">🛏️ Most Available Beds</option>
            </select>
          </div>

          <div style={{ marginTop: 16, padding: "12px", background: "#f0fdf4", borderRadius: 12, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>{filtered.length} hospitals found</p>
          </div>
        </motion.div>

        {/* Cards */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
              {filtered.map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3, boxShadow: "0 16px 50px rgba(0,0,0,0.08)" }} className="h-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }} onClick={() => setSelected(selected?.id === h.id ? null : h)}>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", alignItems: "stretch" }}>
                    <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 130 }} />
                    <div style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{h.name}</h3>
                        <span style={{ background: h.type === "Government" ? "#eff6ff" : "#fdf4ff", color: h.type === "Government" ? "#1d4ed8" : "#7c3aed", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{h.type}</span>
                      </div>
                      <p style={{ color: "#64748b", fontSize: 13, marginBottom: 10 }}>📍 {h.address}, {h.city}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {h.bloodBank && <span className="chip" style={{ background: "#fff1f2", color: "#be123c", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>🩸 Blood Bank</span>}
                        {h.emergency && <span className="chip" style={{ background: "#fff7ed", color: "#c2410c", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>🚨 Emergency</span>}
                        {h.icu && <span className="chip" style={{ background: "#f0fdf4", color: "#15803d", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>🏥 ICU</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {h.specialties.slice(0, 3).map(sp => <span key={sp} className="chip" style={{ background: "#f8fafc", color: "#475569", fontSize: 11, padding: "2px 10px", borderRadius: 20, border: "1px solid #e2e8f0" }}>{sp}</span>)}
                        {h.specialties.length > 3 && <span style={{ fontSize: 11, color: "#94a3b8" }}>+{h.specialties.length - 3} more</span>}
                      </div>
                    </div>
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", minWidth: 120, borderLeft: "1px solid #f1f5f9" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{"⭐".repeat(1)}{h.rating}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Rating</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: availColor(h.available) }}>{h.available}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>beds available</div>
                      </div>
                      <a href={`tel:${h.phone}`} onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "#fff", textDecoration: "none", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                        📞 Call
                      </a>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selected?.id === h.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", borderTop: "1px solid #f1f5f9" }}>
                        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>All Specialties</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {h.specialties.map(sp => <span key={sp} style={{ background: "#f5f3ff", color: "#7c3aed", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>{sp}</span>)}
                            </div>
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Capacity</p>
                            <p style={{ fontSize: 28, fontWeight: 800, color: "#1e293b" }}>{h.beds.toLocaleString()}</p>
                            <p style={{ fontSize: 13, color: "#64748b" }}>Total beds</p>
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Contact</p>
                            <a href={`tel:${h.phone}`} style={{ color: "#7c3aed", fontWeight: 600, fontSize: 14, display: "block", marginBottom: 8 }}>{h.phone}</a>
                            <p style={{ fontSize: 13, color: "#64748b" }}>{h.address}, {h.city}</p>
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
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🏥</div>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>No hospitals match your criteria</h3>
              <p style={{ color: "#64748b" }}>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}