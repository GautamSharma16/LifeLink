import { useQuery } from "react-query";
import api from "../lib/api";

export default function Notifications() {
  const { data } = useQuery("notifications", async () => (await api.get("/notifications")).data.data);

  return (
    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-900">
      <h2 className="mb-4 text-xl font-semibold">Notifications</h2>
      <div className="space-y-3">
        {(data || []).map((n) => (
          <div key={n._id} className="rounded-xl border p-3">
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-slate-500">{n.message}</p>
          </div>
        ))}
        {!data?.length && <p className="text-sm text-slate-500">No notifications yet.</p>}
      </div>
    </div>
  );
}
