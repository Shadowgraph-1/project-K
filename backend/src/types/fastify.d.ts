import "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string; type?: "access" };
    user: { id: number; email: string; type?: "access" };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    jwt: import("@fastify/jwt").JWT;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
