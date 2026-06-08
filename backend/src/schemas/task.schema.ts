import { z } from "zod";
import { TASK_PRIORITIES } from "../constants/task-priorities.js";
import { TASK_STATUSES } from "../constants/task-statuses.js";

export const taskCreateSchema = z.object({
  title: z.string().min(1, "Введите название").max(200, "Слишком длинное"),
  workspaceId: z.string().min(1, "Укажите проект"),
  creator: z.string().max(100, "Слишком длинное").optional(),
});

export const taskPatchSchema = z
  .object({
    title: z.string().min(1, "Введите название").max(200, "Слишком длинное").optional(),
    description: z.string().optional(),
    tags: z.union([z.enum(TASK_PRIORITIES), z.literal("")]).optional(),
    startDate: z.string().optional(),
    dueDate: z.union([z.string(), z.literal("")]).optional(),
    creator: z.string().max(100, "Слишком длинное").optional(),
    status: z.enum(TASK_STATUSES).optional(),
    checked: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Укажите хотя бы одно поле",
  });

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskPatchInput = z.infer<typeof taskPatchSchema>;
