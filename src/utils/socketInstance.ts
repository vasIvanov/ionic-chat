import io, { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocketInstance() {
  if (socketInstance === null) {
    socketInstance = io(process.env.REACT_APP_API_URL ?? "");
  }
  return socketInstance;
}
