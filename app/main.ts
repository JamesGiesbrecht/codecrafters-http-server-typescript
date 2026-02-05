import * as net from "net";
import {
  applyCompression,
  buildResponse,
  createLogger,
  getRoute,
  parseHTTPRequest,
} from "./helpers/utils";

const log = createLogger("server");
const { PORT } = process.env;

const filesDirectoryIndex = process.argv.findIndex(
  (arg) => arg === "--directory",
);

export let filesDirectory = "/tmp/";
if (filesDirectoryIndex > -1 && process.argv[filesDirectoryIndex + 1]) {
  filesDirectory = process.argv[filesDirectoryIndex + 1];
}

const server = net.createServer((socket) => {
  log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on("close", () => {
    log(`Connection closed from ${socket.remoteAddress}:${socket.remotePort}`);
    socket.end();
  });

  socket.on("data", (data) => {
    const req = parseHTTPRequest(data);
    const res = applyCompression(req, getRoute(req));
    socket.write(buildResponse(res));
  });
});

server.on("error", (err) => {
  throw err;
});

server.listen({ port: Number(PORT), host: "localhost" }, () => {
  log(`Server is listening on port ${PORT}`);
});
