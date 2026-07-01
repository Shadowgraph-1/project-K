import { z } from "zod";
import { TASK_PRIORITIES } from "../constants/task-priorities.js";
import { TASK_STATUSES } from "../constants/task-statuses.js";

const isoDateTime = z
  .string()
  .datetime({ offset: true })
  .describe("Дата и время в формате ISO 8601, например 2026-06-28T12:00:00+03:00");

export const taskCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, "Введите название")
      .max(200, "Слишком длинное")
      .describe("Заголовок задачи"),
    workspaceId: z.string().min(1, "Укажите проект").describe("UUID проекта"),
    creator: z
      .string()
      .max(100, "Слишком длинное")
      .optional()
      .describe("Имя автора или исполнителя (опционально)"),
  })
  .describe("Создание задачи");

export const taskPatchSchema = z
  .object({
    title: z
      .string()
      .min(1, "Введите название")
      .max(200, "Слишком длинное")
      .optional()
      .describe("Новый заголовок"),
    description: z.string().optional().describe("Описание задачи"),
    tags: z
      .union([z.enum(TASK_PRIORITIES), z.literal("")])
      .optional()
      .describe("Приоритет: Срочный, Высокий, Средний, Низкий; пустая строка — сброс"),
    startDate: isoDateTime.optional().describe("Дата начала"),
    dueDate: z
      .union([isoDateTime, z.literal("")])
      .optional()
      .describe("Дедлайн; пустая строка — сброс"),
    creator: z.string().max(100, "Слишком длинное").optional(),
    status: z
      .enum(TASK_STATUSES)
      .optional()
      .describe("TODO | DONE | DEFERRED | ISSUES"),
  })
  .describe("Частичное обновление задачи — передайте хотя бы одно поле")
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Укажите хотя бы одно поле",
  });

export const taskListQuerySchema = z
  .object({
    workspaceId: z.string().min(1).describe("UUID проекта — обязательный фильтр"),
    status: z
      .enum(TASK_STATUSES)
      .optional()
      .describe("Фильтр по статусу (опционально)"),
  })
  .describe("Query-параметры списка задач");

export const taskIdParamSchema = z
  .object({
    id: z.string().min(1).describe("UUID задачи"),
  })
  .describe("Параметры URL: задача");

export type TaskListQuerySchema = z.infer<typeof taskListQuerySchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskPatchInput = z.infer<typeof taskPatchSchema>;
