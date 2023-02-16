import { WebSocketServer, WebSocket } from "ws";
import "colors";
import * as url from "url";

const wss = new WebSocketServer({ port: 4040 });
console.log("Creating server");

wss.on("connection", function connection(ws: WebSocket, req) {
  console.log("New Connection");
  const parameters = url.parse(req.url, true);

  ws.on("message", function incoming(message, isBinary) {
    console.log(message.toString());
  });
});
