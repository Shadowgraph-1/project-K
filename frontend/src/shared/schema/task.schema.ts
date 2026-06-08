import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(1, "Введите название").max(200, "Слишком длинное"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  creator: z.string().max(100).optional(),
  tags: z.enum(["Срочный", "Высокий", "Средний", "Низкий"]).optional(),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;