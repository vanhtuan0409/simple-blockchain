import BlockChain from "../core/blockchain";

export default class Controller {
  bc: BlockChain;
  constructor(chain: BlockChain) {
    this.bc = chain;
    this.getChain = this.getChain.bind(this);
    this.commit = this.commit.bind(this);
  }

  getChain(req, res) {
    const chain = this.bc.getChain();
    res.json(chain);
  }

  commit(req, res) {
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
