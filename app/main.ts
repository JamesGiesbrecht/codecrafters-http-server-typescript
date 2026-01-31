import * as net from "net";
import { createLogger } from "./helpers/utils";
import { CONSTANTS } from "./constants";

const log = createLogger("server");

const server = net.createServer((socket) => {
  log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on("close", () => {
    log(`Connection closed from ${socket.remoteAddress}:${socket.remotePort}`);
    socket.end();
  });

  socket.write(`HTTP/1.1 200 OK${CONSTANTS.CRLF}${CONSTANTS.CRLF}`);
});

server.on("error", (err) => {
  throw err;
});

server.listen(4221, "localhost");
