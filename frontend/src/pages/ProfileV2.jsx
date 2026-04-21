import { useEffect, useMemo, useState } from "react";
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
};

export default function ProfileV2() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState("");
  const [form, setForm] = useState(emptyForm);

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
    return new Date(form.createdAt).toLocaleDateString();
  }, [form.createdAt]);

  const stats = [
    { label: "Role", value: String(form.role || "user").replace("_", " ") },
    { label: "Blood Group", value: form.bloodGroup || "-" },
    { label: "City", value: form.city || "-" },
    { label: "Joined", value: joinedOn },
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
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.name || "Profile"}
                  className="h-32 w-32 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-4xl font-black text-white shadow-lg">
                  {(form.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="mt-5 text-3xl font-black">{form.name || "User profile"}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{form.email}</p>
            <p className="mt-2 rounded-full bg-rose-50 px-4 py-1 text-sm font-semibold capitalize text-rose-600 dark:bg-rose-950/30">
              {String(form.role || "user").replace("_", " ")}
            </p>
          </div>

          <label className="mt-8 block rounded-2xl border border-dashed border-slate-300 p-4 text-center transition hover:border-rose-400 dark:border-slate-700">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              {avatarUploading ? "Preparing image..." : "Upload profile image"}
            </span>
            <span className="mt-1 block text-xs text-slate-500">Image will be uploaded to Cloudinary when you save.</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <p className="mt-3 text-lg font-bold capitalize">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Profile details</p>
        <h2 className="mt-4 text-3xl font-black">Manage your information</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Keep your contact details and blood information current so the platform can support you better during urgent requests.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Full name</label>
            <input
              value={form.name || ""}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              value={form.email || ""}
              disabled
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Phone</label>
            <input
              value={form.phone || ""}
              onChange={(event) => handleChange("phone", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">City</label>
            <input
              value={form.city || ""}
              onChange={(event) => handleChange("city", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              placeholder="City"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Blood Group</label>
            <select
              value={form.bloodGroup || "O+"}
              onChange={(event) => handleChange("bloodGroup", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
            >
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Address</label>
            <textarea
              rows="4"
              value={form.address || ""}
              onChange={(event) => handleChange("address", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              placeholder="Address"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving || avatarUploading}
              className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
