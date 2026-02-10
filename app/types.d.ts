import type { HTTPMethodEnum } from "./constants/enums";
import type { HTTPRequest, HTTPResponse } from "./models";

export type StatusCodeType = {
  code: number;
  name: string;
};

export type RouteHandler = (request: HTTPRequest) => HTTPResponse;
