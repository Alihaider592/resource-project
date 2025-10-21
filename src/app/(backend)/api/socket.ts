// src/app/(backend)/api/socket.ts
import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    return res.status(500).end("Socket not available");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const server = (res.socket as any).server;

  if (!server.io) {
    console.log("Setting up Socket.IO server...");
    const io = new Server(server);
    server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
    });
  }

  res.end();
}
