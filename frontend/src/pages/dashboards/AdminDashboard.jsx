import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontWeight: 700 }}>System Admin</h1>
        <p style={{ color: "#64748b" }}>Platform overview and management.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Requests", value: "1,204", icon: "📊", color: "#3b82f6" },
          { label: "Fulfillment Rate", value: "94%", icon: "📈", color: "#10b981" },
          { label: "Active Hospitals", value: "42", icon: "🏥", color: "#8b5cf6" },
          { label: "Fraud Flags", value: "3", icon: "⚠️", color: "#e11d48" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.icon} {s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="admin-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <style>{`
          @media (max-width: 900px) {
            .admin-dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }
          .admin-table-container {
            overflow-x: auto;
          }
        `}</style>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>User Management</h2>
          <div className="admin-table-container">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#64748b", fontSize: 13 }}>
                  <th style={{ padding: "12px 8px" }}>User</th>
                  <th style={{ padding: "12px 8px" }}>Role</th>
                  <th style={{ padding: "12px 8px" }}>Status</th>
                  <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Apollo Hospital", email: "contact@apollo.in", role: "hospital", status: "Pending" },
                  { name: "Rahul Sharma", email: "rahul@gmail.com", role: "volunteer", status: "Verified" },
                  { name: "John Doe", email: "john@example.com", role: "user", status: "Verified" },
                ].map((u, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 8px" }}>
                      <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{u.name}</p>
                      <p style={{ color: "#64748b", margin: 0, fontSize: 12 }}>{u.email}</p>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{u.role}</span>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span style={{ color: u.status === "Verified" ? "#10b981" : "#f59e0b", fontWeight: 600, fontSize: 13 }}>{u.status}</span>
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      {u.status === "Pending" ? (
                        <button style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Verify</button>
                      ) : (
                        <button style={{ background: "#fee2e2", color: "#e11d48", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Suspend</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Broadcast Alert */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Broadcast Alert</h2>
            <textarea placeholder="Type emergency broadcast message..." style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", minHeight: 100, marginBottom: 12, boxSizing: "border-box", fontFamily: "inherit" }} />
            <button style={{ width: "100%", background: "linear-gradient(135deg,#e11d48,#db2777)", color: "#fff", border: "none", padding: 12, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Send Alert</button>
          </div>

          {/* Audit Log */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Audit Log</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { log: "Admin logged in", time: "10 mins ago" },
                { log: "Hospital 'City Care' verified", time: "1 hour ago" },
                { log: "User suspended (Spam)", time: "3 hours ago" },
              ].map((log, i) => (
                <div key={i} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{log.log}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{log.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
