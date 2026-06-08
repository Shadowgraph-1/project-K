import type { FastifyPluginAsync } from "fastify";
import { toTaskDto } from "../mappers/task.mapper.js";
import { taskCreateSchema, taskPatchSchema } from "../schemas/task.schema.js";
import * as tasksService from "../services/tasks.service.js";
import { sendServiceResult } from "../utils/api-errors.js";
import { parseBody } from "../utils/parse-body.js";

const taskRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/tasks",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["workspaceId"],
          properties: {
            workspaceId: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { workspaceId } = request.query as { workspaceId: string };
      const rows = sendServiceResult(
        reply,
        await tasksService.listTasksByWorkspace(workspaceId, request.user.id),
        "workspace_not_found",
      );
      if (!rows) return;
      return rows.map(toTaskDto);
    },
  );

  app.post("/tasks", async (request, reply) => {
    const body = parseBody(taskCreateSchema, request.body);

    const result = sendServiceResult(
      reply,
      await tasksService.createTask(request.user.id, body),
      "workspace_not_found",
    );
    if (!result) return;
    return toTaskDto(result);
  });

  app.delete(
    "/tasks/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const result = sendServiceResult(
        reply,
        await tasksService.deleteTask(id, request.user.id),
        "task_not_found",
      );
      if (!result) return;
      return result;
    },
  );

  app.delete(
    "/tasks",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["workspaceId"],
          properties: {
            workspaceId: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { workspaceId } = request.query as { workspaceId: string };
      const result = sendServiceResult(
        reply,
        await tasksService.deleteAllTasksInWorkspace(
          workspaceId,
          request.user.id,
        ),
        "workspace_not_found",
      );
      if (!result) return;
      return result;
    },
  );

  app.patch(
    "/tasks/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = parseBody(taskPatchSchema, request.body);

      const result = sendServiceResult(
        reply,
        await tasksService.updateTask(id, request.user.id, body),
        "task_not_found",
      );
      if (!result) return;
      return toTaskDto(result);
    },
  );
};

export default taskRoutes;
