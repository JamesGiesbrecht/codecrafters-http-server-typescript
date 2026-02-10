import fs from "fs";
import path from "path";
import type { RouteHandler } from "../types";
import { HTTPResponse, type HTTPRequest } from "../models";
import { HeadersEnum, HTTPMethodEnum } from "./enums";
import { getFilesDir } from "../helpers/utils";
import { StatusCode } from ".";

export const routes: Record<string, RouteHandler> = {
  "/": (req: HTTPRequest) => {
    return new HTTPResponse(req.method, req.httpVersion, StatusCode.OK);
  },
  echo: (req: HTTPRequest) => {
    const body = req.path[1];
    const res = new HTTPResponse(
      req.method,
      req.httpVersion,
      StatusCode.OK,
      body,
    );
    res.withHeader(HeadersEnum.CONTENT_TYPE, "text/plain");
    res.withHeader(HeadersEnum.CONTENT_LENGTH, body.length.toString());
    return res;
  },
  "user-agent": (req: HTTPRequest) => {
    const body =
      req.headers[
        Object.keys(req.headers).find(
          (key) => key.toLowerCase() === "user-agent",
        ) || ""
      ];

    const res = new HTTPResponse(
      req.method,
      req.httpVersion,
      StatusCode.OK,
      body,
    );
    res.withHeader(HeadersEnum.CONTENT_TYPE, "text/plain");
    res.withHeader(HeadersEnum.CONTENT_LENGTH, body.length.toString());
    return res;
  },
  files: (req: HTTPRequest) => {
    const filesDir = getFilesDir();
    const filePath = path.join(filesDir, req.path[1]);
    const res = new HTTPResponse(req.method, req.httpVersion, StatusCode.OK);
    switch (req.method) {
      case HTTPMethodEnum.GET:
        if (!fs.existsSync(filePath)) {
          res.status = StatusCode.NOT_FOUND;
        } else {
          const file = fs.readFileSync(path.join(filesDir, req.path[1]));
          res.body = file.toString();
          res.withHeader(HeadersEnum.CONTENT_TYPE, "application/octet-stream");
          res.withHeader(HeadersEnum.CONTENT_LENGTH, file.length.toString());
        }
        break;
      case HTTPMethodEnum.POST:
        fs.writeFileSync(filePath, req.body);
        res.status = StatusCode.CREATED;
    }
    return res;
  },
};

export const notFoundRoute: RouteHandler = (req: HTTPRequest) => {
  return new HTTPResponse(req.method, req.httpVersion, StatusCode.NOT_FOUND);
};
