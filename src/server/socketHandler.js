import WebSocket from "ws";
import BlockChain from "../core/blockchain";
import SocketPool from "./socketPool";

export default class SocketHandler {
  bc: BlockChain;
  pool: SocketPool;
  getBlockChain: Function;

  constructor(chain: BlockChain, pool: SocketPool) {
    this.bc = chain;
    this.pool = pool;
    this.getBlockChain = this.getBlockChain.bind(this);
  }

  getBlockChain(ws: WebSocket, data: Object) {
    console.log("receive request");
  }
}
