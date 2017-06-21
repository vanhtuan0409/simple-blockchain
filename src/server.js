// @flow
import BlockChain from "./blockchain";
import Block from "./block";

const chain = new BlockChain();
chain.commit({ msg: "new block" });
