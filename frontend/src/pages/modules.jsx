import { useQuery } from "react-query";
import api from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Card = ({ title, children }) => (
  <section className="rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-900">
    <h3 className="mb-3 text-lg font-semibold">{title}</h3>
    {children}
  </section>
);

export function DonateBloodPage() {
  const { data, isLoading } = useQuery("blood-requests", async () => (await api.get("/blood")).data.data);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Live Blood Requests">
        {isLoading ? (
          <p>Loading nearby requests...</p>
        ) : (
          <div className="space-y-3">
            {(data || []).slice(0, 4).map((item) => (
              <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border p-3">
                <p className="font-semibold">
                  {item.bloodGroup} - {item.units} units
                </p>
                <p className="text-sm text-slate-500">{item.hospitalName}</p>
              </motion.div>
            ))}
            {!data?.length && <p className="text-sm text-slate-500">No active requests right now.</p>}
          </div>
        )}
      </Card>
      <Card title="Confirm Donation">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Donation interest submitted");
          }}
        >
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Your blood group" />
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Current city" />
          <button className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">I Can Donate</button>
        </form>
      </Card>
    </div>
  );
}

export function RequestBloodPage() {
  return (
    <Card title="Request Blood">
      <form className="grid gap-3 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <input className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Patient name" />
        <input className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Hospital name" />
        <select className="rounded-xl border px-3 py-2 dark:bg-slate-800">
          <option>Select blood group</option>
          <option>A+</option>
          <option>B+</option>
          <option>O+</option>
          <option>AB+</option>
        </select>
        <input className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Units required" />
        <textarea className="md:col-span-2 rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Critical notes" />
        <button className="md:col-span-2 rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">Submit Emergency Request</button>
      </form>
    </Card>
  );
}
export function AmbulancePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Request Ambulance">
        <form className="space-y-3">
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Pickup address" />
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Destination hospital" />
          <textarea className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Patient condition" />
          <button className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">Request Now</button>
        </form>
      </Card>
      <Card title="Live Tracking">
        <img
          className="h-44 w-full rounded-xl object-cover"
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop"
          alt="Ambulance"
        />
        <p className="mt-3 text-sm">Driver assigned in 2 mins. ETA: 08:15 min. Status: En route.</p>
      </Card>
    </div>
  );
}
export function HospitalsPage() {
  return (
    <Card title="Hospitals Near You">
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Search by city" />
        <select className="rounded-xl border px-3 py-2 dark:bg-slate-800">
          <option>ICU availability</option>
          <option>Available</option>
          <option>Limited</option>
        </select>
        <button className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">Search</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {["City Care Hospital", "Hope Medical Center"].map((name) => (
          <div key={name} className="rounded-xl border p-4">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-slate-500">Beds: 16 | ICU: 4 | Oxygen: Available</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
export function VolunteersPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Request Volunteer Help">
        <form className="space-y-3">
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Your city" />
          <select className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800">
            <option>Support type</option>
            <option>Hospital support</option>
            <option>Medicine pickup</option>
            <option>Elderly transport</option>
          </select>
          <textarea className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Describe your emergency" />
          <button className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">Send Request</button>
        </form>
      </Card>
      <Card title="Nearby Volunteers">
        <div className="space-y-3">
          {["Rohan - 1.2 km", "Anika - 2.1 km", "Samar - 3.0 km"].map((vol) => (
            <div key={vol} className="rounded-xl border p-3">
              <p className="font-medium">{vol}</p>
              <p className="text-xs text-slate-500">Verified emergency volunteer</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
