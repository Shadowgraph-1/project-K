import { z } from "zod";

export const taskActivityParamSchema = z
  .object({
    taskId: z.string().min(1).describe("UUID задачи"),
  })
  .describe("Параметры URL: activity задачи");

export const taskActivityCreateSchema = z
  .object({
    body: z
      .string()
      .min(1, "Запись не может быть пустой")
      .describe("Текст комментария"),
    parentActivityId: z
      .string()
      .min(1)
      .optional()
      .describe("UUID родительской записи — для ответа в ветке"),
  })
  .describe("Новый комментарий или activity");

export type TaskActivityCreateInput = z.infer<typeof taskActivityCreateSchema>;
