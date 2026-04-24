import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../lib/api";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    stats: {},
    users: [],
    auditLog: [],
  });

  const loadOverview = async () => {
    try {
      const res = await api.get("/admin/overview");
      if (res.data.success) {
        setOverview(res.data.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load admin overview");
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleVerifyHospital = async (id) => {
    try {
      await api.patch(`/admin/hospitals/${id}/verify`);
      toast.success("Hospital verified successfully");
      loadOverview();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify hospital");
    }
  };

  const handleBanUser = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/ban`);
      toast.success("User suspended successfully");
      loadOverview();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to suspend user");
    }
  };

  const stats = [
    { label: "Total Requests", value: overview.stats.totalBloodRequests || 0, icon: "📊", color: "#3b82f6" },
    { label: "Verified Hospitals", value: overview.stats.verifiedHospitals || 0, icon: "🏥", color: "#10b981" },
    { label: "Ambulance Requests", value: overview.stats.totalAmbulanceRequests || 0, icon: "🚑", color: "#8b5cf6" },
    { label: "Active Camps", value: overview.stats.totalCamps || 0, icon: "🩸", color: "#e11d48" },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontWeight: 700 }}>System Admin</h1>
        <p style={{ color: "#64748b" }}>Platform overview and management.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
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
                {overview.users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 8px" }}>
                      <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{u.hospitalName || u.name}</p>
                      <p style={{ color: "#64748b", margin: 0, fontSize: 12 }}>{u.email}</p>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{u.role}</span>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span style={{ color: u.isBanned ? "#e11d48" : u.hospitalVerified ? "#10b981" : "#f59e0b", fontWeight: 600, fontSize: 13 }}>
                        {u.isBanned ? "Suspended" : u.role === "hospital" ? (u.hospitalVerified ? "Verified" : "Pending") : "Active"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      {u.role === "hospital" && !u.hospitalVerified ? (
                        <button onClick={() => handleVerifyHospital(u._id)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Verify</button>
                      ) : !u.isBanned ? (
                        <button onClick={() => handleBanUser(u._id)} style={{ background: "#fee2e2", color: "#e11d48", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Suspend</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Audit Log</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {overview.auditLog.length === 0 && <p style={{ fontSize: 13, color: "#64748b" }}>No audit entries yet.</p>}
              {overview.auditLog.map((log) => (
                <div key={log._id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{log.title}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
