import type { StatusCodeType } from "../types";
export { HTTPMethodEnum, HeadersEnum, EncodingTypeEnum } from "./enums";
export { routes, notFoundRoute } from "./routes";

export const CONSTANTS = {
  CRLF: "\r\n",
};

export const StatusCode: Record<string, StatusCodeType> = {
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
