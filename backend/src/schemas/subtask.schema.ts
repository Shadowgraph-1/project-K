import { z } from "zod";
import { SUBTASK_STATUSES } from "../constants/subtask-statuses.js";

export const taskIdParamSchema = z
  .object({
    taskId: z.string().min(1).describe("UUID родительской задачи"),
  })
  .describe("Параметры URL: задача для подзадач");

export const subtaskIdParamSchema = z
  .object({
    id: z.string().min(1).describe("UUID подзадачи"),
  })
  .describe("Параметры URL: подзадача");

export const subtaskCreateSchema = z
  .object({
    title: z.string().min(1, "Введите название").describe("Название подзадачи"),
  })
  .describe("Создание подзадачи");

export const subtaskPatchSchema = z
  .object({
    title: z.string().min(1, "Введите название").optional(),
    status: z
      .enum(SUBTASK_STATUSES)
      .optional()
      .describe("IN_PROGRESS | DONE | DEFERRED | CANCELLED"),
  })
  .describe("Обновление подзадачи")
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Укажите хотя бы одно поле",
  });

export type SubtaskCreateInput = z.infer<typeof subtaskCreateSchema>;
export type SubtaskPatchInput = z.infer<typeof subtaskPatchSchema>;
