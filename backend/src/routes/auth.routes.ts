import type { FastifyPluginAsync } from "fastify";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";
import { parseBody } from "../utils/parse-body.js";
import { signUserToken } from "../utils/auth-token.js";
import { routeSchema } from "../openapi/route-schema.js";
import { authTokenResponse, errorResponse } from "../openapi/responses.js";

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
    async (request) => {
      const { name, email, password } = parseBody(registerSchema, request.body);
      const user = await authService.registerUser(name, email, password);
      return { token: signUserToken(app, user), user };
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
    async (request) => {
      const { email, password } = parseBody(loginSchema, request.body);
      const user = await authService.loginUser(email, password);
      return { token: signUserToken(app, user), user };
    },
  );
};

export default authRoutes;
