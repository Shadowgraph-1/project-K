import type { FastifyPluginAsync } from "fastify";
import * as taskActivityService from "../services/task-activity.service.js";
import { toActivityDto } from "../mappers/task-activity.mapper.js";
import {
  taskActivityCreateSchema,
  taskActivityParamSchema,
} from "../schemas/task-activity.schema.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  activityDto,
  activityListResponse,
  errorResponse,
  jsonObject,
} from "../openapi/responses.js";

const taskActivityRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { taskId: string } }>(
    "/tasks/:taskId/activity",
    {
      schema: routeSchema({
        tags: ["Комментарии и activity"],
        summary: "Лента activity",
        description:
          "Комментарии пользователей и системные события задачи.\n\n" +
          "Для ответа в ветке при создании передайте `parentActivityId`.",
        security: true,
        params: taskActivityParamSchema,
        response: { 200: activityListResponse, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { taskId } = parseBody(taskActivityParamSchema, request.params);
      const rows = await taskActivityService.listTaskActivity(
        taskId,
        request.user.id,
      );
      return rows.map(toActivityDto);
    },
  );

  app.post<{ Params: { taskId: string } }>(
    "/tasks/:taskId/activity",
    {
      schema: routeSchema({
        tags: ["Комментарии и activity"],
        summary: "Добавить комментарий",
        description:
          "Новый комментарий в ленте задачи.\n\n" +
          "Опционально `parentActivityId` — ответ на существующую запись.",
        security: true,
        params: taskActivityParamSchema,
        body: taskActivityCreateSchema,
        response: { 200: activityDto, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { taskId } = parseBody(taskActivityParamSchema, request.params);
      const payload = parseBody(taskActivityCreateSchema, request.body);
      const result = await taskActivityService.createTaskActivity(
        taskId,
        request.user.id,
        payload,
      );
      return toActivityDto(result);
    },
  );

  app.delete<{ Params: { taskId: string } }>(
    "/tasks/:taskId/activity",
    {
      schema: routeSchema({
        tags: ["Комментарии и activity"],
        summary: "Очистить ленту",
        description: "Удаляет всю activity задачи (комментарии и события).",
        security: true,
        params: taskActivityParamSchema,
        response: { 200: jsonObject, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { taskId } = parseBody(taskActivityParamSchema, request.params);
      return taskActivityService.clearTaskActivity(taskId, request.user.id);
    },
  );
};

export default taskActivityRoutes;
