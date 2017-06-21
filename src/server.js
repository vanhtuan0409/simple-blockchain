// @flow
import express from "express";
import parser from "body-parser";
import BlockChain from "./blockchain";
import Block from "./block";

// Create actual blockchain data
const bc = new BlockChain();

const app = express();
app.use(parser.json());

app.get("/chain", function(req, res) {
  const chain = bc.getChain();
  res.json(chain);
});

app.post("/commit", function(req, res) {
  const body = req.body;
  if (!body.data) {
    res.status(400).end();
    return;
  }
  try {
    bc.commit(body.data);
    res.status(200).end();
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.all("*", function(req, res) {
  res.status(404).end();
});

const port = process.env.HTTP_PORT || 3000;
app.listen(port, function() {
  console.log(`Node is running on port: ${port}`);
});
