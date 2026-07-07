import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { TASK_PRIORITIES } from "../constants/task-priorities.js";
import { formatToolError } from "../errors.js";
import type { KonoApiClient } from "../kono-api.js";
import { toolText } from "../result.js";

const taskStatusSchema = z.enum(["TODO", "DONE", "DEFERRED", "ISSUES"]);
const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export function registerTaskTools(server: McpServer, api: KonoApiClient) {
  server.registerTool(
    "create_task",
    {
      title: "Создать задачу",
      description:
        "Создаёт задачу в указанном проекте. Используй когда просят «создай задачу», «добавь таск», «сделай todo». Сначала вызови list_projects, если workspaceId неизвестен.",
      inputSchema: {
        workspaceId: z.string().uuid().describe("UUID проекта"),
        title: z.string().min(1).max(200).describe("Название задачи"),
        creator: z
          .string()
          .max(100)
          .optional()
          .describe("Исполнитель (опционально)"),
      },
    },
    async ({ workspaceId, title, creator }) => {
      try {
        const task = await api.createTask({ workspaceId, title, creator });

        return toolText(
          [
            "Задача создана!",
            `ID: ${task.id}`,
            `Название: ${task.title}`,
            `Статус: ${task.status}`,
            `Проект: ${task.workspaceId}`,
          ].join("\n"),
        );
      } catch (error) {
        return toolText(
          `Ошибка создания задачи: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "list_tasks",
    {
      title: "Список задач",
      description:
        "Показывает задачи в конкретном проекте. Можно отфильтровать по статусу: TODO, DONE, DEFERRED, ISSUES.",
      inputSchema: {
        workspaceId: z.string().uuid().describe("UUID проекта"),
        status: taskStatusSchema
          .optional()
          .describe("Фильтр: TODO | DONE | DEFERRED | ISSUES"),
      },
    },
    async ({ workspaceId, status }) => {
      try {
        const tasks = await api.listTasks(workspaceId, status);

        if (tasks.length === 0) {
          return toolText("В проекте нет задач.");
        }

        const list = tasks
          .map((task) => {
            const meta = [
              task.status,
              task.tags ? `приоритет: ${task.tags}` : null,
              task.dueDate ? `дедлайн: ${task.dueDate}` : null,
            ]
              .filter(Boolean)
              .join(", ");

            return `- ${task.title} (${meta}) — ID: ${task.id}`;
          })
          .join("\n");

        return toolText(`Задачи в проекте:\n${list}`);
      } catch (error) {
        return toolText(`Ошибка списка задач: ${formatToolError(error)}`, true);
      }
    },
  );

  server.registerTool(
    "update_task",
    {
      title: "Обновить задачу",
      description:
        "Частично обновляет задачу: название, описание, статус, приоритет, даты, исполнитель. Передай хотя бы одно поле. Для «отметь выполненной» передай status: DONE.",
      inputSchema: {
        taskId: z.string().uuid().describe("UUID задачи"),
        title: z.string().min(1).max(200).optional().describe("Новое название"),
        description: z.string().optional().describe("Описание задачи"),
        status: taskStatusSchema
          .optional()
          .describe("TODO | DONE | DEFERRED | ISSUES"),
        tags: z
          .union([taskPrioritySchema, z.literal("")])
          .optional()
          .describe(
            "Приоритет: Срочный, Высокий, Средний, Низкий; пустая строка — сброс",
          ),
        startDate: z
          .string()
          .datetime({ offset: true })
          .optional()
          .describe("Дата начала ISO 8601"),
        dueDate: z
          .union([
            z.string().datetime({ offset: true }),
            z.literal(""),
          ])
          .optional()
          .describe("Дедлайн ISO 8601; пустая строка — сброс"),
        creator: z.string().max(100).optional().describe("Исполнитель"),
      },
    },
    async (args) => {
      try {
        const { taskId, ...patch } = args;
        const hasField = Object.values(patch).some(
          (value) => value !== undefined,
        );
        if (!hasField) {
          return toolText("Укажи хотя бы одно поле для обновления.", true);
        }

        const task = await api.updateTask(taskId, patch);

        return toolText(
          [
            "Задача обновлена!",
            `ID: ${task.id}`,
            `Название: ${task.title}`,
            `Статус: ${task.status}`,
            task.tags ? `Приоритет: ${task.tags}` : null,
            task.dueDate ? `Дедлайн: ${task.dueDate}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        );
      } catch (error) {
        return toolText(
          `Ошибка обновления задачи: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "delete_task",
    {
      title: "Удалить задачу",
      description:
        "Удаляет задачу по ID вместе с подзадачами и activity. Необратимая операция — используй только по явной просьбе пользователя.",
      annotations: {
        destructiveHint: true,
      },
      inputSchema: {
        taskId: z.string().uuid().describe("UUID задачи для удаления"),
      },
    },
    async ({ taskId }) => {
      try {
        await api.deleteTask(taskId);
        return toolText(`Задача ${taskId} удалена.`);
      } catch (error) {
        return toolText(
          `Ошибка удаления задачи: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "search_kono",
    {
      title: "Поиск в Kono",
      description:
        "Поиск проектов и задач по названию. Полезно, когда нужно найти taskId или workspaceId по имени.",
      inputSchema: {
        query: z.string().min(2).describe("Строка поиска, минимум 2 символа"),
        limit: z.number().int().min(1).max(50).default(20).optional(),
      },
    },
    async ({ query, limit }) => {
      try {
        const results = await api.search(query, limit ?? 20);
        return toolText(JSON.stringify(results, null, 2));
      } catch (error) {
        return toolText(`Ошибка поиска: ${formatToolError(error)}`, true);
      }
    },
  );
}