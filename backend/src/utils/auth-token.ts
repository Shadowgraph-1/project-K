import type { FastifyInstance } from "fastify";

export function signUserToken(
  app: FastifyInstance,
  user: { id: number; email: string },
) {
  return app.jwt.sign({ id: user.id, email: user.email });
}
