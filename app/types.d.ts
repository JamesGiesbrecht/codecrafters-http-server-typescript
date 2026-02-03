import type { HTTPMethodEnum } from "./constants/enums";

export type StatusCodeType = {
  code: number;
  name: string;
};

export type HTTPRequest = {
  method: HTTPMethodEnum;
  path: string[];
  httpVersion: string;
  host: string;
  headers: { [key: string]: string };
  body: string;
};

export type HTTPResponse = {
  method: HTTPMethodEnum;
  httpVersion: string;
  status: StatusCodeType;
  headers: { [key: string]: string };
  body: string;
};

export type RouteHandler = (request: HTTPRequest) => HTTPResponse;
