import * as net from "net";
import { createLogger } from "./helpers/utils";
import { HTTPRequest } from "./models/HTTPRequest";

const log = createLogger("server");
const { PORT } = process.env;

const server = net.createServer((socket) => {
  log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const req = new HTTPRequest(data);
    let res = req.generateResponse();
    socket.write(res.response);
    socket.write(res.body);
    if (res.shouldClose) {
      socket.end();
    }
  });
});

server.on("error", (err) => {
  throw err;
});

server.listen({ port: Number(PORT), host: "localhost" }, () => {
  log(`Server is listening on port ${PORT}`);
});
