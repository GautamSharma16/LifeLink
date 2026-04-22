import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const skillOptions = ["All", "Blood Transport", "First Aid", "Driver", "Nurse", "Counseling", "Hospital Coordination", "Logistics", "Community Outreach"];
const cityOptions = ["All Cities", "New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad"];

const statusColors = { "Available": "#10b981", "On Task": "#f59e0b", "Offline": "#94a3b8" };

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
        skills: ["First Aid", "Blood Transport"], // mock skills for UI
        rating: 4.8, // mock rating
        tasks: i * 5 + 10, // mock tasks
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
    if (!form.name || !form.phone || !form.city || !form.skills.length) { toast.error("Please fill all required fields and select at least one skill"); return; }
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

  const inputStyle = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif", background: "#fff", color: "#1e293b", boxSizing: "border-box", transition: "border-color 0.2s" };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
        .font-display{font-family:'Instrument Serif',serif;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#10b981!important;box-shadow:0 0 0 3px rgba(16,185,129,0.1)!important;}
        .dark .vol-card,.dark .v-panel{background:#1e293b!important;border-color:#334155!important;}
        .dark input,.dark select,.dark textarea{background:#0f172a!important;border-color:#334155!important;color:#f1f5f9!important;}
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#064e3b,#065f46)", padding: "56px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#6ee7b7", display: "block", marginBottom: 12 }}>Community Heroes</span>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#fff", marginBottom: 14, fontWeight: 700 }}>Volunteer <em style={{ color: "#6ee7b7" }}>with LifeLink</em></h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, maxWidth: 500, margin: "0 auto 28px" }}>Join 5,000+ volunteers making a difference in emergency healthcare across India.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[["🤝", "5,000+ volunteers"], ["🏙️", "9 cities"], ["⏱️", "24/7 availability"]].map(([icon, label]) => (
              <span key={label} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "8px 18px", borderRadius: 50, fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)" }}>{icon} {label}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: "-40px auto 0", padding: "0 24px 60px" }}>

        {/* Tabs */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "6px", display: "flex", gap: 4, marginBottom: 32, boxShadow: "0 4px 30px rgba(0,0,0,0.06)" }} className="vol-card">
          {[{ id: "browse", label: "🔍 Browse Volunteers" }, { id: "join", label: "🤝 Become a Volunteer" }].map(t => (
            <motion.button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "12px 20px", borderRadius: 14, border: "none", background: tab === t.id ? "linear-gradient(135deg,#10b981,#059669)" : "transparent", color: tab === t.id ? "#fff" : "#64748b", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "browse" && (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Filters */}
              <div className="vol-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Skill</label>
                  <select value={skill} onChange={e => setSkill(e.target.value)} style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: "#fff", boxSizing: "border-box" }}>
                    {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>City</label>
                  <select value={city} onChange={e => setCity(e.target.value)} style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: "#fff", boxSizing: "border-box" }}>
                    {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ marginTop: 22 }}>
                  <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 13, fontWeight: 700, padding: "10px 16px", borderRadius: 12, display: "block" }}>{filtered.length} volunteers</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
                {filtered.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }} className="vol-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "24px", transition: "all 0.3s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg,${v.color},${v.color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{v.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>{v.name}</h3>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>📍 {v.city}</p>
                      </div>
                      <span style={{ background: `${statusColors[v.status]}15`, color: statusColors[v.status], fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{v.status}</span>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      {v.skills.map(s => <span key={s} style={{ background: "#f5f3ff", color: "#7c3aed", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{s}</span>)}
                    </div>

                    <div style={{ display: "flex", gap: 0, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b", margin: 0 }}>⭐ {v.rating}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Rating</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center", borderLeft: "1px solid #f1f5f9" }}>
                        <p style={{ fontSize: 20, fontWeight: 800, color: v.color, margin: 0 }}>{v.tasks}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Tasks done</p>
                      </div>
                    </div>

                    {v.status === "Available" && (
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => toast.success(`Request sent to ${v.name}!`)} style={{ marginTop: 14, width: "100%", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 12, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        📨 Request Help
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "join" && (
            <motion.div key="join" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "60px 24px" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>🤝</motion.div>
                  <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Welcome to the Team!</h2>
                  <p style={{ color: "#64748b", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>You're now part of the LifeLink volunteer network. We'll reach out with your first task soon.</p>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", city: "", skills: [], availability: "weekends", experience: "" }); }} style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    Register Another Person
                  </motion.button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32, maxWidth: 1000, margin: "0 auto" }}>
                  {/* Why Volunteer */}
                  <div>
                    <div className="vol-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "28px", marginBottom: 20 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Why Volunteer?</h3>
                      {[
                        { icon: "❤️", title: "Save Lives Directly", desc: "Your time and skills directly impact patients in crisis." },
                        { icon: "🌟", title: "Build Your Profile", desc: "Earn verified volunteer badges and ratings." },
                        { icon: "🤝", title: "Join a Community", desc: "Connect with 5,000+ compassionate people." },
                        { icon: "📜", title: "Get Certified", desc: "Receive volunteer certificates for your hours." },
                      ].map(b => (
                        <div key={b.title} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 24 }}>{b.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{b.title}</div>
                            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="vol-card" style={{ background: "linear-gradient(135deg,#064e3b,#065f46)", borderRadius: 24, padding: "28px", color: "#fff" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Top Volunteers</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>This month's heroes</p>
                      {volunteers.sort((a,b) => b.tasks - a.tasks).slice(0,3).map((v, i) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: ["#f59e0b","#94a3b8","#cd7f32"][i] }}>#{i+1}</span>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: v.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{v.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{v.name}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{v.tasks} tasks</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <div className="v-panel" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "36px" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Join as Volunteer</h3>
                    <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Full Name *</label>
                          <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Phone *</label>
                          <input value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210" style={inputStyle} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="your@email.com" style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>City *</label>
                        <select value={form.city} onChange={e => setForm(p=>({...p,city:e.target.value}))} style={{ ...inputStyle, cursor: "pointer" }}>
                          <option value="">Select your city</option>
                          {["New Delhi","Mumbai","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad","Jaipur"].map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 10 }}>Skills * (select all that apply)</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {skillOptions.slice(1).map(s => (
                            <motion.button type="button" key={s} whileTap={{ scale: 0.95 }} onClick={() => toggleSkill(s)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${form.skills.includes(s) ? "#10b981" : "#e2e8f0"}`, background: form.skills.includes(s) ? "#f0fdf4" : "#fff", color: form.skills.includes(s) ? "#065f46" : "#64748b", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
                              {form.skills.includes(s) ? "✓ " : ""}{s}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Availability</label>
                        <select value={form.availability} onChange={e => setForm(p=>({...p,availability:e.target.value}))} style={{ ...inputStyle, cursor: "pointer" }}>
                          <option value="weekends">Weekends only</option>
                          <option value="evenings">Evenings (5–10 PM)</option>
                          <option value="fulltime">Full time</option>
                          <option value="oncall">On-call (emergency only)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Experience / Background</label>
                        <textarea value={form.experience} onChange={e => setForm(p=>({...p,experience:e.target.value}))} rows={3} placeholder="Tell us about your relevant experience or motivation..." style={{ ...inputStyle, resize: "vertical" }} />
                      </div>
                      <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 8px 30px rgba(16,185,129,0.3)" }}>
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