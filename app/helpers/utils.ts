import debug from "debug";
import { CONSTANTS, notFoundRoute, routes } from "../constants";
import type { HTTPRequest, HTTPResponse } from "../types";
import {
  EncodingTypeEnum,
  HeadersEnum,
  HTTPMethodEnum,
} from "../constants/enums";

const { CRLF } = CONSTANTS;

export const createLogger = (name: string) => debug(`http:${name}`);

const log = createLogger("utils");

export const parseHTTPRequest = (request: string | Buffer): HTTPRequest => {
  const lines = request.toString().split(CRLF);
  let [methodStr, url, httpVersion] = lines[0].split(" ");
  if (!(methodStr in HTTPMethodEnum)) {
    throw new Error(`Invalid HTTP method: ${methodStr}`);
  }
  const method = HTTPMethodEnum[methodStr as keyof typeof HTTPMethodEnum];
  let path = url.split("/").filter(Boolean);
  if (path.length === 0) {
    path = ["/"];
  }
  const host = lines[1].split(" ")[1];
  const headers: Record<string, string> = {};
  // Headers located between the first two and last two lines
  // [requestLine, host, ...headers, /r/n, body]
  lines.slice(2, -2).forEach((line) => {
    console.log({ line });
    if (line) {
      const [key, val] = line.split(": ");
      headers[key] = val;
    }
  });
  const body = lines[lines.length - 1];

  const parsedReq = {
    method,
    path,
    httpVersion,
    host,
    headers,
    body,
  };
  log("Http Request: ", parsedReq);
  return parsedReq;
};

export const buildResponse = (res: HTTPResponse): string => {
  const { headers, body } = res;
  let response = `${res.httpVersion} ${res.status.code} ${res.status.name}\r\n`;
  Object.keys(headers).forEach((key) => {
    response += `${key}: ${headers[key]}\r\n`;
  });
  response += CRLF;
  response += body;
  return response;
};

export const getRoute = (req: HTTPRequest): HTTPResponse => {
  const routeKey = Object.keys(routes).find((key) => key === req.path[0]);
  if (!routeKey || !routes[routeKey]) {
    return notFoundRoute(req);
  }
  const res = routes[routeKey](req);
  log("HTTP Response: ", res);
  return res;
};

export const applyCompression = (
  req: HTTPRequest,
  res: HTTPResponse,
): HTTPResponse => {
  const encodingHeader = req.headers[HeadersEnum.ACCEPT_ENCODING];
  if (encodingHeader) {
    const encodings = encodingHeader.replaceAll(" ", "").split(",");
    encodings.forEach((encoding) => {
      switch (encoding) {
        case EncodingTypeEnum.GZIP:
          res.body = Bun.gzipSync(res.body).toString();
          res.headers[HeadersEnum.CONTENT_ENCODING] = EncodingTypeEnum.GZIP;
      }
    });
  }
  return res;
};
