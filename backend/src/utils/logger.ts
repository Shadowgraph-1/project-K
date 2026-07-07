import pino from "pino";
import type { FastifyServerOptions } from "fastify";
import { env } from "../config/env.js";

const targets: pino.TransportTargetOptions[] = [
  {
    target: "pino/file",
    options: { destination: "./logs/app.log", mkdir: true },
  },
];

if (env.NODE_ENV !== "production") {
  targets.push({
    target: "pino-pretty",
    options: { destination: 1 },
  });
}

export const loggerOptions: FastifyServerOptions["logger"] = {
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport: { targets },
};

export const logger = pino(loggerOptions);

export function createModuleLogger(name: string) {
  return logger.child({ module: name });
}