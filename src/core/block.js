// @flow
import { hash } from "../crypto/hash";

export default class Block {
  id: number;
  previousHash: string;
  hash: string;
  data: Object;
  timestamp: Date;

  static validateHash(block: Block): boolean {
    const dataJson = JSON.stringify(block.data);
    const timestampString = block.timestamp.toString();
    const beforeHash =
      block.id.toString() + dataJson + block.previousHash + timestampString;
    const testHash = hash(beforeHash);
    return testHash === block.hash;
  }

  static fromObject(obj: Object): Block {
    const block: Block = Object.create(Block.prototype);
    block.id = (obj.id: number);
    block.previousHash = (obj.previousHash: string);
    block.hash = (obj.hash: string);
    block.data = (obj.data: Object);
    block.timestamp = new Date(obj.timestamp);
    return block;
  }

  constructor(data: Object, previousBlock: Block) {
    this.id = previousBlock.id + 1;
    this.previousHash = previousBlock.hash;
    this.data = data;
    this.timestamp = new Date();

    const dataJson = JSON.stringify(data);
    const timestampString = this.timestamp.toString();
    const beforeHash =
      this.id.toString() + dataJson + this.previousHash + timestampString;
    this.hash = hash(beforeHash);
  }
}
