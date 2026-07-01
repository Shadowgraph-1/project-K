import type { FastifyPluginAsync } from "fastify";
import { toTaskDto } from "../mappers/task.mapper.js";
import {
  taskCreateSchema,
  taskIdParamSchema,
  taskListQuerySchema,
  taskPatchSchema,
} from "../schemas/task.schema.js";
import * as tasksService from "../services/tasks.service.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  jsonObject,
  taskDto,
  taskListResponse,
} from "../openapi/responses.js";

const taskRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/tasks",
    {
      schema: routeSchema({
        tags: ["Задачи"],
        summary: "Список задач",
        description:
          "Задачи проекта. Обязательный query `workspaceId`.\n\n" +
          "Опционально `status` — фильтр: TODO, DONE, DEFERRED, ISSUES.",
        security: true,
        querystring: taskListQuerySchema,
        response: { 200: taskListResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      const { workspaceId, status } = parseBody(
        taskListQuerySchema,
        request.query,
      );
      const rows = await tasksService.listTasksByWorkspace(
        workspaceId,
        request.user.id,
        status ? { status } : undefined,
      );
      return rows.map(toTaskDto);
    },
  );

  app.post(
    "/tasks",
    {
      schema: routeSchema({
        tags: ["Задачи"],
        summary: "Создать задачу",
        description:
          "Новая задача в указанном проекте. Статус по умолчанию — `TODO`.",
        security: true,
        body: taskCreateSchema,
        response: { 200: taskDto, 403: errorResponse },
      }),
    },
    async (request) => {
      const body = parseBody(taskCreateSchema, request.body);
      const result = await tasksService.createTask(request.user.id, body);
      return toTaskDto(result);
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/tasks/:id",
    {
      schema: routeSchema({
        tags: ["Задачи"],
        summary: "Удалить задачу",
        description: "Удаляет задачу по UUID вместе с подзадачами и activity.",
        security: true,
        params: taskIdParamSchema,
        response: { 200: jsonObject, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(taskIdParamSchema, request.params);
      return tasksService.deleteTask(id, request.user.id);
    },
  );

  app.delete(
    "/tasks",
    {
      schema: routeSchema({
        tags: ["Задачи"],
        summary: "Удалить все задачи проекта",
        description:
          "Массовое удаление всех задач workspace. Query `workspaceId` обязателен.",
        security: true,
        querystring: taskListQuerySchema,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      const { workspaceId } = parseBody(taskListQuerySchema, request.query);
      return tasksService.deleteAllTasksInWorkspace(
        workspaceId,
        request.user.id,
      );
    },
  );

  app.patch<{ Params: { id: string } }>(
    "/tasks/:id",
    {
      schema: routeSchema({
        tags: ["Задачи"],
        summary: "Обновить задачу",
        description:
          "Частичное обновление: заголовок, описание, статус, даты, приоритет (`tags`).\n\n" +
          "Передайте хотя бы одно поле в теле.",
        security: true,
        params: taskIdParamSchema,
        body: taskPatchSchema,
        response: { 200: taskDto, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(taskIdParamSchema, request.params);
      const body = parseBody(taskPatchSchema, request.body);
      const result = await tasksService.updateTask(id, request.user.id, body);
      return toTaskDto(result);
    },
  );
};

export default taskRoutes;
