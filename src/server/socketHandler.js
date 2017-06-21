import WebSocket from "ws";
import BlockChain from "../core/blockchain";
import SocketPool from "./socketPool";

export default class SocketHandler {
  bc: BlockChain;
  pool: SocketPool;
  getBlockChain: Function;
  receiveBlockChain: Function;

  constructor(chain: BlockChain, pool: SocketPool) {
    this.bc = chain;
    this.pool = pool;
    this.getBlockChain = this.getBlockChain.bind(this);
    this.receiveBlockChain = this.receiveBlockChain.bind(this);
  }

  getBlockChain(ws: WebSocket, data: Object) {
    this.pool.emit(ws, "RESPONSE_BLOCK_CHAIN", this.bc);
  }

  receiveBlockChain(ws: WebSocket, data: Object) {
    console.log(data);
  }
}