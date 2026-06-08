import type { FastifyPluginAsync } from "fastify";
import * as subtaskService from "../services/subtasks.service.js";
import { toSubtaskDto } from "../mappers/subtask.mapper.js";
import { sendServiceResult } from "../utils/api-errors.js";

const subtaskRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/tasks/:taskId/subtasks",
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
        await subtaskService.listSubtasks(taskId, request.user.id),
        "task_not_found",
      );
      if (!rows) return;
      return rows.map(toSubtaskDto);
    },
  );

  app.post(
    "/tasks/:taskId/subtasks",
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
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { taskId } = request.params as { taskId: string };
      const { title } = request.body as { title: string };

      const result = sendServiceResult(
        reply,
        await subtaskService.createSubtask(taskId, request.user.id, title),
        "task_not_found",
      );
      if (!result) return;
      return toSubtaskDto(result);
    },
  );

  app.patch(
    "/subtasks/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          minProperties: 1,
          properties: {
            title: { type: "string", minLength: 1 },
            status: { type: "string" },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { title?: string; status?: string };

      const result = sendServiceResult(
        reply,
        await subtaskService.updateSubtask(id, request.user.id, body),
        "subtask_not_found",
      );
      if (!result) return;
      return toSubtaskDto(result);
    },
  );

  app.delete(
    "/subtasks/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const result = sendServiceResult(
        reply,
        await subtaskService.deleteSubtask(id, request.user.id),
        "subtask_not_found",
      );
      if (!result) return;
      return result;
    },
  );
};

export default subtaskRoutes;
