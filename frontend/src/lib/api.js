import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://lifelink-90hv.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lifelink_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
