import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(); // You can also provide server URL: io("http://localhost:3001")
  }
  return socket;
};
