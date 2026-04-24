import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { toast } from "react-hot-toast";

const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function HospitalDashboard() {
  const [user, setUser] = useState(null);
  const [beds, setBeds] = useState(0);
  const [requests, setRequests] = useState([]);
  const [showCampForm, setShowCampForm] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [campData, setCampData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    city: ""
  });
  const [detailsData, setDetailsData] = useState({
    hospitalName: "",
    availableBeds: 0,
    icuBeds: 0,
    oxygenCylinders: 0
  });

  const fetchData = async () => {
    try {
      const uRes = await api.get("/auth/me");
      if (uRes.data.success) {
        setUser(uRes.data.data);
        setBeds(uRes.data.data.availableBeds || 0);
        setDetailsData({
          hospitalName: uRes.data.data.hospitalName || "",
          availableBeds: uRes.data.data.availableBeds || 0,
          icuBeds: uRes.data.data.icuBeds || 0,
          oxygenCylinders: uRes.data.data.oxygenCylinders || 0
        });
      }
      const reqRes = await api.get("/blood?status=open");
      if (reqRes.data.success) setRequests(reqRes.data.data);
    } catch (err) {
      console.error("Error fetching hospital data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBeds = async (newBeds) => {
    if (newBeds < 0) return;
    try {
      const res = await api.put("/auth/update-profile", { availableBeds: newBeds });
      if (res.data.success) {
        setBeds(newBeds);
        toast.success("Beds updated successfully");
      }
    } catch (err) {
      toast.error("Failed to update beds");
    }
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/camps", { ...campData, city: user?.city || "" });
      if (res.data.success) {
        toast.success("Blood donation camp created!");
        setShowCampForm(false);
        setCampData({ title: "", description: "", date: "", time: "", location: "", city: "" });
      }
    } catch (err) {
      toast.error("Failed to create camp");
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/update-profile", detailsData);
      if (res.data.success) {
        toast.success("Hospital details updated!");
        setShowDetailsForm(false);
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to update details");
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Syne:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        * { font-family: 'Syne', sans-serif; }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }
        input, select, textarea { transition: all 0.2s ease; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              {user?.hospitalName || "Hospital Admin"}
            </h1>
            <p className="text-white/50 mt-2">Manage resources and coordinate emergency responses</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDetailsForm(true)}
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              🏥 Update Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCampForm(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
            >
              🩸 Organize Camp
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Available Beds", value: beds, color: "#10b981", icon: "🛏️", unit: "", update: true },
            { label: "ICU Available", value: user?.icuBeds || 0, color: "#3b82f6", icon: "🏥", unit: "" },
            { label: "Oxygen Cylinders", value: user?.oxygenCylinders || 0, color: "#8b5cf6", icon: "💨", unit: "" },
            { label: "Active Requests", value: requests.length, color: "#ef4444", icon: "🚨", unit: "" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card-glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  {stat.update && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateBeds(beds - 1)}
                        className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateBeds(beds + 1)}
                        className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-3xl md:text-4xl font-bold" style={{ color: stat.color }}>
                  {stat.value}{stat.unit}
                </p>
                <p className="text-sm text-white/40 mt-1">{stat.label}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Create Camp Form Modal */}
        <AnimatePresence>
          {showCampForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-glass rounded-2xl p-6 md:p-8 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold">Organize Blood Donation Camp</h2>
                <button
                  onClick={() => setShowCampForm(false)}
                  className="text-white/50 hover:text-white/80 text-2xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateCamp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Camp Title"
                  value={campData.title}
                  onChange={e => setCampData({ ...campData, title: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={campData.location}
                  onChange={e => setCampData({ ...campData, location: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <input
                  type="date"
                  value={campData.date}
                  onChange={e => setCampData({ ...campData, date: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <input
                  type="time"
                  value={campData.time}
                  onChange={e => setCampData({ ...campData, time: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={campData.description}
                  onChange={e => setCampData({ ...campData, description: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm md:col-span-2"
                  rows={3}
                  required
                />
                <div className="flex gap-4 md:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold"
                  >
                    Create Camp →
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowCampForm(false)}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white/70 font-bold hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Update Details Form Modal */}
        <AnimatePresence>
          {showDetailsForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-glass rounded-2xl p-6 md:p-8 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl md:text-3xl font-bold">Update Hospital Details</h2>
                <button
                  onClick={() => setShowDetailsForm(false)}
                  className="text-white/50 hover:text-white/80 text-2xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdateDetails} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={detailsData.hospitalName}
                  onChange={e => setDetailsData({ ...detailsData, hospitalName: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Available Beds"
                  value={detailsData.availableBeds}
                  onChange={e => setDetailsData({ ...detailsData, availableBeds: parseInt(e.target.value) || 0 })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="ICU Beds"
                  value={detailsData.icuBeds}
                  onChange={e => setDetailsData({ ...detailsData, icuBeds: parseInt(e.target.value) || 0 })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Oxygen Cylinders"
                  value={detailsData.oxygenCylinders}
                  onChange={e => setDetailsData({ ...detailsData, oxygenCylinders: parseInt(e.target.value) || 0 })}
                  className="rounded-xl px-4 py-3 text-sm"
                  required
                />
                <div className="flex gap-4 md:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold"
                  >
                    Update Details →
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowDetailsForm(false)}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white/70 font-bold hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Blood Requests Section */}
        <Reveal>
          <div className="card-glass rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold">Live Blood Requests</h2>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
                LIVE
              </span>
            </div>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((req, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
                        🩸
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-red-400">{req.bloodGroup} Needed</h3>
                        <p className="text-white/50 text-sm">
                          {req.patientName || "Patient"} • Requested just now
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                        CRITICAL
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition"
                      >
                        Respond →
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🩸</div>
                  <p className="text-white/40">No active blood requests at the moment</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass rounded-xl p-5 flex items-center gap-4 cursor-pointer"
            onClick={() => window.location.href = "/blood-requests"}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-xl">📋</div>
            <div>
              <p className="font-bold">View All Requests</p>
              <p className="text-white/40 text-xs">See complete request history</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass rounded-xl p-5 flex items-center gap-4 cursor-pointer"
            onClick={() => window.location.href = "/hospital-stats"}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">📊</div>
            <div>
              <p className="font-bold">Analytics</p>
              <p className="text-white/40 text-xs">View monthly statistics</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -4 }}
            className="card-glass rounded-xl p-5 flex items-center gap-4 cursor-pointer"
            onClick={() => window.location.href = "/support"}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">💬</div>
            <div>
              <p className="font-bold">Need Help?</p>
              <p className="text-white/40 text-xs">Contact support team</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}