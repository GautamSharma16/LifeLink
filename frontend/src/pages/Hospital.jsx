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
        phone: h.emergencyContact || h.phone || "N/A",
        beds: h.availableBeds || 0,
        available: h.availableBeds || 0,
        icu: (h.icuBeds || 0) > 0,
        oxygen: (h.oxygenCylinders || 0) > 0,
        verified: Boolean(h.hospitalVerified),
        bloodBank: true,
        emergency: true,
        type: "Private",
        rating: 4.5,
        specialties: h.hospitalDescription
          ? [h.hospitalDescription]
          : ["Emergency Care", "General Medicine", "Cardiology"],
        img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
      }));
      setHospitals(apiHospitals);
    }).catch(console.error);
  }, []);

  const filtered = hospitals
    .filter(h => {
      const s = search.toLowerCase();
      return h.name.toLowerCase().includes(s) || h.city.toLowerCase().includes(s);
    })
    .filter(h => typeFilter === "All" || h.type === typeFilter)
    .filter(h =>
      (!features.bloodBank || h.bloodBank) &&
      (!features.emergency || h.emergency) &&
      (!features.icu || h.icu)
    )
    .sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating : b.available - a.available
    );

  const availColor = n => n <= 5 ? "#e11d48" : n <= 20 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .hospital-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .hospital-card:hover { transform: translateY(-4px); }
        input:focus, select:focus { outline: none; border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15) !important; }
        @keyframes shine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .gradient-text { background: linear-gradient(135deg, #8b5cf6, #c084fc, #e879f9); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shine 3s linear infinite; }
        .content-grid { display: grid; grid-template-columns: 300px 1fr; gap: 28px; align-items: start; }
        @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } }
        .detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
        .card-inner { display: flex; flex-wrap: wrap; }
        .card-image { width: 220px; min-width: 180px; position: relative; overflow: hidden; flex-shrink: 0; }
        @media (max-width: 640px) { .card-image { width: 100%; } }
      `}</style>

      {/* ── HERO BANNER ── Reduced height, no overlap with content below */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        padding: "52px 24px 56px",   /* FIX: reduced from clamp(60px,10vw,100px) — shorter banner */
        textAlign: "center",
        overflow: "hidden",           /* FIX: keeps blobs inside the banner */
        zIndex: 0,
      }}>
        {/* Decorative blobs — contained inside banner */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent)",
          borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(236,72,153,0.2), transparent)",
          borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", color: "#c084fc",
            background: "rgba(192,132,252,0.15)", padding: "7px 22px",
            borderRadius: 40, backdropFilter: "blur(10px)",
            border: "1px solid rgba(192,132,252,0.3)",
            display: "inline-block", marginBottom: 18,
          }}>
            🏥 PREMIER HEALTHCARE NETWORK
          </span>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800,
            marginBottom: 14, lineHeight: 1.2, color: "#fff",
          }}>
            Find Your <span className="gradient-text">Healthcare</span> Partner
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.65)", fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
            maxWidth: 520, margin: "0 auto", lineHeight: 1.6,
          }}>
            Access {hospitals.length || "320"}+ verified hospitals with real-time bed availability
          </p>

          {/* Quick Stats */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: "clamp(24px, 5vw, 52px)", marginTop: 36, flexWrap: "wrap",
          }}>
            {[
              { value: "320+", label: "Partner Hospitals", icon: "🏥" },
              { value: "9",    label: "Cities Covered",     icon: "📍" },
              { value: "24/7", label: "Emergency Support",  icon: "🚨" },
              { value: "4.8",  label: "Avg Rating",         icon: "⭐" },
            ].map(stat => (
              <motion.div key={stat.label} whileHover={{ scale: 1.06, y: -4 }} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 800, color: "#c084fc" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── MAIN CONTENT — starts cleanly below the banner, no negative margin ── */}
      {/* FIX: was `margin: "-40px auto 0"` which pulled the grid over the banner.
          Now it's plain `margin: "0 auto"` with padding-top for breathing room. */}
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "36px 24px 60px" }}>
        <div className="content-grid">

          {/* ── SIDEBAR FILTERS ── */}
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "sticky",
              top: 24,                  /* FIX: was top:30 but navbar height may vary — 24px safe */
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(10px)",
              border: "1px solid #e8edf3",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
              zIndex: 10,              /* FIX: explicit z-index so it never renders behind cards */
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 22, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🔍</span> Smart Filters
            </h3>

            {/* Search */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                Search
              </label>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "2px 10px", background: "#fff" }}>
                <span style={{ fontSize: 16, color: "#94a3b8" }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Name or city..."
                  style={{ width: "100%", border: "none", padding: "10px 10px", fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", background: "transparent" }}
                />
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                Type
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { id: "All", label: "All", icon: "🏥" },
                  { id: "Government", label: "Govt", icon: "🏛️" },
                  { id: "Private", label: "Private", icon: "🏢" },
                ].map(t => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setTypeFilter(t.id)}
                    style={{
                      flex: 1, padding: "9px 10px", borderRadius: 12,
                      border: `2px solid ${typeFilter === t.id ? "#8b5cf6" : "#e2e8f0"}`,
                      background: typeFilter === t.id ? "linear-gradient(135deg,#8b5cf6,#7c3aed)" : "#fff",
                      color: typeFilter === t.id ? "#fff" : "#475569",
                      fontWeight: 600, fontSize: 12, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{t.icon}</span> {t.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                Facilities
              </label>
              {[
                { key: "bloodBank", label: "Blood Bank",     icon: "🩸", color: "#e11d48" },
                { key: "emergency", label: "24/7 Emergency", icon: "🚨", color: "#f59e0b" },
                { key: "icu",       label: "ICU Available",  icon: "🏥", color: "#10b981" },
              ].map(f => (
                <label key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
                  <input
                    type="checkbox"
                    checked={features[f.key]}
                    onChange={() => setFeatures(p => ({ ...p, [f.key]: !p[f.key] }))}
                    style={{ accentColor: f.color, width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{f.label}</span>
                </label>
              ))}
            </div>

            {/* Sort */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontFamily: "'Inter',sans-serif", background: "#fff", cursor: "pointer" }}
              >
                <option value="rating">⭐ Highest Rated</option>
                <option value="available">🛏️ Most Available Beds</option>
              </select>
            </div>

            {/* Result Count */}
            <div style={{ background: "linear-gradient(135deg,#8b5cf610,#c084fc10)", borderRadius: 14, padding: 16, textAlign: "center", border: "1px solid #8b5cf620" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#8b5cf6" }}>{filtered.length}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>Hospitals Found</div>
            </div>

            {/* Reset */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSearch(""); setTypeFilter("All"); setFeatures({ bloodBank: false, emergency: false, icu: false }); setSortBy("rating"); }}
              style={{ marginTop: 14, width: "100%", background: "none", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "9px 0", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}
            >
              Reset Filters
            </motion.button>
          </motion.aside>

          {/* ── HOSPITAL CARDS ── */}
          <div>
            {filtered.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <AnimatePresence>
                  {filtered.map((h, i) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ delay: i * 0.04 }}
                      className="hospital-card"
                      style={{
                        background: "#fff", borderRadius: 24, overflow: "hidden",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #f0f4f8", cursor: "pointer",
                      }}
                      onClick={() => setSelected(selected?.id === h.id ? null : h)}
                    >
                      <div className="card-inner">
                        {/* Image */}
                        <div className="card-image">
                          <img
                            src={h.img} alt={h.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 190, display: "block", transition: "transform 0.4s" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          />
                          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff" }}>
                            {h.type}
                          </div>
                          {h.verified && (
                            <div style={{ position: "absolute", top: 12, right: 12, background: "#10b981", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, color: "#fff" }}>
                              ✓ Verified
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div style={{ flex: 1, padding: "20px 22px", minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>{h.name}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ color: "#f59e0b", fontSize: 13 }}>⭐</span>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{h.rating}</span>
                              <span style={{ fontSize: 12, color: "#94a3b8" }}>(124)</span>
                            </div>
                          </div>

                          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                            📍 {h.address}, {h.city}
                            <span style={{ color: "#cbd5e1" }}>·</span>
                            📞 {h.phone}
                          </p>

                          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                            {h.bloodBank && <span style={{ background: "#fff1f2", color: "#e11d48", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 30 }}>🩸 Blood Bank</span>}
                            {h.emergency && <span style={{ background: "#fffbeb", color: "#d97706", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 30 }}>🚨 24/7 Emergency</span>}
                            {h.icu && <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 30 }}>🏥 ICU</span>}
                          </div>

                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {h.specialties.slice(0, 3).map(sp => (
                              <span key={sp} style={{ background: "#f8fafc", color: "#475569", fontSize: 11, padding: "4px 12px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                                {sp}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: beds + CTA */}
                        <div style={{ padding: "20px 20px", borderLeft: "1px solid #f0f4f8", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", minWidth: 130 }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 38, fontWeight: 800, color: availColor(h.available), lineHeight: 1 }}>{h.available}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>Beds Available</div>
                          </div>
                          <motion.a
                            href={`tel:${h.phone}`}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: 14, fontSize: 13, fontWeight: 700, marginTop: 14, display: "flex", alignItems: "center", gap: 5, boxShadow: "0 4px 12px rgba(139,92,246,0.3)", whiteSpace: "nowrap" }}
                          >
                            📞 Call
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
                            transition={{ duration: 0.3 }}
                            style={{ overflow: "hidden", borderTop: "1px solid #f0f4f8" }}
                          >
                            <div className="detail-grid" style={{ padding: 24, background: "#fafbff" }}>
                              <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Specialties</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                  {h.specialties.map(sp => (
                                    <span key={sp} style={{ background: "#e9d5ff", color: "#7c3aed", fontSize: 12, padding: "5px 14px", borderRadius: 24, fontWeight: 600 }}>{sp}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Capacity</p>
                                <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{h.beds.toLocaleString()}</p>
                                <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Total Bed Capacity</p>
                                <p style={{ fontSize: 13, color: "#10b981", marginTop: 10 }}>✓ ISO 9001:2024 Certified</p>
                              </div>
                              <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Contact</p>
                                <p style={{ fontSize: 14, color: "#334155", marginBottom: 6, fontWeight: 500 }}>Emergency: {h.phone}</p>
                                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{h.address}, {h.city}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 24px" }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 72, marginBottom: 20 }}>🏥</motion.div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10, color: "#1e293b" }}>No Hospitals Found</h3>
                <p style={{ color: "#64748b", fontSize: 15 }}>Try adjusting your filters or search for a different location.</p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSearch(""); setTypeFilter("All"); setFeatures({ bloodBank: false, emergency: false, icu: false }); setSortBy("rating"); }}
                  style={{ marginTop: 20, background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "#fff", border: "none", padding: "11px 26px", borderRadius: 40, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}