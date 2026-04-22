import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const emergencyColors = { low: "#10b981", medium: "#f59e0b", critical: "#e11d48" };

export default function BloodNeed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    patientName: "", hospitalName: "", city: "", units: 1,
    bloodGroup: "", emergencyLevel: "medium", contactNumber: "", additionalNotes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.hospitalName.trim()) e.hospitalName = "Hospital name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.bloodGroup) e.bloodGroup = "Please select blood group";
    if (form.units < 1) e.units = "At least 1 unit required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fill all required fields"); return; }
    setLoading(true);
    try {
      const userStr = localStorage.getItem("lifelink_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) { toast.error("Please login to continue"); navigate("/login"); return; }
      const res = await api.post("/blood", form);
      if (res.data.success) {
        toast.success("Blood request submitted!");
        setShowSuccess(true);
        setTimeout(() => navigate("/donate-blood"), 2500);
      } else toast.error(res.data.message || "Failed to submit");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  const loadSelf = () => {
    const u = localStorage.getItem("lifelink_user");
    if (!u) { toast.error("Please login first"); navigate("/login"); return; }
    const user = JSON.parse(u);
    setForm(p => ({ ...p, patientName: user.name || "", city: user.city || "", bloodGroup: user.bloodGroup || "" }));
    toast.success("Profile loaded!");
  };

  const inputStyle = (field) => ({
    width: "100%", border: `1.5px solid ${errors[field] ? "#e11d48" : "#e2e8f0"}`,
    borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none",
    fontFamily: "'DM Sans',sans-serif", background: "#fff", color: "#1e293b",
    transition: "border-color 0.2s", boxSizing: "border-box",
  });

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .font-display { font-family:'Instrument Serif',serif; }
        input:focus, select:focus, textarea:focus { border-color:#e11d48!important; box-shadow:0 0 0 3px rgba(225,29,72,0.1)!important; }
        .dark input, .dark select, .dark textarea { background:#1e293b!important; border-color:#334155!important; color:#f1f5f9!important; }
        .dark .form-card { background:#1e293b!important; border-color:#334155!important; }
        .dark label { color:#cbd5e1!important; }
      `}</style>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} style={{ background: "#fff", borderRadius: 28, padding: "52px 48px", textAlign: "center", maxWidth: 420, width: "90%", boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>✓</motion.div>
              <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Request Submitted!</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Your blood request is live. Nearby donors have been alerted.</p>
              <div style={{ width: "100%", height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} style={{ height: "100%", background: "linear-gradient(90deg,#e11d48,#10b981)" }} />
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Redirecting to donor listings…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="blood-need-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48, alignItems: "start" }}>
      <style>{`
        @media (max-width: 900px) {
          .blood-need-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .blood-need-grid > div:first-child {
            position: static !important;
          }
        }
      `}</style>

        {/* Left - Info Panel */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ position: "sticky", top: 100 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e11d48", display: "block", marginBottom: 16 }}>Emergency Blood Request</span>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem,3vw,2.8rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>Request blood<br /><em style={{ color: "#e11d48", fontStyle: "italic" }}>for someone in need.</em></h1>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: 36, fontSize: 15 }}>Fill in the request form and our platform will immediately notify verified donors in your area. Average response time: <strong>30 minutes.</strong></p>

            {/* Floating illustration */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ borderRadius: 24, overflow: "hidden", marginBottom: 32 }}>
              <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80" alt="Blood Donation" style={{ width: "100%", height: 240, objectFit: "cover" }} />
            </motion.div>

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "⚡", title: "Emergency Response", sub: "Average: 30 min response" },
                { icon: "👥", title: "12,000+ Active Donors", sub: "Verified & ready to help" },
                { icon: "🏥", title: "320+ Partner Hospitals", sub: "Across 9 cities" },
              ].map(s => (
                <div key={s.title} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 20px" }} className="form-card">
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="form-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 28, padding: "40px 36px", boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#e11d48,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🩸</div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Blood Request Form</h2>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>All starred fields are required</p>
              </div>
            </div>

            {/* Shortcut Buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={loadSelf} style={{ flex: 1, border: "1.5px solid #e11d48", color: "#e11d48", background: "#fff5f6", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                👤 Fill from Profile
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setForm({ patientName: "", hospitalName: "", city: "", units: 1, bloodGroup: "", emergencyLevel: "medium", contactNumber: "", additionalNotes: "" })} style={{ flex: 1, border: "1.5px solid #e2e8f0", color: "#64748b", background: "#f8fafc", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                ↺ Reset Form
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Emergency Level Selector */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>⚠️ Emergency Level *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {["low", "medium", "critical"].map(lvl => (
                    <motion.button type="button" key={lvl} whileTap={{ scale: 0.96 }} onClick={() => setForm(p => ({ ...p, emergencyLevel: lvl }))} style={{ padding: "10px 8px", borderRadius: 12, border: `2px solid ${form.emergencyLevel === lvl ? emergencyColors[lvl] : "#e2e8f0"}`, background: form.emergencyLevel === lvl ? `${emergencyColors[lvl]}15` : "#fff", color: form.emergencyLevel === lvl ? emergencyColors[lvl] : "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "capitalize", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
                      {lvl === "low" ? "🟢" : lvl === "medium" ? "🟡" : "🔴"} {lvl}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Blood Group Grid */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>🩸 Blood Group *</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                  {bloodGroups.map(bg => (
                    <motion.button type="button" key={bg} whileTap={{ scale: 0.94 }} onClick={() => { setForm(p => ({ ...p, bloodGroup: bg })); setErrors(p => ({ ...p, bloodGroup: "" })); }} style={{ padding: "10px 4px", borderRadius: 12, border: `2px solid ${form.bloodGroup === bg ? "#e11d48" : "#e2e8f0"}`, background: form.bloodGroup === bg ? "#fff1f2" : "#fff", color: form.bloodGroup === bg ? "#e11d48" : "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
                      {bg}
                    </motion.button>
                  ))}
                </div>
                {errors.bloodGroup && <p style={{ color: "#e11d48", fontSize: 12, marginTop: 6 }}>{errors.bloodGroup}</p>}
              </div>

              {/* Row: Patient + Hospital */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Patient Name *</label>
                  <input name="patientName" placeholder="Full name" value={form.patientName} onChange={handleChange} style={inputStyle("patientName")} />
                  {errors.patientName && <p style={{ color: "#e11d48", fontSize: 12, marginTop: 4 }}>{errors.patientName}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Hospital Name *</label>
                  <input name="hospitalName" placeholder="Hospital name" value={form.hospitalName} onChange={handleChange} style={inputStyle("hospitalName")} />
                  {errors.hospitalName && <p style={{ color: "#e11d48", fontSize: 12, marginTop: 4 }}>{errors.hospitalName}</p>}
                </div>
              </div>

              {/* Row: City + Units */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>City *</label>
                  <input name="city" placeholder="City" value={form.city} onChange={handleChange} style={inputStyle("city")} />
                  {errors.city && <p style={{ color: "#e11d48", fontSize: 12, marginTop: 4 }}>{errors.city}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Units Required *</label>
                  <input type="number" name="units" min="1" max="20" value={form.units} onChange={handleChange} style={inputStyle("units")} />
                  {errors.units && <p style={{ color: "#e11d48", fontSize: 12, marginTop: 4 }}>{errors.units}</p>}
                </div>
              </div>

              {/* Contact */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Contact Number</label>
                <input name="contactNumber" placeholder="+91 98765 43210" value={form.contactNumber} onChange={handleChange} style={inputStyle("contactNumber")} />
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Additional Notes</label>
                <textarea name="additionalNotes" rows={3} placeholder="Any specific requirements or additional information..." value={form.additionalNotes} onChange={handleChange} style={{ ...inputStyle("additionalNotes"), resize: "vertical", minHeight: 80 }} />
              </div>

              {/* Submit */}
              <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} disabled={loading} style={{ background: loading ? "#94a3b8" : "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: loading ? "none" : "0 8px 30px rgba(225,29,72,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s" }}>
                {loading ? (<><span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Submitting Request...</>) : (<>🩸 Submit Blood Request</>)}
              </motion.button>
            </form>

            {/* Important Note */}
            <div style={{ marginTop: 20, padding: "14px 18px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18 }}>ℹ️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Important</div>
                <div style={{ fontSize: 12, color: "#b45309", lineHeight: 1.5 }}>Your request will be shared with verified donors nearby. Keep your phone accessible for immediate confirmation.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}