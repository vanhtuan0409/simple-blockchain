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
const ctrl = new Controller(bc, pool.broadcast);

// Init infrastructure
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Routing http request
app.use(parser.json());
app.get("/chain", ctrl.getChain);
app.post("/commit", ctrl.commit);
app.all("*", function(req, res) {
  res.status(404).end();
});

// Routing socket request
io.on("connection", function(socket) {
  console.log("A new node has been connected");
});

const port = parseInt(process.env.HTTP_PORT, 10) || 3000;
server.listen(port, undefined, undefined, function(err) {
  console.log(`Node is running on port: ${port}`);
});
