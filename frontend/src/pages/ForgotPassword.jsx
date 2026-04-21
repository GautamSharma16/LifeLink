import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setToken(res?.data?.data?.resetToken || "");
      toast.success("Reset link generated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate reset link");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
        <h2 className="mb-3 text-2xl font-bold">Forgot Password</h2>
        <input
          className="mb-3 w-full rounded-xl border px-3 py-2 dark:bg-slate-800"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full rounded-xl bg-brand-500 py-2 font-semibold text-white">Generate Reset Link</button>
        {token && (
          <p className="mt-4 text-sm">
            Demo reset link: <Link className="text-brand-500 underline" to={`/reset-password/${token}`}>Reset Password</Link>
          </p>
        )}
      </form>
    </div>
  );
}
