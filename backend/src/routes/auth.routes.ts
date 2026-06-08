import type { FastifyPluginAsync } from "fastify";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";
import { parseBody } from "../utils/parse-body.js";
import { sendApiErrorResult } from "../utils/api-errors.js";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/auth/register", async (request, reply) => {
    const { name, email, password } = parseBody(registerSchema, request.body);

    const user = sendApiErrorResult(
      reply,
      await authService.registerUser(name, email, password),
    );
    if (!user) return;

    const token = app.jwt.sign({
      id: user.id,
      email: user.email,
    });

    return { token, user };
  });

  app.post("/auth/login", async (request, reply) => {
    const { email, password } = parseBody(loginSchema, request.body);

    const user = sendApiErrorResult(
      reply,
      await authService.loginUser(email, password),
    );
    if (!user) return;

    const token = app.jwt.sign({
      id: user.id,
      email: user.email,
    });

    return { token, user };
  });
};

export default authRoutes;
