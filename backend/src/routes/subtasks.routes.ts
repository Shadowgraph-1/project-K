import type { FastifyPluginAsync } from "fastify";
import * as subtaskService from "../services/subtasks.service.js";
import { toSubtaskDto } from "../mappers/subtask.mapper.js";
import {
  subtaskCreateSchema,
  subtaskIdParamSchema,
  subtaskPatchSchema,
  taskIdParamSchema,
} from "../schemas/subtask.schema.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  jsonObject,
  subtaskDto,
  subtaskListResponse,
} from "../openapi/responses.js";

const subtaskRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { taskId: string } }>(
    "/tasks/:taskId/subtasks",
    {
      schema: routeSchema({
        tags: ["Подзадачи"],
        summary: "Список подзадач",
        description: "Все подзадачи указанной задачи.",
        security: true,
        params: taskIdParamSchema,
        response: { 200: subtaskListResponse, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { taskId } = parseBody(taskIdParamSchema, request.params);
      const rows = await subtaskService.listSubtasks(taskId, request.user.id);
      return rows.map(toSubtaskDto);
    },
  );

  app.post<{ Params: { taskId: string } }>(
    "/tasks/:taskId/subtasks",
    {
      schema: routeSchema({
        tags: ["Подзадачи"],
        summary: "Создать подзадачу",
        description: "Добавляет шаг декомпозиции. Статус по умолчанию — `IN_PROGRESS`.",
        security: true,
        params: taskIdParamSchema,
        body: subtaskCreateSchema,
        response: { 200: subtaskDto, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { taskId } = parseBody(taskIdParamSchema, request.params);
      const { title } = parseBody(subtaskCreateSchema, request.body);
      const result = await subtaskService.createSubtask(
        taskId,
        request.user.id,
        title,
      );
      return toSubtaskDto(result);
    },
  );

  app.patch<{ Params: { id: string } }>(
    "/subtasks/:id",
    {
      schema: routeSchema({
        tags: ["Подзадачи"],
        summary: "Обновить подзадачу",
        description: "Изменить название или статус подзадачи.",
        security: true,
        params: subtaskIdParamSchema,
        body: subtaskPatchSchema,
        response: { 200: subtaskDto, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(subtaskIdParamSchema, request.params);
      const body = parseBody(subtaskPatchSchema, request.body);
      const result = await subtaskService.updateSubtask(
        id,
        request.user.id,
        body,
      );
      return toSubtaskDto(result);
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/subtasks/:id",
    {
      schema: routeSchema({
        tags: ["Подзадачи"],
        summary: "Удалить подзадачу",
        security: true,
        params: subtaskIdParamSchema,
        response: { 200: jsonObject, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(subtaskIdParamSchema, request.params);
      return subtaskService.deleteSubtask(id, request.user.id);
    },
  );
};

export default subtaskRoutes;
