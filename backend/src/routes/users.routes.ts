import type { FastifyPluginAsync } from "fastify";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "../schemas/user.schema.js";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../services/user.service.js";
import { parseBody } from "../utils/parse-body.js";
import { signUserToken } from "../utils/auth-token.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  noContentResponse,
  userResponse,
} from "../openapi/responses.js";

const usersRoutes: FastifyPluginAsync = async (app) => {
  app.patch(
    "/users/me",
    {
      schema: routeSchema({
        tags: ["Пользователь"],
        summary: "Обновить профиль",
        description:
          "Обновляет имя и email текущего пользователя.\n\n" +
          "**409** — email уже занят.\n\n" +
          "Если email изменился — в ответе будет новый `token`.",
        security: true,
        body: updateProfileSchema,
        response: {
          200: userResponse,
          401: errorResponse,
          409: errorResponse,
        },
      }),
    },
    async (request) => {
      const { name, email } = parseBody(updateProfileSchema, request.body);
      const { user, emailChanged } = await updateProfile(
        request.user.id,
        name,
        email,
      );

      if (emailChanged) {
        return { user, token: signUserToken(app, user) };
      }

      return { user };
    },
  );

  app.patch(
    "/users/me/password",
    {
      schema: routeSchema({
        tags: ["Пользователь"],
        summary: "Сменить пароль",
        description:
          "Меняет пароль текущего пользователя. Требуется текущий пароль.\n\n" +
          "Ответ **204** без тела.",
        security: true,
        body: changePasswordSchema,
        response: {
          204: noContentResponse,
          401: errorResponse,
        },
      }),
    },
    async (request, reply) => {
      const { currentPassword, newPassword } = parseBody(
        changePasswordSchema,
        request.body,
      );
      await changePassword(request.user.id, currentPassword, newPassword);
      return reply.status(204).send();
    },
  );

  app.delete(
    "/users/me",
    {
      schema: routeSchema({
        tags: ["Пользователь"],
        summary: "Удалить аккаунт",
        description:
          "Безвозвратно удаляет текущий аккаунт. Требуется подтверждение паролем.\n\n" +
          "Ответ **204** без тела.",
        security: true,
        body: deleteAccountSchema,
        response: {
          204: noContentResponse,
          401: errorResponse,
        },
      }),
    },
    async (request, reply) => {
      const { password } = parseBody(deleteAccountSchema, request.body);
      await deleteAccount(request.user.id, password);
      return reply.status(204).send();
    },
  );
};

export default usersRoutes;