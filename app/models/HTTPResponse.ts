import { HeadersEnum, type HTTPMethodEnum } from "../constants/enums";
import type { StatusCodeType } from "../types";
import { CONSTANTS, StatusCode } from "../constants";
import { createLogger } from "../helpers/utils";

const log = createLogger("HTTPRequest");

export class HTTPResponse {
  method: HTTPMethodEnum;
  httpVersion: string;
  status: StatusCodeType;
  headers: Record<string, string>;
  body: string | Buffer;

  constructor(
    method: HTTPMethodEnum,
    httpVersion: string = "HTTP/1.1",
    status: StatusCodeType = StatusCode.OK,
    body: string | Buffer = "",
    headers: Record<string, string> = {},
  ) {
    this.method = method;
    this.httpVersion = httpVersion;
    this.status = status;
    this.body = body;
    this.headers = headers;
  }

  withHeader(key: HeadersEnum, value: string): this {
    this.headers[key] = value;
    return this;
  }

  get response(): string {
    let response = `${this.httpVersion} ${this.status.code} ${this.status.name}\r\n`;
    Object.keys(this.headers).forEach((key) => {
      response += `${key}: ${this.headers[key]}\r\n`;
    });
    response += CONSTANTS.CRLF;
    log("Response String: ", response);
    return response;
  }

  get shouldClose(): boolean {
    return this.headers[HeadersEnum.CONNECTION].toLowerCase() === "close";
  }
}
