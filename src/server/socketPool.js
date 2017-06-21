// @flow
import { Socket } from "socket.io";

export default class SocketPool {
  pool: Array<Socket>;
  constructor() {
    this.pool = [];
  }

  isExist(ws: Socket): boolean {
    return this.pool.includes(ws);
  }

  addSocket(ws: Socket) {
    if (!this.isExist(ws)) {
      this.pool.push(ws);
    }
  }
}
