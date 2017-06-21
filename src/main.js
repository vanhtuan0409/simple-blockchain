// @flow
import express from "express";
import http from "http";
import parser from "body-parser";
import socketIO from "socket.io";

import BlockChain from "./core/blockchain";
import Block from "./core/block";

import Controller from "./server/controller";
import SocketPool from "./server/socketPool";

// Create actual blockchain data
const pool = new SocketPool();
const bc = new BlockChain();
const ctrl = new Controller(bc, pool);

// Init infrastructure
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Routing http request
app.use(parser.json());
app.get("/chain", ctrl.getChain);
app.get("/peers", ctrl.getPeers);
app.post("/commit", ctrl.commit);
app.all("*", function(req, res) {
  res.status(404).end();
});

// Routing socket request
io.on("connection", function(ws) {
  console.log("A new node has been connected");
  pool.addSocket(ws);
  ws.on("hello", data => console.log(data));
  ws.on("close", () => pool.removeSocket(ws));
  ws.on("error", () => pool.removeSocket(ws));
});

const port = parseInt(process.env.HTTP_PORT, 10) || 3000;
server.listen(port, undefined, undefined, function(err) {
  console.log(`Node is running on port: ${port}`);
});
