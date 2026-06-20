import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

export const SocketContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState();

  //   -------------Getting the token --------------------//
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return;
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    }
  }, []);

  //  ---------------creating the connection with the backend-----------//
  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // --------------- registring the user with the soccket id -------------//
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("connected:", socket.id);
      socket.emit("register", userId);
    });
    return () => {
      socket.off("connect");
    };
  }, [socket, userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
