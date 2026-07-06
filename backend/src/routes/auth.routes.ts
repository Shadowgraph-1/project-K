import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../db/prisma.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";
import { parseBody } from "../utils/parse-body.js";
import {
  clearRefreshCookie,
  hashRefreshToken,
  issueAuthSession,
  rotateRefreshSession,
} from "../utils/auth-token.js";
import { routeSchema } from "../openapi/route-schema.js";
import { authTokenResponse, errorResponse } from "../openapi/responses.js";
import { ApiHttpError } from "../utils/api-errors.js";

const authRateLimit = {
  max: 10,
  timeWindow: "1 minute",
};

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/auth/register",
    {
      schema: routeSchema({
        tags: ["Авторизация"],
        summary: "Регистрация",
        description:
          "Создаёт новый аккаунт. **JWT не требуется.**\n\n" +
          "В ответе — `token` и объект `user`. Скопируйте token для кнопки **Authorize**.\n\n" +
          "**409** — e-mail уже занят.",
        body: registerSchema,
        response: {
          200: authTokenResponse,
          400: errorResponse,
          409: errorResponse,
        },
      }),
      config: { rateLimit: authRateLimit },
    },
    async (request, reply) => {
      const { name, email, password } = parseBody(registerSchema, request.body);
      const user = await authService.registerUser(name, email, password);
      const { accessToken, user: safeUser } = await issueAuthSession(
        app,
        reply,
        user,
      );
      return { token: accessToken, user: safeUser };
    },
  );

  app.post(
    "/auth/login",
    {
      schema: routeSchema({
        tags: ["Авторизация"],
        summary: "Вход",
        description:
          "Вход по e-mail и паролю. **JWT не требуется.**\n\n" +
          "**401** — неверные учётные данные.",
        body: loginSchema,
        response: {
          200: authTokenResponse,
          401: errorResponse,
        },
      }),
      config: { rateLimit: authRateLimit },
    },
    async (request, reply) => {
      const { email, password } = parseBody(loginSchema, request.body);
      const user = await authService.loginUser(email, password);
      const { accessToken, user: safeUser } = await issueAuthSession(
        app,
        reply,
        user,
      );
      return { token: accessToken, user: safeUser };
    },
  );

  app.post(
    "/auth/refresh",
    {
      schema: routeSchema({
        tags: ["Авторизация"],
        summary: "Обновить access token",
        description:
          "Обновляет короткий access token по refresh cookie. **JWT не требуется.**",
        response: {
          200: authTokenResponse,
          401: errorResponse,
        },
      }),
      config: { rateLimit: authRateLimit },
    },
    async (request, reply) => {
      const plain = request.cookies.refresh_token;
      if (!plain) throw new ApiHttpError("unauthorized");

      const row = await prisma.refresh_tokens.findFirst({
        where: {
          token_hash: hashRefreshToken(plain),
          expires_at: { gt: new Date() },
        },
        include: {
          user: { select: { id: true, email: true } },
        },
      });

      if (!row) {
        clearRefreshCookie(reply);
        throw new ApiHttpError("unauthorized");
      }

      const { accessToken } = await rotateRefreshSession(
        app,
        reply,
        row.user,
        row.id,
      );

      return { token: accessToken };
    },
  );

  app.post(
    "/auth/logout",
    {
      preHandler: [app.authenticate],
      schema: routeSchema({
        tags: ["Авторизация"],
        summary: "Выход",
        security: true,
        response: {
          200: {
            type: "object",
            properties: { ok: { type: "boolean" } },
          },
          401: errorResponse,
        },
      }),
    },
    async (request, reply) => {
      const plain = request.cookies.refresh_token;

      if (plain) {
        await prisma.refresh_tokens.deleteMany({
          where: { token_hash: hashRefreshToken(plain) },
        });
      }

      clearRefreshCookie(reply);
      return { ok: true };
    },
  );
};

export default authRoutes;