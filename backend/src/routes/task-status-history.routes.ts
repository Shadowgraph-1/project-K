import type { FastifyPluginAsync } from "fastify";
import { toTaskStatusHistoryDto } from "../mappers/task-status-history.mapper.js";
import { taskActivityParamSchema } from "../schemas/task-activity.schema.js";
import * as taskStatusHistoryService from "../services/task-status-history.service.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  taskStatusHistoryListResponse,
} from "../openapi/responses.js";

const taskStatusHistoryRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { taskId: string } }>(
    "/tasks/:taskId/status-history",
    {
      schema: routeSchema({
        tags: ["Задачи"],
        summary: "История статусов задачи",
        description:
          "Хронология смен статуса: from → to с датой и автором изменения.\n\n" +
          "Отсортировано по времени (старые → новые).",
        security: true,
        params: taskActivityParamSchema,
        response: {
          200: taskStatusHistoryListResponse,
          403: errorResponse,
          404: errorResponse,
        },
      }),
    },
    async (request) => {
      const { taskId } = parseBody(taskActivityParamSchema, request.params);
      const rows = await taskStatusHistoryService.listTaskStatusHistory(
        taskId,
        request.user.id,
      );
      return rows.map(toTaskStatusHistoryDto);
    },
  );
};

export default taskStatusHistoryRoutes;
