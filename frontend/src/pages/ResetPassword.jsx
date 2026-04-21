import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
        <h2 className="mb-3 text-2xl font-bold">Reset Password</h2>
        <input
          type="password"
          className="mb-3 w-full rounded-xl border px-3 py-2 dark:bg-slate-800"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-xl bg-brand-500 py-2 font-semibold text-white">Update Password</button>
      </form>
    </div>
  );
}
