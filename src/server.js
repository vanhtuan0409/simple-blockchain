// @flow
import express from "express";
import BlockChain from "./blockchain";
import Block from "./block";

const bc = new BlockChain();

const app = express();

app.get("/chain", function(req, res) {
  const chain = bc.getChain();
  res.json(chain);
});

const port = process.env.HTTP_PORT || 3000;
app.listen(port, function() {
  console.log(`Node is running on port: ${port}`);
});
