import { z } from "zod";

export const aiChatSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, "Сообщение не может быть пустым")
      .describe("Сообщение пользователя компаньону"),
    context: z
      .object({
        workspaceId: z.string().uuid().describe("UUID открытого проекта"),
        workspaceName: z.string().describe("Название открытого проекта"),
        taskId: z.string().uuid().optional().describe("UUID открытой задачи"),
        taskTitle: z.string().optional().describe("Название открытой задачи"),
      })
      .optional()
      .describe("Контекст UI: текущий проект и задача"),
    workspaces: z
      .array(
        z.object({
          id: z.string().uuid().describe("UUID проекта"),
          name: z.string().describe("Название проекта"),
          publicKey: z.string().describe("Публичный ключ проекта"),
        }),
      )
      .default([])
      .describe("Список проектов пользователя из UI для system prompt"),
    tasks: z
      .array(
        z.object({
          id: z.string().uuid().optional().describe("UUID задачи"),
          title: z.string().describe("Заголовок задачи"),
          done: z.boolean().describe("true — статус DONE"),
          description: z.string().optional(),
        }),
      )
      .default([])
      .describe("Контекст: задачи проекта для system prompt"),
    subtasks: z
      .array(
        z.object({
          id: z.string().uuid().optional().describe("UUID подзадачи"),
          title: z.string(),
          done: z.boolean(),
          description: z.string().optional(),
        }),
      )
      .default([])
      .describe("Контекст: подзадачи"),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]).describe("Роль в диалоге"),
          content: z.string().describe("Текст сообщения"),
        }),
      )
      .optional()
      .describe("Предыдущие реплики чата (опционально)"),
    toolsEnabled: z
      .boolean()
      .default(true)
      .describe(
        "MCP-инструменты: проекты, задачи, подзадачи, комментарии, поиск",
      ),
    enabledTools: z
      .array(z.string())
      .optional()
      .describe("Список включённых MCP-инструментов; пусто — все"),
  })
  .describe("Запрос к AI-компаньону");

export type AiChatInput = z.infer<typeof aiChatSchema>;
