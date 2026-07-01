import type { FastifyPluginAsync } from "fastify";
import { deleteAccountSchema } from "../schemas/user.schema.js";
import { deleteAccount } from "../services/user.service.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import { errorResponse, noContentResponse } from "../openapi/responses.js";

const usersRoutes: FastifyPluginAsync = async (app) => {
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
