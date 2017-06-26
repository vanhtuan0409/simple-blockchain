// @flow
import Block from "./block";
import { hash } from "../crypto/hash";
import equal from "deep-equal";

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

  static isSequenceBlock(prev: Block, next: Block): boolean {
    if (!Block.validateHash(prev)) return false;
    if (!Block.validateHash(next)) return false;
    if (next.previousHash !== prev.hash) return false;
    if (next.id - prev.id !== 1) return false;
    return true;
  }

  static validateBlockChain(bc: BlockChain): boolean {
    const chain = bc.getChain();
    const zeroBlock = chain[0];
    const isGenesisBlock = equal(zeroBlock, BlockChain.GenesisBlock());
    if (!isGenesisBlock) return false;
    for (let i = 1; i < chain.length; i++) {
      const prevBlock = chain[i - 1];
      const nextBlock = chain[i];
      if (!BlockChain.isSequenceBlock(prevBlock, nextBlock)) return false;
    }
    return true;
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
    const latestBlock = this.getLatestBlock();
    return BlockChain.isSequenceBlock(latestBlock, block);
  }

  addNewBlock(block: Block) {
    if (!this.isValidNextBlock(block))
      throw new Error("Next block is not valid");
    this.chain.push(block);
  }

  replaceChain(chain: BlockChain) {
    const isReceivedChainValid = BlockChain.validateBlockChain(chain);
    if (!isReceivedChainValid) {
      throw new Error("New chain is not valid");
    }
    this.chain = chain.chain;
  }
}
