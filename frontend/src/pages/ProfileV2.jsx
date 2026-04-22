import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";
import { getCurrentUser } from "../lib/auth";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  bloodGroup: "O+",
  role: "user",
  avatar: "",
  hospitalName: "",
  vehicleNumber: "",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function ProfileV2() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const localUser = getCurrentUser();
    if (localUser) {
      setForm((prev) => ({
        ...prev,
        ...localUser,
      }));
    }

    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        const user = response?.data?.data;
        if (user) {
          setForm((prev) => ({ ...prev, ...user }));
          localStorage.setItem("lifelink_user", JSON.stringify(user));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const joinedOn = useMemo(() => {
    if (!form.createdAt) return "Recently joined";
    return new Date(form.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [form.createdAt]);

  const stats = [
    { label: "Role", value: String(form.role || "user").replace("_", " "), icon: "👤", color: "#8b5cf6" },
    { label: "Blood Group", value: form.bloodGroup || "-", icon: "🩸", color: "#e11d48" },
    { label: "City", value: form.city || "-", icon: "📍", color: "#10b981" },
    { label: "Joined", value: joinedOn, icon: "📅", color: "#f59e0b" },
  ];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    const reader = new FileReader();
    setAvatarUploading(true);
    reader.onloadend = () => {
      setAvatarFile(String(reader.result || ""));
      setForm((prev) => ({ ...prev, avatar: String(reader.result || prev.avatar) }));
      setAvatarUploading(false);
      setShowAvatarOptions(false);
    };
    reader.onerror = () => {
      setAvatarUploading(false);
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        bloodGroup: form.bloodGroup,
        avatarFile: avatarFile || undefined,
        hospitalName: form.role === "hospital" ? form.hospitalName : undefined,
        vehicleNumber: form.role === "ambulance_driver" ? form.vehicleNumber : undefined,
      };

      const response = await api.put("/auth/me", payload);
      const user = response?.data?.data;
      if (user) {
        setForm((prev) => ({ ...prev, ...user }));
        setAvatarFile("");
        localStorage.setItem("lifelink_user", JSON.stringify(user));
        window.dispatchEvent(new Event("lifelink-auth-changed"));
      }
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"></div>
          <p className="mt-4 text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold text-white backdrop-blur-sm"
          >
            ✨ My Profile
          </motion.div>
          <h1 className="text-4xl font-black text-white md:text-5xl lg:text-6xl">
            Your <span className="text-rose-200">Journey</span> Matters
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-rose-100">
            Keep your information up to date to help us serve you better during critical moments
          </p>
        </motion.div>

        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Column - Profile Card & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-900">
              {/* Decorative gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ padding: "2px", borderRadius: "24px", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />

              <div className="relative rounded-3xl bg-white p-8 dark:bg-slate-900">
                {/* Avatar Section */}
                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative cursor-pointer"
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    >
                      {form.avatar ? (
                        <img
                          src={form.avatar}
                          alt={form.name || "Profile"}
                          className="h-36 w-36 rounded-2xl object-cover shadow-xl ring-4 ring-rose-100 transition-all duration-300 group-hover:ring-rose-200 dark:ring-rose-900/50"
                        />
                      ) : (
                        <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-5xl font-black text-white shadow-xl ring-4 ring-rose-100 transition-all duration-300 group-hover:ring-rose-200 dark:ring-rose-900/50">
                          {(form.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg dark:bg-slate-800">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                          📷
                        </div>
                      </div>
                    </motion.div>

                    {/* Avatar Upload Options */}
                    <AnimatePresence>
                      {showAvatarOptions && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute left-1/2 top-full mt-3 -translate-x-1/2"
                        >
                          <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-xl dark:bg-slate-800">
                            <label className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200">
                              📸 Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                            <button
                              onClick={() => {
                                setForm((prev) => ({ ...prev, avatar: "" }));
                                setShowAvatarOptions(false);
                              }}
                              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <h2 className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
                    {form.name || "User profile"}
                  </h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">{form.email}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold capitalize text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      {String(form.role || "user").replace("_", " ")}
                    </span>
                    {form.bloodGroup && (
                      <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        🩸 {form.bloodGroup}
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                      marginTop: "24px",
                      padding: "8px 20px",
                      borderRadius: "12px",
                      background: isEditing ? "#f1f5f9" : "linear-gradient(135deg,#e11d48,#db2777)",
                      color: isEditing ? "#475569" : "#fff",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: isEditing ? "none" : "0 4px 12px rgba(225,29,72,0.2)"
                    }}
                  >
                    {isEditing ? "❌ Cancel Editing" : "✏️ Edit Profile"}
                  </motion.button>
                </div>

                {/* Upload Hint */}
                <p className="mt-6 text-center text-xs text-slate-400">
                  Click on your profile picture to upload or change image
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-900"
                >
                  <div
                    className="absolute right-0 top-0 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
                    style={{ background: stat.color }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stat.icon}</span>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-bold capitalize text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:from-amber-950/30 dark:to-orange-950/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Quick Actions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Need immediate assistance?
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">
                  🚑 Request Ambulance
                </button>
                <button className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
                  🩸 Find Donors
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details or Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900"
          >
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, opacity: 0 }}
                  animate={{ opacity: 1, opacity: 1 }}
                  exit={{ opacity: 0, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-700">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Details</h2>
                    <p className="text-sm text-slate-500">Overview of your account information</p>
                  </div>

                  <div className="grid gap-6">
                    {[
                      { label: "Full Name", value: form.name, icon: "👤" },
                      { label: "Email Address", value: form.email, icon: "📧" },
                      { label: "Phone Number", value: form.phone || "Not provided", icon: "📞" },
                      { label: "City", value: form.city || "Not provided", icon: "📍" },
                      { label: "Blood Group", value: form.bloodGroup, icon: "🩸" },
                      { label: "Address", value: form.address || "Not provided", icon: "🏠" },
                      ...(form.role === "hospital" ? [{ label: "Hospital Name", value: form.hospitalName || "Not provided", icon: "🏥" }] : []),
                      ...(form.role === "ambulance_driver" ? [{ label: "Vehicle Number", value: form.vehicleNumber || "Not provided", icon: "🚑" }] : []),
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                          <p className="mt-1 font-semibold text-slate-900 dark:text-white">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                        ✏️
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                          Edit Profile
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Update your personal information
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>👤</span> Full Name
                      </label>
                      <input
                        value={form.name || ""}
                        onChange={(event) => handleChange("name", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email - Disabled */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>📧</span> Email Address
                      </label>
                      <input
                        value={form.email || ""}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
                      />
                      <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>📞</span> Phone Number
                      </label>
                      <input
                        value={form.phone || ""}
                        onChange={(event) => handleChange("phone", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    {/* City & Blood Group Row */}
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <span>📍</span> City
                        </label>
                        <input
                          value={form.city || ""}
                          onChange={(event) => handleChange("city", event.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                          placeholder="Your city"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <span>🩸</span> Blood Group
                        </label>
                        <select
                          value={form.bloodGroup || "O+"}
                          onChange={(event) => handleChange("bloodGroup", event.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                        >
                          {bloodGroups.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {form.role === "hospital" && (
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <span>🏥</span> Hospital Name
                        </label>
                        <input
                          value={form.hospitalName || ""}
                          onChange={(event) => handleChange("hospitalName", event.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                          placeholder="Enter hospital name"
                        />
                      </div>
                    )}

                    {form.role === "ambulance_driver" && (
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <span>🚑</span> Vehicle Number
                        </label>
                        <input
                          value={form.vehicleNumber || ""}
                          onChange={(event) => handleChange("vehicleNumber", event.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                          placeholder="Enter vehicle number"
                        />
                      </div>
                    )}

                    {/* Address */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>🏠</span> Address
                      </label>
                      <textarea
                        rows="3"
                        value={form.address || ""}
                        onChange={(event) => handleChange("address", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/50"
                        placeholder="Your complete address"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={saving || avatarUploading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 font-bold text-white transition-all hover:shadow-lg disabled:opacity-60"
                      >
                        {saving || avatarUploading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="h-5 w-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                              <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="currentColor"
                                strokeLinecap="round"
                              />
                            </svg>
                            Saving Changes...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            💾 Save Profile Changes
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}