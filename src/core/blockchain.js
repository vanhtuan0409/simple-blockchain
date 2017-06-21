// @flow
import Block from "./block";
import { hash } from "../crypto/hash";

// Calculate genesis block
const genesisBlock: Block = Object.create(Block.prototype);
genesisBlock.id = 0;
genesisBlock.previousHash = "";
genesisBlock.data = { msg: "This is the genesis block" };
genesisBlock.timestamp = new Date("2017-01-01");
const beforeHash =
  genesisBlock.id.toString() +
  JSON.stringify(genesisBlock.data) +
  genesisBlock.previousHash +
  genesisBlock.timestamp.toString();
genesisBlock.hash = hash(beforeHash);

// Define class
export default class BlockChain {
  static GenesisBlock(): Block {
    return genesisBlock;
  }

  static fromObject(obj: Object): BlockChain {
    const chain: BlockChain = Object.create(BlockChain.prototype);
    chain.chain = [];
    obj.chain.forEach(block => {
      chain.chain.push(Block.fromObject(block));
    });
    return chain;
  }

  chain: Array<Block>;
  getChain: Function;
  getSize: Function;
  getLatestBlock: Function;
  commit: Function;
  generateNextBlock: Function;
  isValidNextBlock: Function;
  addNewBlock: Function;

  constructor() {
    this.chain = [genesisBlock];
    this.getChain = this.getChain.bind(this);
    this.getSize = this.getSize.bind(this);
    this.getLatestBlock = this.getLatestBlock.bind(this);
    this.commit = this.commit.bind(this);
    this.generateNextBlock = this.generateNextBlock.bind(this);
    this.isValidNextBlock = this.isValidNextBlock.bind(this);
    this.addNewBlock = this.addNewBlock.bind(this);
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
