import type { HTTPRequest, RouteHandler, StatusCodeType } from "../types";

export const CONSTANTS = {
  CRLF: "\r\n",
};

export const StatusCode: { [key: string]: StatusCodeType } = {
  OK: {
    code: 200,
    name: "OK",
  },
  NOT_FOUND: {
    code: 404,
    name: "Not Found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    name: "Internal Server Error",
  },
};

export const routes: { [key: string]: RouteHandler } = {
  "/": (req: HTTPRequest) => {
    return {
      method: req.method,
      httpVersion: req.httpVersion,
      status: StatusCode.OK,
      headers: {},
      body: "",
    };
  },
  echo: (req: HTTPRequest) => {
    const body = req.path[1];
    return {
      method: req.method,
      httpVersion: req.httpVersion,
      status: StatusCode.OK,
      headers: {
        "Content-Type": "text/plain",
        "Content-Length": body.length.toString(),
      },
      body,
    };
  },
  "user-agent": (req: HTTPRequest) => {
    const body =
      req.headers[
        Object.keys(req.headers).find(
          (key) => key.toLowerCase() === "user-agent",
        ) || ""
      ];

    return {
      method: req.method,
      httpVersion: req.httpVersion,
      status: StatusCode.OK,
      headers: {
        "Content-Type": "text/plain",
        "Content-Length": body.length.toString(),
      },
      body,
    };
  },
};

export const notFoundRoute: RouteHandler = (req: HTTPRequest) => {
  return {
    method: req.method,
    httpVersion: req.httpVersion,
    status: StatusCode.NOT_FOUND,
    headers: {},
    body: "",
  };
};
