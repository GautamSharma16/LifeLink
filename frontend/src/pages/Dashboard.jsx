import { useQuery } from "react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../lib/api";

export default function Dashboard() {
  const { data } = useQuery("dashboard-stats", async () => (await api.get("/dashboard/stats")).data.data);
  const chart = [
    { name: "Blood", value: data?.totalBloodRequests || 0 },
    { name: "Donations", value: data?.totalDonations || 0 },
    { name: "Ambulance", value: data?.totalAmbulanceRequests || 0 },
    { name: "Volunteer", value: data?.totalVolunteerRequests || 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {chart.map((c) => (
          <div key={c.name} className="rounded-2xl bg-white p-4 shadow dark:bg-slate-900">
            <p className="text-sm text-slate-500">{c.name}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold">Emergency Analytics Dashboard</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#e11d48" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
