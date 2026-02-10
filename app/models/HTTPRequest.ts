import zlib from "node:zlib";
import {
  EncodingTypeEnum,
  HeadersEnum,
  HTTPMethodEnum,
} from "../constants/enums";
import { CONSTANTS, notFoundRoute, routes } from "../constants";
import type { HTTPResponse } from "./HTTPResponse";
import { createLogger } from "../helpers/utils";

const log = createLogger("HTTPRequest");

export class HTTPRequest {
  method: HTTPMethodEnum;
  path: string[] = [];
  httpVersion: string = "HTTP/1.1";
  host: string;
  headers: Record<string, string> = {};
  body: string | Buffer = "";

  constructor(request: string | Buffer) {
    const lines = request.toString().split(CONSTANTS.CRLF);
    let [methodStr, url, httpVersion] = lines[0].split(" ");
    if (!(methodStr in HTTPMethodEnum)) {
      throw new Error(`Invalid HTTP method: ${methodStr}`);
    }
    this.method = HTTPMethodEnum[methodStr as keyof typeof HTTPMethodEnum];
    let path = url.split("/").filter(Boolean);
    if (path.length === 0) {
      path = ["/"];
    }
    this.path = path;
    this.httpVersion = httpVersion;
    this.host = lines[1].split(" ")[1];
    // Headers located between the first two and last two lines
    // [requestLine, host, ...headers, /r/n, body]
    lines.slice(2, -2).forEach((line) => {
      if (line) {
        const [key, val] = line.split(": ");
        this.headers[key] = val;
      }
    });
    this.body = lines[lines.length - 1];
  }

  public generateResponse(): HTTPResponse {
    const routeKey = Object.keys(routes).find((key) => key === this.path[0]);
    if (!routeKey || !routes[routeKey]) {
      return notFoundRoute(this);
    }
    const res = routes[routeKey](this);
    if (this.headers[HeadersEnum.CONNECTION] === "close") {
      res.withHeader(HeadersEnum.CONNECTION, "close");
    }

    log(this.toString());
    // Apply compression
    const encodingHeader = this.headers[HeadersEnum.ACCEPT_ENCODING];
    if (encodingHeader) {
      const encodings = encodingHeader?.replaceAll(" ", "")?.split(",");
      encodings.forEach((encoding) => {
        switch (encoding) {
          case EncodingTypeEnum.GZIP:
            const encodedData = zlib.gzipSync(res.body);
            res.body = encodedData;
            res.withHeader(HeadersEnum.CONTENT_ENCODING, EncodingTypeEnum.GZIP);
            res.withHeader(
              HeadersEnum.CONTENT_LENGTH,
              encodedData.length.toString(),
            );
        }
      });
    }
    return res;
  }

  toString() {
    return `Method: ${this.method}\nPath: ${this.path}\nHTTP Version: ${this.httpVersion}\nHost: ${this.host}\nHeaders: ${this.headers}\nBody: ${this.body}`;
  }
}
