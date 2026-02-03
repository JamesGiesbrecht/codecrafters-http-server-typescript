import debug from "debug";
import { CONSTANTS, notFoundRoute, routes } from "../constants";
import type { HTTPRequest, HTTPResponse } from "../types";
import { HTTPMethodEnum } from "../constants/enums";

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
  lines.slice(2).forEach((line) => {
    if (line) {
      const [key, val] = line.split(": ");
      headers[key] = val;
    }
  });
  const body = "";

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
