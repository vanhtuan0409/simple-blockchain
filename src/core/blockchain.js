// @flow
import Block from "./block";
import { hash } from "../crypto/hash";

// Calculate genesis block
const genesisBlock: Block = Object.create(Block.prototype);
genesisBlock.id = 0;
genesisBlock.previousHash = "";
genesisBlock.data = { msg: "This is the genesis block" };
genesisBlock.timestamp = new Date();
const beforeHash =
  genesisBlock.id.toString() +
  JSON.stringify(genesisBlock.data) +
  genesisBlock.previousHash +
  genesisBlock.timestamp.toString();
genesisBlock.hash = hash(beforeHash);

export default class BlockChain {
  static GenesisBlock(): Block {
    return genesisBlock;
  }

  chain: Array<Block>;

  constructor() {
    this.chain = [genesisBlock];
  }

  getChain(): Array<Block> {
    return this.chain;
  }

  getSize(): number {
    return this.chain.length;
  }

  getLatestBlock(): Block {
    const size = this.getSize();
    return this.chain[size - 1];
  }

  commit(data: Object): Block {
    const newBlock = this.generateNextBlock(data);
    this.addNewBlock(newBlock);
    return newBlock;
  }

  generateNextBlock(data: Object): Block {
    const latestBlock = this.getLatestBlock();
    return new Block(data, latestBlock);
  }

  isValidNextBlock(block: Block): boolean {
    if (!Block.validateHash(block)) return false;
    const latestBlock = this.getLatestBlock();
    if (block.previousHash !== latestBlock.hash) return false;
    if (block.id - latestBlock.id !== 1) return false;
    return true;
  }

  addNewBlock(block: Block) {
    if (!this.isValidNextBlock(block))
      throw new Error("Next block is not valid");
    this.chain.push(block);
  }
}
