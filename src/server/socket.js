// @flow
import WebSocket from "ws";
import SocketPool from "./socketPool";
import SocketHandler from "./socketHandler";

export function handleSocketConnection(
  ws: WebSocket,
  pool: SocketPool,
  handler: SocketHandler
) {
  console.log("A new node has been connected");
  pool.addSocket(ws);
  pool.emit(ws, "REQUEST_BLOCK_CHAIN");

  ws.on("message", message => handleSocketMessage(ws, message, handler));
  ws.on("close", () => pool.removeSocket(ws));
  ws.on("error", () => pool.removeSocket(ws));
}

function handleSocketMessage(
  ws: WebSocket,
  message: string,
  handler: SocketHandler
) {
  const event = JSON.parse(message);
  switch (event.type) {
    case "REQUEST_BLOCK_CHAIN":
      handler.getBlockChain(ws, event.data);
      break;
    case "RESPONSE_BLOCK_CHAIN":
      handler.receiveBlockChain(ws, event.data);
      break;
    case "NEW_BLOCK_CREATED":
      handler.receiveNewBlock(ws, event.data);
      break;
  }
}
