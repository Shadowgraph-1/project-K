import type { FastifyPluginAsync } from "fastify";
import * as taskActivityService from "../services/task-activity.service.js";
import { toActivityDto } from "../mappers/task-activity.mapper.js";
import { sendServiceResult } from "../utils/api-errors.js";

const taskActivityRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/tasks/:taskId/activity",
    {
      schema: {
        params: {
          type: "object",
          required: ["taskId"],
          properties: {
            taskId: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["body"],
          properties: {
            body: { type: "string", minLength: 1 },
            parentActivityId: { type: "string" },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { taskId } = request.params as { taskId: string };
      const payload = request.body as {
        body: string;
        parentActivityId?: string;
      };

      const result = sendServiceResult(
        reply,
        await taskActivityService.createTaskActivity(
          taskId,
          request.user.id,
          payload,
        ),
        "task_not_found",
      );
      if (!result) return;
      return toActivityDto(result);
    },
  );

  app.delete(
    "/tasks/:taskId/activity",
    {
      schema: {
        params: {
          type: "object",
          required: ["taskId"],
          properties: {
            taskId: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { taskId } = request.params as { taskId: string };

      const result = sendServiceResult(
        reply,
        await taskActivityService.clearTaskActivity(taskId, request.user.id),
        "task_not_found",
      );
      if (!result) return;
      return result;
    },
  );

  app.get(
    "/tasks/:taskId/activity",
    {
      schema: {
        params: {
          type: "object",
          required: ["taskId"],
          properties: {
            taskId: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { taskId } = request.params as { taskId: string };

      const rows = sendServiceResult(
        reply,
        await taskActivityService.listTaskActivity(taskId, request.user.id),
        "task_not_found",
      );
      if (!rows) return;
      return rows.map(toActivityDto);
    },
  );
};

export default taskActivityRoutes;
