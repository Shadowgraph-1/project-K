import type OpenAI from "openai";

import {
  isTaskPriority,
  TASK_PRIORITIES,
} from "../constants/task-priorities.js";
import { TaskStatus } from "../constants/task-statuses.js";
import { SubtaskStatus } from "../constants/subtask-statuses.js";
import * as searchService from "../services/search.service.js";
import * as subtasksService from "../services/subtasks.service.js";
import * as taskActivityService from "../services/task-activity.service.js";
import * as tasksService from "../services/tasks.service.js";
import * as workspacesService from "../services/workspaces.service.js";
import { ApiHttpError } from "../utils/api-errors.js";
import { isFeatureEnabled } from "../services/feature-flags.service.js";

const TASK_STATUSES = ["TODO", "DONE", "DEFERRED", "ISSUES"] as const;
const SUBTASK_STATUSES = [
  "IN_PROGRESS",
  "DONE",
  "DEFERRED",
  "CANCELLED",
] as const;

export const KONO_ASSISTANT_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] =
  [
    {
      type: "function",
      function: {
        name: "list_projects",
        description:
          "Список проектов пользователя (свои и shared). Вызывай перед create_task, если не знаешь workspaceId.",
        parameters: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "create_project",
        description:
          "Создать новый проект (workspace). Когда пользователь просит создать проект или доску.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Название проекта" },
          },
          required: ["name"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "list_tasks",
        description: "Список задач в проекте по workspaceId (UUID).",
        parameters: {
          type: "object",
          properties: {
            workspaceId: { type: "string", description: "UUID проекта" },
            status: {
              type: "string",
              enum: [...TASK_STATUSES],
              description: "Опциональный фильтр по статусу",
            },
          },
          required: ["workspaceId"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "create_task",
        description:
          "Создать задачу в проекте. Сначала list_projects или search_kono, если workspaceId неизвестен.",
        parameters: {
          type: "object",
          properties: {
            workspaceId: { type: "string", description: "UUID проекта" },
            title: { type: "string", description: "Название задачи" },
            creator: { type: "string", description: "Исполнитель (опционально)" },
          },
          required: ["workspaceId", "title"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_task",
        description:
          "Обновить задачу: название, описание, статус, приоритет, даты. Для «отметь выполненной» — status: DONE.",
        parameters: {
          type: "object",
          properties: {
            taskId: { type: "string", description: "UUID задачи" },
            title: { type: "string", description: "Новое название" },
            description: { type: "string", description: "Описание" },
            status: {
              type: "string",
              enum: [...TASK_STATUSES],
              description: "TODO | DONE | DEFERRED | ISSUES",
            },
            tags: {
              type: "string",
              enum: [...TASK_PRIORITIES, ""],
              description:
                "Приоритет: Срочный, Высокий, Средний, Низкий; пустая строка — сброс",
            },
            startDate: {
              type: "string",
              description: "Дата начала ISO 8601",
            },
            dueDate: {
              type: "string",
              description: "Дедлайн ISO 8601; пустая строка — сброс",
            },
            creator: { type: "string", description: "Исполнитель" },
          },
          required: ["taskId"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "delete_task",
        description:
          "Удалить задачу вместе с подзадачами и activity. Только по явной просьбе пользователя.",
        parameters: {
          type: "object",
          properties: {
            taskId: { type: "string", description: "UUID задачи" },
          },
          required: ["taskId"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "list_subtasks",
        description: "Список подзадач задачи по taskId.",
        parameters: {
          type: "object",
          properties: {
            taskId: { type: "string", description: "UUID задачи" },
          },
          required: ["taskId"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "create_subtask",
        description: "Добавить подзадачу к задаче (декомпозиция).",
        parameters: {
          type: "object",
          properties: {
            taskId: { type: "string", description: "UUID задачи" },
            title: { type: "string", description: "Название подзадачи" },
          },
          required: ["taskId", "title"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_subtask",
        description:
          "Изменить подзадачу: название или статус. Для «выполнено» — status: DONE.",
        parameters: {
          type: "object",
          properties: {
            subtaskId: { type: "string", description: "UUID подзадачи" },
            title: { type: "string", description: "Новое название" },
            status: {
              type: "string",
              enum: [...SUBTASK_STATUSES],
              description: "IN_PROGRESS | DONE | DEFERRED | CANCELLED",
            },
          },
          required: ["subtaskId"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "delete_subtask",
        description:
          "Удалить подзадачу. Только по явной просьбе пользователя.",
        parameters: {
          type: "object",
          properties: {
            subtaskId: { type: "string", description: "UUID подзадачи" },
          },
          required: ["subtaskId"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "add_task_comment",
        description: "Добавить комментарий в ленту задачи.",
        parameters: {
          type: "object",
          properties: {
            taskId: { type: "string", description: "UUID задачи" },
            body: { type: "string", description: "Текст комментария" },
            parentActivityId: {
              type: "string",
              description: "UUID записи для ответа в ветку (опционально)",
            },
          },
          required: ["taskId", "body"],
          additionalProperties: false,
        },
      },
    },
    {
      type: "function",
      function: {
        name: "search_kono",
        description: "Поиск проектов и задач по названию.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Минимум 2 символа" },
            limit: { type: "number", description: "1–50, по умолчанию 20" },
          },
          required: ["query"],
          additionalProperties: false,
        },
      },
    },
  ];

function getAssistantToolName(
  tool: OpenAI.Chat.Completions.ChatCompletionTool,
): string {
  return tool.type === "function" ? tool.function.name : "";
}

export const KONO_TOOL_NAMES = KONO_ASSISTANT_TOOLS.map(getAssistantToolName);

export function filterAssistantTools(
  enabledTools?: string[],
): OpenAI.Chat.Completions.ChatCompletionTool[] {
  if (!enabledTools?.length) {
    return KONO_ASSISTANT_TOOLS;
  }

  const allowed = new Set(enabledTools);
  return KONO_ASSISTANT_TOOLS.filter((tool) =>
    allowed.has(getAssistantToolName(tool)),
  );
}

export function buildToolsSystemAppendix(enabledTools?: string[]): string {
  const activeTools = enabledTools?.length ? enabledTools : KONO_TOOL_NAMES;

  return `
У тебя есть инструменты Kono (MCP): ${activeTools.join(", ")}

КРИТИЧНЫЕ правила:
- НИКОГДА не проси у пользователя workspaceId, taskId, subtaskId или UUID.
- Если ID неизвестен — СРАЗУ вызови list_projects, list_tasks или search_kono. Не спрашивай разрешения.
- Спрашивай только человеческие данные, которых нет в запросе: название задачи, текст подзадачи, название проекта.
- Если в контексте UI указан открытый проект/задача — используй их ID без уточнений.
- Для «отметь выполненной» — update_task (status: DONE) или update_subtask (status: DONE).
- delete_task и delete_subtask — только по явной просьбе.
- Не выдумывай UUID — бери из контекста UI или результатов инструментов.
- Действие «создай/добавь/удали/обнови» = обязательно вызови инструмент, не отвечай «мне нужен ID».
- НИКОГДА не пиши «готово» / «сделал» / «добавил», если не вызвал нужный инструмент и не получил успешный результат.
- Если пользователь просит N задач — вызови create_task N раз (по одной задаче на вызов).
- «Мой проект» / «существующий проект» — смотри список проектов в контексте UI или вызови list_projects.
- После успешного вызова кратко сообщи результат по-русски и что именно изменилось.`;
}

export const KONO_MUTATING_TOOLS = new Set([
  "create_project",
  "create_task",
  "update_task",
  "delete_task",
  "create_subtask",
  "update_subtask",
  "delete_subtask",
  "add_task_comment",
]);

export type KonoToolDataChanged = {
  workspaces: boolean;
  tasks: boolean;
  subtasks: boolean;
  activity: boolean;
};

function formatToolError(error: unknown): string {
  if (error instanceof ApiHttpError) {
    return `${error.code}: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "unknown_error";
}

export function trackKonoToolMutation(
  toolName: string,
  result: string,
  dataChanged: KonoToolDataChanged,
): void {
  if (!KONO_MUTATING_TOOLS.has(toolName) || result.startsWith("Ошибка")) {
    return;
  }

  switch (toolName) {
    case "create_project":
      dataChanged.workspaces = true;
      break;
    case "create_task":
    case "update_task":
    case "delete_task":
      dataChanged.tasks = true;
      break;
    case "create_subtask":
    case "update_subtask":
    case "delete_subtask":
      dataChanged.tasks = true;
      dataChanged.subtasks = true;
      break;
    case "add_task_comment":
      dataChanged.activity = true;
      break;
    default:
      break;
  }
}

export async function executeKonoAssistantTool(
  userId: number,
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  try {
    switch (name) {
      case "list_projects": {
        const workspaces = await workspacesService.listWorkspaces(userId);
        if (workspaces.length === 0) {
          return "У пользователя нет проектов.";
        }
        return workspaces
          .map(
            (w) =>
              `- ${w.name} (${w.kind}, ${w.myRole}) — id: ${w.id}, key: ${w.publicKey}`,
          )
          .join("\n");
      }

      case "create_project": {
        if (!isFeatureEnabled("workspace_creation")) {
          return "Создание проектов временно отключено администратором.";
        }
        const projectName = String(args.name ?? "").trim();
        if (!projectName) return "Укажи name — название проекта.";
        const workspace = await workspacesService.createWorkspace(
          userId,
          projectName,
        );
        return [
          "Проект создан.",
          `id: ${workspace.id}`,
          `name: ${workspace.name}`,
          `publicKey: ${workspace.publicKey}`,
        ].join("\n");
      }

      case "list_tasks": {
        const workspaceId = String(args.workspaceId ?? "").trim();
        if (!workspaceId) return "Укажи workspaceId.";
        const status =
          typeof args.status === "string"
            ? (args.status as TaskStatus)
            : undefined;
        const tasks = await tasksService.listTasksByWorkspace(
          workspaceId,
          userId,
          status ? { status } : undefined,
        );
        if (tasks.length === 0) return "В проекте нет задач.";
        return tasks
          .map((t) => {
            const meta = [
              t.status,
              t.tags ? `приоритет: ${t.tags}` : null,
              t.due_date ? `дедлайн: ${t.due_date}` : null,
            ]
              .filter(Boolean)
              .join(", ");
            return `- ${t.title} (${meta}) — id: ${t.id}`;
          })
          .join("\n");
      }

      case "create_task": {
        const workspaceId = String(args.workspaceId ?? "").trim();
        const title = String(args.title ?? "").trim();
        const creator =
          typeof args.creator === "string" ? args.creator : undefined;
        if (!workspaceId || !title) {
          return "Нужны workspaceId и title.";
        }
        const task = await tasksService.createTask(userId, {
          workspaceId,
          title,
          creator,
        });
        return [
          "Задача создана.",
          `id: ${task.id}`,
          `title: ${task.title}`,
          `status: ${task.status}`,
          `workspaceId: ${task.workspace_id}`,
        ].join("\n");
      }

      case "update_task": {
        const taskId = String(args.taskId ?? "").trim();
        if (!taskId) return "Укажи taskId.";
        const patch: tasksService.TaskPatch = {};
        if (typeof args.title === "string") patch.title = args.title;
        if (typeof args.description === "string") {
          patch.description = args.description;
        }
        if (typeof args.status === "string") {
          patch.status = args.status as TaskStatus;
        }
        if (
          typeof args.tags === "string" &&
          (args.tags === "" || isTaskPriority(args.tags))
        ) {
          patch.tags = args.tags;
        }
        if (typeof args.startDate === "string") patch.startDate = args.startDate;
        if (typeof args.dueDate === "string") patch.dueDate = args.dueDate;
        if (typeof args.creator === "string") patch.creator = args.creator;
        if (Object.keys(patch).length === 0) {
          return "Укажи хотя бы одно поле для обновления.";
        }
        const task = await tasksService.updateTask(taskId, userId, patch);
        return [
          "Задача обновлена.",
          `id: ${task.id}`,
          `title: ${task.title}`,
          `status: ${task.status}`,
          task.tags ? `priority: ${task.tags}` : null,
          task.due_date ? `dueDate: ${task.due_date}` : null,
        ]
          .filter(Boolean)
          .join("\n");
      }

      case "delete_task": {
        const taskId = String(args.taskId ?? "").trim();
        if (!taskId) return "Укажи taskId.";
        await tasksService.deleteTask(taskId, userId);
        return `Задача ${taskId} удалена.`;
      }

      case "list_subtasks": {
        const taskId = String(args.taskId ?? "").trim();
        if (!taskId) return "Укажи taskId.";
        const subtasks = await subtasksService.listSubtasks(taskId, userId);
        if (subtasks.length === 0) return "У задачи нет подзадач.";
        return subtasks
          .map((s) => `- [${s.status}] ${s.title} — id: ${s.id}`)
          .join("\n");
      }

      case "create_subtask": {
        const taskId = String(args.taskId ?? "").trim();
        const title = String(args.title ?? "").trim();
        if (!taskId || !title) return "Нужны taskId и title.";
        const subtask = await subtasksService.createSubtask(
          taskId,
          userId,
          title,
        );
        return [
          "Подзадача создана.",
          `id: ${subtask.id}`,
          `title: ${subtask.title}`,
          `status: ${subtask.status}`,
          `taskId: ${subtask.task_id}`,
        ].join("\n");
      }

      case "update_subtask": {
        const subtaskId = String(args.subtaskId ?? "").trim();
        if (!subtaskId) return "Укажи subtaskId.";
        const patch: subtasksService.SubtaskPatch = {};
        if (typeof args.title === "string") patch.title = args.title;
        if (typeof args.status === "string") {
          patch.status = args.status as SubtaskStatus;
        }
        if (Object.keys(patch).length === 0) {
          return "Укажи хотя бы одно поле для обновления.";
        }
        const subtask = await subtasksService.updateSubtask(
          subtaskId,
          userId,
          patch,
        );
        return [
          "Подзадача обновлена.",
          `id: ${subtask.id}`,
          `title: ${subtask.title}`,
          `status: ${subtask.status}`,
        ].join("\n");
      }

      case "delete_subtask": {
        const subtaskId = String(args.subtaskId ?? "").trim();
        if (!subtaskId) return "Укажи subtaskId.";
        await subtasksService.deleteSubtask(subtaskId, userId);
        return `Подзадача ${subtaskId} удалена.`;
      }

      case "add_task_comment": {
        const taskId = String(args.taskId ?? "").trim();
        const body = String(args.body ?? "").trim();
        const parentActivityId =
          typeof args.parentActivityId === "string"
            ? args.parentActivityId
            : undefined;
        if (!taskId || !body) return "Нужны taskId и body.";
        const activity = await taskActivityService.createTaskActivity(
          taskId,
          userId,
          { body, parentActivityId },
        );
        return [
          "Комментарий добавлен.",
          `id: ${activity.id}`,
          `taskId: ${activity.task_id}`,
          `body: ${activity.body}`,
        ].join("\n");
      }

      case "search_kono": {
        const query = String(args.query ?? "").trim();
        const limit =
          typeof args.limit === "number" ? Math.min(50, args.limit) : 20;
        if (query.length < 2) return "query — минимум 2 символа.";
        const results = await searchService.search(userId, query, limit);
        return JSON.stringify(results, null, 2);
      }

      default:
        return `Неизвестный инструмент: ${name}`;
    }
  } catch (error) {
    return `Ошибка инструмента ${name}: ${formatToolError(error)}`;
  }
}