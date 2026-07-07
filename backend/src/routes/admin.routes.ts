import type { FastifyPluginAsync } from "fastify";
import { isAdminUser } from "../utils/admin-access.js";
import { replyApiError } from "../utils/api-errors.js";
import {
  adminErrorLogsQuerySchema,
  adminUserIdParamSchema,
  adminUsersQuerySchema,
  featureFlagKeyParamSchema,
  updateFeatureFlagSchema,
} from "../schemas/admin.schema.js";
import * as adminService from "../services/admin.service.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  adminOverviewResponse,
  adminUsersResponse,
  errorResponse,
  jsonArray,
  jsonObject,
  noContentResponse,
} from "../openapi/responses.js";

const adminRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    if (!(await isAdminUser(request.user))) {
      return replyApiError(reply, "forbidden");
    }
  });

  app.get(
    "/admin/overview",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Сводка",
        description:
          "Статистика платформы (пользователи, проекты, задачи) и текущий health БД/AI.\n\n" +
          "Только для администраторов → иначе **403**.",
        security: true,
        response: { 200: adminOverviewResponse, 403: errorResponse },
      }),
    },
    async () => {
      return adminService.getAdminOverview();
    },
  );

  app.get(
    "/admin/users",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Пользователи",
        description: "Пагинированный список всех пользователей с счётчиками проектов.",
        security: true,
        querystring: adminUsersQuerySchema,
        response: { 200: adminUsersResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      const query = parseBody(adminUsersQuerySchema, request.query);
      return adminService.listAdminUsers(query.limit, query.offset);
    },
  );

  app.delete<{ Params: { userId: string } }>(
    "/admin/users/:userId",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Удалить пользователя",
        description:
          "Безвозвратно удаляет пользователя и его проекты (каскад).\n\n" +
          "Нельзя удалить себя или другого администратора.",
        security: true,
        params: adminUserIdParamSchema,
        response: {
          200: jsonObject,
          400: errorResponse,
          403: errorResponse,
          404: errorResponse,
        },
      }),
    },
    async (request) => {
      const { userId } = parseBody(adminUserIdParamSchema, request.params);
      return adminService.deleteAdminUser(request.user.id, userId);
    },
  );

  app.get(
    "/admin/error-logs",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Журнал ошибок",
        description: "Последние ошибки API из in-memory журнала (limit до 200).",
        security: true,
        querystring: adminErrorLogsQuerySchema,
        response: { 200: jsonArray, 403: errorResponse },
      }),
    },
    async (request) => {
      const query = parseBody(adminErrorLogsQuerySchema, request.query);
      return adminService.getAdminErrorLogs(query.limit);
    },
  );

  app.delete(
    "/admin/error-logs",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Очистить журнал ошибок",
        security: true,
        response: {
          204: noContentResponse,
          403: errorResponse,
        },
      }),
    },
    async (_request, reply) => {
      adminService.clearAdminErrorLogs();
      return reply.status(204).send();
    },
  );

  app.get(
    "/admin/feature-flags",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Feature flags",
        description:
          "Список переключателей: assistant_enabled, registration_open, workspace_creation, llm_user_keys.",
        security: true,
        response: { 200: jsonArray, 403: errorResponse },
      }),
    },
    async () => {
      return adminService.getAdminFeatureFlags();
    },
  );

  app.patch(
    "/admin/feature-flags/:key",
    {
      schema: routeSchema({
        tags: ["Администрирование"],
        summary: "Изменить feature flag",
        description: "Включает или выключает функцию платформы по ключу.",
        security: true,
        params: featureFlagKeyParamSchema,
        body: updateFeatureFlagSchema,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      const { key } = parseBody(featureFlagKeyParamSchema, request.params);
      const { enabled } = parseBody(updateFeatureFlagSchema, request.body);
      return await adminService.updateAdminFeatureFlag(key, enabled);
    },
  );
};

export default adminRoutes;
