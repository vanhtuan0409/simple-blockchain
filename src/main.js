// @flow
import express from "express";
import http from "http";
import parser from "body-parser";
import WebSocket from "ws";
import yargs from "yargs";

import BlockChain from "./core/blockchain";
import Block from "./core/block";

import Controller from "./server/controller";
import { handleSocketConnection } from "./server/socket";
import SocketPool from "./server/socketPool";

// Create actual blockchain data
const pool = new SocketPool();
const bc = new BlockChain();
const ctrl = new Controller(bc, pool);
const argv = yargs.array("peers").argv;

// Init infrastructure
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Routing http request
app.use(parser.json());
app.get("/chain", ctrl.getChain);
app.get("/peers", ctrl.getPeers);
app.post("/commit", ctrl.commit);
app.all("*", function(req, res) {
  res.status(404).end();
});

// Receive connection request
wss.on("connection", function(ws: WebSocket, req: http.IncomingMessage) {
  const incommingSocket = req.socket;
  const incommingHost = incommingSocket.remoteAddress;
  const incommingPort = incommingSocket.remotePort.toString();
  // $FlowFixMe
  ws.url = `${incommingHost}:${incommingPort}`;
  handleSocketConnection(ws, pool);
});

// Connect to initial peers
const peers = argv.peers || [];
peers.forEach(p => {
  const ws = new WebSocket(p);
  ws.on("open", () => handleSocketConnection(ws, pool));
});

const port = parseInt(process.env.HTTP_PORT, 10) || argv.port || 3000;
server.listen(port, undefined, undefined, function(err) {
  console.log(`Node is running on port: ${port}`);
});
