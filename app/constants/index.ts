import fs from "fs";
import type { HTTPRequest, RouteHandler, StatusCodeType } from "../types";
import path from "path";
import { filesDirectory } from "../main";

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
  files: (req: HTTPRequest) => {
    const filePath = path.join(filesDirectory, req.path[1]);
    let status = StatusCode.OK;
    let body = "";
    let file = null;
    const headers: Record<string, string> = {
      "Content-Type": "application/octet-stream",
    };
    if (!fs.existsSync(filePath)) {
      status = StatusCode.NOT_FOUND;
    } else {
      file = fs.readFileSync(path.join(filesDirectory, req.path[1]));
      body = file.toString();
      headers["Content-Length"] = file.length.toString();
    }

    return {
      method: req.method,
      httpVersion: req.httpVersion,
      status,
      headers,
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
