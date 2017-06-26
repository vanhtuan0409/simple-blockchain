// @flow
import WebSocket from "ws";
import BlockChain from "../core/blockchain";
import Block from "../core/block";
import SocketPool from "./socketPool";

export default class SocketHandler {
  bc: BlockChain;
  pool: SocketPool;
  getBlockChain: Function;
  receiveBlockChain: Function;
  receiveNewBlock: Function;

  constructor(chain: BlockChain, pool: SocketPool) {
    this.bc = chain;
    this.pool = pool;
    this.getBlockChain = this.getBlockChain.bind(this);
    this.receiveBlockChain = this.receiveBlockChain.bind(this);
    this.receiveNewBlock = this.receiveNewBlock.bind(this);
  }

  getBlockChain(ws: WebSocket, data: Object) {
    const latestBlock = this.bc.getLatestBlock();
    this.pool.emit(ws, "RESPONSE_BLOCK_CHAIN", this.bc);
  }

  receiveBlockChain(ws: WebSocket, data: Object) {
    const receivedChain = BlockChain.fromObject(data);
    const receivedChainSize = receivedChain.getSize();
    const holdChainSize = this.bc.getSize();

    try {
      if (receivedChainSize > holdChainSize) {
        this.bc.replaceChain(receivedChain);
      }
    } catch (error) {
      console.log(`[ERROR] ${error.message}`);
    }
  }

  receiveNewBlock(ws: WebSocket, data: Object) {
    const newBlock = Block.fromObject(data);
    try {
      this.bc.addNewBlock(newBlock);
    } catch (error) {
      console.log(`[ERROR] ${error.message}`);
    }
  }
}
