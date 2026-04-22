import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const skillOptions = ["Blood Transport", "First Aid", "Driver", "Nurse", "Counseling", "Hospital Coordination", "Logistics", "Community Outreach"];
const cityOptions = ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur"];

const statusColors = { Available: "#10b981", "On Task": "#f59e0b", Offline: "#94a3b8" };

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [tab, setTab] = useState("browse");
  const [skill, setSkill] = useState("All");
  const [city, setCity] = useState("All Cities");
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", skills: [], availability: "weekends", experience: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get("/volunteers/users").then(res => {
      const apiVolunteers = res.data.data.map((u, i) => ({
        id: u._id,
        name: u.name,
        city: u.city || "Unknown",
        skills: ["First Aid", "Blood Transport"],
        rating: 4.8,
        tasks: i * 5 + 10,
        status: "Available",
        avatar: u.name ? u.name.slice(0, 2).toUpperCase() : "U",
        color: ["#e11d48", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"][i % 5]
      }));
      setVolunteers(apiVolunteers);
    }).catch(console.error);
  }, []);

  const toggleSkill = (s) => {
    setForm(p => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s] }));
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.skills.length) {
      toast.error("Please fill all required fields and select at least one skill");
      return;
    }
    try {
      await api.post("/volunteers/join", { ...form });
      setSubmitted(true);
      toast.success("Welcome to the LifeLink volunteer network!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to join network");
    }
  };

  const filtered = volunteers.filter(v =>
    (skill === "All" || v.skills.includes(skill)) &&
    (city === "All Cities" || v.city === city)
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.1) !important; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .volunteer-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .volunteer-card:hover { transform: translateY(-6px); }
      `}</style>

      {/* Hero Section */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        padding: "clamp(60px, 10vw, 100px) 24px",
        textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Animated Background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(110,231,183,0.2), transparent)",
            borderRadius: "50%",
            filter: "blur(50px)"
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent)",
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
              background: "rgba(110,231,183,0.2)",
              border: "1px solid rgba(110,231,183,0.3)",
              borderRadius: 50,
              padding: "8px 24px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#6ee7b7",
              backdropFilter: "blur(10px)"
            }}>
              🤝 COMMUNITY HEROES
            </span>
          </motion.div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            Volunteer with <span style={{ color: "#6ee7b7" }}>LifeLink</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 550,
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Join 5,000+ dedicated volunteers making a difference in emergency healthcare across India
          </p>

          {/* Stats */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(30px, 6vw, 60px)",
            marginTop: 50,
            flexWrap: "wrap"
          }}>
            {[
              { value: "5,000+", label: "Active Volunteers", icon: "🤝" },
              { value: "9", label: "Cities", icon: "🏙️" },
              { value: "24/7", label: "Availability", icon: "⏱️" },
              { value: "10k+", label: "Lives Impacted", icon: "❤️" }
            ].map(stat => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#6ee7b7" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1400, margin: "-40px auto 0", padding: "0 24px 60px" }}>

        {/* Tabs */}
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
            { id: "browse", label: "🔍 Browse Volunteers", icon: "🔍" },
            { id: "join", label: "🤝 Become a Volunteer", icon: "🤝" }
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
                background: tab === t.id ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
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
          {tab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Filters */}
              <div style={{
                background: "#fff",
                borderRadius: 24,
                padding: "24px 28px",
                marginBottom: 28,
                display: "flex",
                gap: 16,
                alignItems: "flex-end",
                flexWrap: "wrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9"
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                    🛠️ Skill
                  </label>
                  <select
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
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
                    <option value="All">All Skills</option>
                    {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                    📍 City
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
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
                    <option value="All Cities">All Cities</option>
                    {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{
                  background: "linear-gradient(135deg, #10b98110, #05966910)",
                  borderRadius: 14,
                  padding: "12px 20px",
                  border: "1px solid #10b98120"
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>{filtered.length} Volunteers</span>
                </div>
              </div>

              {/* Volunteers Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                {filtered.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="volunteer-card"
                    style={{
                      background: "#fff",
                      borderRadius: 28,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      border: "1px solid #f1f5f9"
                    }}
                  >
                    <div style={{ padding: "28px" }}>
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 24,
                            background: `linear-gradient(135deg, ${v.color}, ${v.color}cc)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#fff"
                          }}
                        >
                          {v.avatar}
                        </motion.div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>{v.name}</h3>
                          <p style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                            📍 {v.city}
                          </p>
                        </div>
                        <span style={{
                          background: `${statusColors[v.status]}15`,
                          color: statusColors[v.status],
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "5px 12px",
                          borderRadius: 30,
                          display: "flex",
                          alignItems: "center",
                          gap: 5
                        }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[v.status] }} />
                          {v.status}
                        </span>
                      </div>

                      {/* Skills */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                        {v.skills.map(s => (
                          <span key={s} style={{ background: "#f5f3ff", color: "#7c3aed", fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 30 }}>
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Stats Row */}
                      <div style={{
                        display: "flex",
                        gap: 16,
                        background: "#f8fafc",
                        borderRadius: 20,
                        padding: "16px",
                        marginBottom: 20
                      }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>⭐ {v.rating}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>Rating</div>
                        </div>
                        <div style={{ width: 1, background: "#e2e8f0" }} />
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 800, color: v.color }}>{v.tasks}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>Tasks Completed</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {v.status === "Available" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toast.success(`Request sent to ${v.name}! They'll contact you shortly.`)}
                          style={{
                            width: "100%",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 18,
                            padding: "14px",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8
                          }}
                        >
                          📨 Request Help
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {!filtered.length && (
                <div style={{ textAlign: "center", padding: "80px 24px" }}>
                  <div style={{ fontSize: 80, marginBottom: 20 }}>🤝</div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No Volunteers Found</h3>
                  <p style={{ color: "#64748b" }}>Try adjusting your filters or check back later.</p>
                </div>
              )}
            </motion.div>
          )}

          {tab === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {submitted ? (
                // ... (keeping existing logic)
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
                    transition={{ type: "spring", stiffness: 300 }}
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
                    🤝
                  </motion.div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Welcome to the Team!</h2>
                  <p style={{ color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
                    You're now part of the LifeLink volunteer network. We'll reach out with your first task soon.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", phone: "", email: "", city: "", skills: [], availability: "weekends", experience: "" });
                    }}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 14,
                      padding: "14px 32px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Register Another Person →
                  </motion.button>
                </motion.div>
              ) : (
                <div className="join-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
                <style>{`
                  @media (max-width: 900px) {
                    .join-grid {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}</style>
                  {/* Left - Benefits */}
                  <div>
                    <div style={{
                      background: "#fff",
                      borderRadius: 28,
                      padding: "32px",
                      marginBottom: 24,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                    }}>
                      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>🌟</span> Why Volunteer?
                      </h3>
                      {[
                        { icon: "❤️", title: "Save Lives Directly", desc: "Your time and skills directly impact patients in crisis" },
                        { icon: "🏆", title: "Build Your Profile", desc: "Earn verified volunteer badges and ratings" },
                        { icon: "🤝", title: "Join a Community", desc: "Connect with 5,000+ compassionate people" },
                        { icon: "📜", title: "Get Certified", desc: "Receive volunteer certificates for your hours" }
                      ].map(b => (
                        <div key={b.title} style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 28 }}>{b.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.title}</div>
                            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Top Volunteers */}
                    <div style={{
                      background: "linear-gradient(135deg, #064e3b, #065f46)",
                      borderRadius: 28,
                      padding: "32px",
                      color: "#fff"
                    }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏆 Top Volunteers</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>This month's heroes</p>
                      {volunteers.sort((a, b) => b.tasks - a.tasks).slice(0, 3).map((v, i) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                          <span style={{ fontSize: 20, fontWeight: 800, color: ["#fbbf24", "#94a3b8", "#cd7f32"][i] }}>#{i + 1}</span>
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: v.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#fff"
                          }}>
                            {v.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{v.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{v.tasks} tasks</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right - Form */}
                  <div style={{
                    background: "#fff",
                    borderRadius: 28,
                    padding: "36px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    border: "1px solid #f1f5f9"
                  }}>
                    <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Join as Volunteer</h3>
                    <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Full Name *</label>
                          <input
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Your name"
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "12px 14px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif"
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Phone *</label>
                          <input
                            value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+91 98765 43210"
                            style={{
                              width: "100%",
                              border: "1.5px solid #e2e8f0",
                              borderRadius: 14,
                              padding: "12px 14px",
                              fontSize: 14,
                              fontFamily: "'Inter', sans-serif"
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="your@email.com"
                          style={{
                            width: "100%",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: 14,
                            padding: "12px 14px",
                            fontSize: 14,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>City *</label>
                        <select
                          value={form.city}
                          onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
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
                          <option value="">Select your city</option>
                          {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 12 }}>Skills * (select all that apply)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                          {skillOptions.map(s => (
                            <motion.button
                              type="button"
                              key={s}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleSkill(s)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 30,
                                border: `2px solid ${form.skills.includes(s) ? "#10b981" : "#e2e8f0"}`,
                                background: form.skills.includes(s) ? "#f0fdf4" : "#fff",
                                color: form.skills.includes(s) ? "#065f46" : "#64748b",
                                fontWeight: 600,
                                fontSize: 12,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif",
                                transition: "all 0.2s"
                              }}
                            >
                              {form.skills.includes(s) && "✓ "}{s}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Availability</label>
                        <select
                          value={form.availability}
                          onChange={e => setForm(p => ({ ...p, availability: e.target.value }))}
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
                          <option value="weekends">Weekends only</option>
                          <option value="evenings">Evenings (5–10 PM)</option>
                          <option value="fulltime">Full time</option>
                          <option value="oncall">On-call (emergency only)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Experience / Background</label>
                        <textarea
                          value={form.experience}
                          onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                          rows={3}
                          placeholder="Tell us about your relevant experience or motivation..."
                          style={{
                            width: "100%",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: 14,
                            padding: "12px 14px",
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
                        style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 18,
                          padding: "16px 24px",
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: "pointer",
                          marginTop: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          boxShadow: "0 8px 25px rgba(16,185,129,0.3)"
                        }}
                      >
                        🤝 Join the Volunteer Network
                      </motion.button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}