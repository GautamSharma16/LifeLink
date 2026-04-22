import { getCurrentRole } from "../lib/auth";
import UserDashboard from "./dashboards/UserDashboard";
import VolunteerDashboard from "./dashboards/VolunteerDashboard";
import HospitalDashboard from "./dashboards/HospitalDashboard";
import AmbulanceDashboard from "./dashboards/AmbulanceDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

export default function RoleDashboard() {
  const role = getCurrentRole();

  switch (role) {
    case "volunteer":
      return <VolunteerDashboard />;
    case "hospital":
      return <HospitalDashboard />;
    case "ambulance_driver":
      return <AmbulanceDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "user":
    default:
      return <UserDashboard />;
  }
}
