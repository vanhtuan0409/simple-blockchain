// @flow
import WebSocket from "ws";
import SocketPool from "./socketPool";

export function handleSocketConnection(ws: WebSocket, pool: SocketPool) {
  console.log("A new node has been connected");
  pool.addSocket(ws);
  ws.on("close", () => pool.removeSocket(ws));
  ws.on("error", () => pool.removeSocket(ws));
}
