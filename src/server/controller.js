// @flow
import BlockChain from "../core/blockchain";
import { Request, Response } from "express";

export default class Controller {
  bc: BlockChain;
  getChain: Function;
  commit: Function;

  constructor(chain: BlockChain) {
    this.bc = chain;
    this.getChain = this.getChain.bind(this);
    this.commit = this.commit.bind(this);
  }

  getChain(req: Request, res: Response) {
    const chain = this.bc.getChain();
    res.json(chain);
  }

  commit(req: Request, res: Response) {
    const body = req.body;
    if (!body.data) {
      res.status(400).end();
      return;
    }
    try {
      this.bc.commit(body.data);
      res.status(200).end();
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
}
