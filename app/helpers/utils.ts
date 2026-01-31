import debug from "debug";

export const createLogger = (name: string) => debug(`http:${name}`);
