import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { formatToolError } from "../errors.js";
import type { KonoApiClient } from "../kono-api.js";
import { toolText } from "../result.js";

const subtaskStatusSchema = z.enum([
  "IN_PROGRESS",
  "DONE",
  "DEFERRED",
  "CANCELLED",
]);

export function registerSubtaskTools(server: McpServer, api: KonoApiClient) {
  server.registerTool(
    "list_subtasks",
    {
      title: "Список подзадач",
      description:
        "Показывает подзадачи (шаги декомпозиции) конкретной задачи. Используй search_kono или list_tasks, если taskId неизвестен.",
      inputSchema: {
        taskId: z.string().uuid().describe("UUID родительской задачи"),
      },
    },
    async ({ taskId }) => {
      try {
        const subtasks = await api.listSubtasks(taskId);

        if (subtasks.length === 0) {
          return toolText("У задачи нет подзадач.");
        }

        const list = subtasks
          .map(
            (subtask) =>
              `- [${subtask.status}] ${subtask.title} — ID: ${subtask.id}`,
          )
          .join("\n");

        return toolText(`Подзадачи:\n${list}`);
      } catch (error) {
        return toolText(
          `Ошибка списка подзадач: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "create_subtask",
    {
      title: "Создать подзадачу",
      description:
        "Добавляет подзадачу к задаче. Используй для декомпозиции: «разбей на шаги», «добавь подзадачу».",
      inputSchema: {
        taskId: z.string().uuid().describe("UUID родительской задачи"),
        title: z.string().min(1).max(200).describe("Название подзадачи"),
      },
    },
    async ({ taskId, title }) => {
      try {
        const subtask = await api.createSubtask(taskId, title);

        return toolText(
          [
            "Подзадача создана!",
            `ID: ${subtask.id}`,
            `Название: ${subtask.title}`,
            `Статус: ${subtask.status}`,
            `Задача: ${subtask.taskId}`,
          ].join("\n"),
        );
      } catch (error) {
        return toolText(
          `Ошибка создания подзадачи: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "update_subtask",
    {
      title: "Обновить подзадачу",
      description:
        "Изменяет название или статус подзадачи. Для «отметь выполненной» передай status: DONE.",
      inputSchema: {
        subtaskId: z.string().uuid().describe("UUID подзадачи"),
        title: z.string().min(1).max(200).optional().describe("Новое название"),
        status: subtaskStatusSchema
          .optional()
          .describe("IN_PROGRESS | DONE | DEFERRED | CANCELLED"),
      },
    },
    async (args) => {
      try {
        const { subtaskId, ...patch } = args;
        const hasField = Object.values(patch).some(
          (value) => value !== undefined,
        );
        if (!hasField) {
          return toolText("Укажи хотя бы одно поле для обновления.", true);
        }

        const subtask = await api.updateSubtask(subtaskId, patch);

        return toolText(
          [
            "Подзадача обновлена!",
            `ID: ${subtask.id}`,
            `Название: ${subtask.title}`,
            `Статус: ${subtask.status}`,
          ].join("\n"),
        );
      } catch (error) {
        return toolText(
          `Ошибка обновления подзадачи: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "delete_subtask",
    {
      title: "Удалить подзадачу",
      description:
        "Удаляет подзадачу по ID. Необратимая операция — только по явной просьбе пользователя.",
      annotations: {
        destructiveHint: true,
      },
      inputSchema: {
        subtaskId: z.string().uuid().describe("UUID подзадачи для удаления"),
      },
    },
    async ({ subtaskId }) => {
      try {
        await api.deleteSubtask(subtaskId);
        return toolText(`Подзадача ${subtaskId} удалена.`);
      } catch (error) {
        return toolText(
          `Ошибка удаления подзадачи: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );
}