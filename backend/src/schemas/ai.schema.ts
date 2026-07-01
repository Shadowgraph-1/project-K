import { z } from "zod";

export const aiChatSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, "Сообщение не может быть пустым")
      .describe("Сообщение пользователя компаньону"),
    tasks: z
      .array(
        z.object({
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
  })
  .describe("Запрос к AI-компаньону");

export type AiChatInput = z.infer<typeof aiChatSchema>;
