import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // The backend URL would normally be determined by environment
    // Assume it's same domain/port in production or standard dev port
    const socketInstance = io(import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8080");

    setSocket(socketInstance);

    // Global listeners for notifications
    socketInstance.on("blood_request_created", (req) => {
      // You can refine this by checking if the user is a volunteer/hospital in the local city
      toast(`🩸 New Blood Request: ${req.bloodGroup} at ${req.hospitalName}`, {
        icon: '🚨',
        style: { borderRadius: '10px', background: '#e11d48', color: '#fff' }
      });
    });

    socketInstance.on("blood_request_accepted", (req) => {
      toast(`✅ Blood Request Accepted!`, {
        icon: '👏',
        style: { borderRadius: '10px', background: '#10b981', color: '#fff' }
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
