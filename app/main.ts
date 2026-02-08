import * as net from "net";
import {
  applyCompression,
  buildResponse,
  createLogger,
  getRoute,
  parseHTTPRequest,
} from "./helpers/utils";
import { HeadersEnum } from "./constants/enums";

const log = createLogger("server");
const { PORT } = process.env;

const server = net.createServer((socket) => {
  log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const req = parseHTTPRequest(data);
    let res = getRoute(req);
    res = applyCompression(req, res);
    socket.write(buildResponse(res));
    socket.write(res.body);
    if (res.headers[HeadersEnum.CONNECTION].toLowerCase() === "close") {
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
