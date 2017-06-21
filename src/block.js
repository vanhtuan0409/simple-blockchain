import { hash } from "./hash";

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
