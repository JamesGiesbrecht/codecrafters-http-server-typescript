import fs from "fs";
import type { HTTPRequest, RouteHandler, StatusCodeType } from "../types";
import path from "path";
import { HeadersEnum, HTTPMethodEnum } from "./enums";
import { getFilesDir } from "../helpers/utils";

export const CONSTANTS = {
  CRLF: "\r\n",
};

export const StatusCode: { [key: string]: StatusCodeType } = {
  OK: {
    code: 200,
    name: "OK",
  },
  CREATED: {
    code: 201,
    name: "Created",
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
        [HeadersEnum.CONTENT_TYPE]: "text/plain",
        [HeadersEnum.CONTENT_LENGTH]: body.length.toString(),
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
        [HeadersEnum.CONTENT_TYPE]: "text/plain",
        [HeadersEnum.CONTENT_LENGTH]: body.length.toString(),
      },
      body,
    };
  },
  files: (req: HTTPRequest) => {
    const filesDir = getFilesDir();
    const filePath = path.join(filesDir, req.path[1]);
    let status = StatusCode.OK;
    let body = "";
    const headers: Record<string, string> = {};
    switch (req.method) {
      case HTTPMethodEnum.GET:
        if (!fs.existsSync(filePath)) {
          status = StatusCode.NOT_FOUND;
        } else {
          const file = fs.readFileSync(path.join(filesDir, req.path[1]));
          body = file.toString();
          headers[HeadersEnum.CONTENT_TYPE] = "application/octet-stream";
          headers[HeadersEnum.CONTENT_LENGTH] = file.length.toString();
        }
        break;
      case HTTPMethodEnum.POST:
        fs.writeFileSync(filePath, req.body);
        status = StatusCode.CREATED;
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
