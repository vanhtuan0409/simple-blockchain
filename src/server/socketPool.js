// @flow
import WebSocket from "ws";

export default class SocketPool {
  pool: Array<WebSocket>;
  isExist: Function;
  getConnectedNodes: Function;
  addSocket: Function;
  removeSocket: Function;
  broadcast: Function;
  emit: Function;

  constructor() {
    this.pool = [];
    this.isExist = this.isExist.bind(this);
    this.addSocket = this.addSocket.bind(this);
    this.removeSocket = this.removeSocket.bind(this);
    this.broadcast = this.broadcast.bind(this);
    this.getConnectedNodes = this.getConnectedNodes.bind(this);
    this.emit = this.emit.bind(this);
  }

  isExist(ws: WebSocket): boolean {
    return this.pool.includes(ws);
  }

  getConnectedNodes(): Array<string> {
    return this.pool.map(ws => ws.url);
  }

  addSocket(ws: WebSocket): boolean {
    if (!this.isExist(ws)) {
      this.pool.push(ws);
      return true;
    }
    return false;
  }

  removeSocket(ws: WebSocket): boolean {
    const index = this.pool.indexOf(ws);
    if (index > -1) {
      console.log("A socket has disconnected");
      this.pool.splice(index, 1);
      return true;
    }
    return false;
  }

  broadcast(type: string, data: Object) {
    this.pool.forEach(ws => {
      this.emit(ws, type, data);
    });
  }

  emit(ws: WebSocket, type: string, data: Object) {
    const message = JSON.stringify({ type, data });
    ws.send(message);
  }
}
