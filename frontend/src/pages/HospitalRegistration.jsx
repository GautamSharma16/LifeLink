import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { getCurrentRole } from "../lib/auth";

const initialForm = {
  hospitalName: "",
  hospitalDescription: "",
  hospitalRegistrationNumber: "",
  phone: "",
  emergencyContact: "",
  address: "",
  city: "",
  availableBeds: 0,
  icuBeds: 0,
  oxygenCylinders: 0,
};

export default function HospitalRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (getCurrentRole() !== "hospital") {
      navigate("/dashboard");
      return;
    }

    const loadHospital = async () => {
      try {
        const res = await api.get("/hospitals/me");
        if (res.data.success && res.data.data) {
          setForm({
            hospitalName: res.data.data.hospitalName || "",
            hospitalDescription: res.data.data.hospitalDescription || "",
            hospitalRegistrationNumber: res.data.data.hospitalRegistrationNumber || "",
            phone: res.data.data.phone || "",
            emergencyContact: res.data.data.emergencyContact || "",
            address: res.data.data.address || "",
            city: res.data.data.city || "",
            availableBeds: res.data.data.availableBeds || 0,
            icuBeds: res.data.data.icuBeds || 0,
            oxygenCylinders: res.data.data.oxygenCylinders || 0,
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load hospital profile");
      } finally {
        setLoading(false);
      }
    };

    loadHospital();
  }, [navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/hospitals/register", form);
      const updatedUser = res.data.data;
      if (updatedUser) {
        localStorage.setItem("lifelink_user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("lifelink-auth-changed"));
      }
      toast.success("Hospital profile saved successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save hospital profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-6 py-16 text-center text-slate-500">Loading hospital profile...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-rose-600 to-red-500 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-100">Hospital Setup</p>
        <h1 className="mt-3 text-4xl font-black">Register Your Hospital</h1>
        <p className="mt-3 max-w-2xl text-sm text-rose-50">
          Complete your hospital profile so patients can find you, admins can verify you, and your camps can reach nearby volunteers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Hospital Name
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.hospitalName} onChange={(e) => handleChange("hospitalName", e.target.value)} required />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Registration Number
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.hospitalRegistrationNumber} onChange={(e) => handleChange("hospitalRegistrationNumber", e.target.value)} required />
          </label>
        </div>

        <label className="text-sm font-semibold text-slate-700">
          Hospital Description
          <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.hospitalDescription} onChange={(e) => handleChange("hospitalDescription", e.target.value)} placeholder="Emergency services, departments, and other helpful details" />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Phone
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Emergency Contact
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            City
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.city} onChange={(e) => handleChange("city", e.target.value)} required />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Address
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            Available Beds
            <input type="number" min="0" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.availableBeds} onChange={(e) => handleChange("availableBeds", Number(e.target.value) || 0)} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            ICU Beds
            <input type="number" min="0" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.icuBeds} onChange={(e) => handleChange("icuBeds", Number(e.target.value) || 0)} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Oxygen Cylinders
            <input type="number" min="0" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.oxygenCylinders} onChange={(e) => handleChange("oxygenCylinders", Number(e.target.value) || 0)} />
          </label>
        </div>

        <div className="flex flex-wrap gap-4">
          <button type="submit" disabled={saving} className="rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save Hospital Profile"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} className="rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-700">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
