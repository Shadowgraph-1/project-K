import type { FastifyPluginAsync } from "fastify";
import { isAdminUser } from "../utils/admin-access.js";
import { routeSchema } from "../openapi/route-schema.js";
import { adminAccessResponse } from "../openapi/responses.js";

const adminAccessRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/admin/access",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Проверка прав админа",
        description:
          "Возвращает `{ isAdmin: true/false }` для текущего JWT.\n\n" +
          "Админы задаются через env `ADMIN_EMAILS` или `ADMIN_USER_IDS`.",
        security: true,
        response: { 200: adminAccessResponse },
      }),
    },
    async (request) => {
      return { isAdmin: await isAdminUser(request.user) };
    },
  );
};

export default adminAccessRoutes;
