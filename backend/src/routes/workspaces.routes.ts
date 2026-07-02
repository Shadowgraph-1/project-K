import type { FastifyPluginAsync } from "fastify";
import * as workspacesService from "../services/workspaces.service.js";
import { isFeatureEnabled } from "../services/feature-flags.service.js";
import { replyApiError } from "../utils/api-errors.js";
import {
  workspaceCreateSchema,
  workspaceIdParamSchema,
} from "../schemas/workspace.schema.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  jsonObject,
  workspaceDto,
  workspaceListResponse,
} from "../openapi/responses.js";

const workspacesRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/workspaces",
    {
      schema: routeSchema({
        tags: ["Проекты"],
        summary: "Список проектов",
        description:
          "Все проекты текущего пользователя: свои (`kind: owned`) и общие (`kind: shared`).\n\n" +
          "Каждый проект содержит `publicKey` (K-XXXXXX) для URL в клиенте.",
        security: true,
        response: { 200: workspaceListResponse },
      }),
    },
    async (request) => {
      return workspacesService.listWorkspaces(request.user.id);
    },
  );

  app.get<{ Params: { id: string } }>(
    "/workspaces/:id",
    {
      schema: routeSchema({
        tags: ["Проекты"],
        summary: "Проект по ID",
        description:
          "Детали одного проекта по UUID.\n\n" +
          "**403** — нет доступа · **404** — не найден.",
        security: true,
        params: workspaceIdParamSchema,
        response: { 200: workspaceDto, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(workspaceIdParamSchema, request.params);
      return workspacesService.getWorkspace(id, request.user.id);
    },
  );

  app.post(
    "/workspaces",
    {
      schema: routeSchema({
        tags: ["Проекты"],
        summary: "Создать проект",
        description:
          "Создаёт workspace и назначает вас владельцем (OWNER).\n\n" +
          "Может быть отключено feature flag `workspace_creation` → **403**.",
        security: true,
        body: workspaceCreateSchema,
        response: { 200: workspaceDto, 403: errorResponse },
      }),
    },
    async (request, reply) => {
      if (!isFeatureEnabled("workspace_creation")) {
        return replyApiError(reply, "forbidden");
      }

      const { name } = parseBody(workspaceCreateSchema, request.body);
      return workspacesService.createWorkspace(request.user.id, name);
    },
  );

  app.delete(
    "/workspaces",
    {
      schema: routeSchema({
        tags: ["Проекты"],
        summary: "Удалить все мои проекты",
        description: "Удаляет все проекты, где пользователь владелец.",
        security: true,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      return workspacesService.deleteAllOwnedWorkspaces(request.user.id);
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/workspaces/:id",
    {
      schema: routeSchema({
        tags: ["Проекты"],
        summary: "Удалить проект",
        description:
          "Удаляет проект и все связанные задачи (каскад).\n\n" +
          "Только владелец или пользователь с правами на удаление.",
        security: true,
        params: workspaceIdParamSchema,
        response: { 200: jsonObject, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(workspaceIdParamSchema, request.params);
      return workspacesService.deleteWorkspace(id, request.user.id);
    },
  );
};

export default workspacesRoutes;

