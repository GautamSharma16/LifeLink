import { getCurrentRole } from "../lib/auth";
import Dashboard from "./Dashboard";

const roleCards = {
  user: ["Request Blood", "Book Ambulance", "Find Hospitals", "Track Emergency"],
  volunteer: ["Nearby Blood Requests", "Volunteer Requests", "Rewards", "Availability Toggle"],
  hospital: ["Total Beds", "ICU Beds", "Oxygen Beds", "Emergency Requests"],
  ambulance_driver: ["New Ride Requests", "Live Navigation", "Trips", "Online Toggle"],
  admin: ["Users", "Hospitals", "Analytics", "Fraud Reports"],
};

const roleTagline = {
  user: "Track blood, ambulance, volunteer and hospital support in real time.",
  volunteer: "Accept nearby requests and earn badges by helping people.",
  hospital: "Manage bed availability and incoming emergency requests.",
  ambulance_driver: "Handle emergency rides with live status updates.",
  admin: "Monitor platform health, analytics, and risk controls.",
};

export default function RoleDashboard() {
  const role = getCurrentRole();
  const cards = roleCards[role] || roleCards.user;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 p-5 text-white shadow">
        <p className="text-xs uppercase tracking-wider">{role.replace("_", " ")}</p>
        <h2 className="text-2xl font-bold">Role Dashboard</h2>
        <p className="mt-1 text-sm text-white/90">{roleTagline[role] || roleTagline.user}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((item) => (
          <div key={item} className="rounded-2xl bg-white p-4 shadow dark:bg-slate-900">
            <p className="text-sm text-slate-500">{role.replace("_", " ").toUpperCase()}</p>
            <p className="text-lg font-bold">{item}</p>
          </div>
        ))}
      </div>
      <Dashboard />
    </div>
  );
}
