import { io } from "socket.io-client";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || apiBaseUrl.replace(/\/api\/v1\/?$/, "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
