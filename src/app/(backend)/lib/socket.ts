import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server | null = null;

export const getIO = (server?: HTTPServer) => {
  if (!io && server) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    console.log("✅ Socket.IO server started");

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);
    });
  }
  return io;
};
