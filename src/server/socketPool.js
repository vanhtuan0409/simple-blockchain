// @flow
import SocketIO from "socket.io";

export default class SocketPool {
  pool: Array<SocketIO.Socket>;
  isExist: Function;
  addSocket: Function;
  removeSocket: Function;
  broadcast: Function;
  constructor() {
    this.pool = [];
    this.isExist = this.isExist.bind(this);
    this.addSocket = this.addSocket.bind(this);
    this.removeSocket = this.removeSocket.bind(this);
    this.broadcast = this.broadcast.bind(this);
  }

  isExist(ws: SocketIO.Socket): boolean {
    return this.pool.includes(ws);
  }

  addSocket(ws: SocketIO.Socket): boolean {
    if (!this.isExist(ws)) {
      this.pool.push(ws);
      return true;
    }
    return false;
  }

  removeSocket(ws: SocketIO.Socket): boolean {
    const index = this.pool.indexOf(ws);
    if (index > -1) {
      this.pool.splice(index, 1);
      return true;
    }
    return false;
  }

  broadcast(type: string, data: Object) {
    const message = { type, data };
    this.pool.forEach(ws => {
      ws.emit(type, data);
    });
  }
}
