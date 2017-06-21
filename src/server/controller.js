// @flow
import BlockChain from "../core/blockchain";
import SocketPool from "./socketPool";
import { Request, Response } from "express";

export default class Controller {
  bc: BlockChain;
  pool: SocketPool;
  getChain: Function;
  getPeers: Function;
  commit: Function;

  constructor(chain: BlockChain, pool: SocketPool) {
    this.bc = chain;
    this.pool = pool;
    this.getChain = this.getChain.bind(this);
    this.getPeers = this.getPeers.bind(this);
    this.commit = this.commit.bind(this);
  }

  getChain(req: Request, res: Response) {
    const chain = this.bc.getChain();
    res.json(chain);
  }

  getPeers(req: Request, res: Response) {
    const addresses = this.pool.getConnectedNodes();
    res.json(addresses);
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
