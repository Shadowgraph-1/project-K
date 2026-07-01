import { z } from "zod";

export const workspaceIdParamSchema = z
  .object({
    id: z.string().min(1).describe("UUID проекта"),
  })
  .describe("Параметры URL: проект");

export const workspaceCreateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Введите название")
      .max(100, "Слишком длинное")
      .describe("Название нового проекта"),
  })
  .describe("Создание проекта");

export type WorkspaceCreateInput = z.infer<typeof workspaceCreateSchema>;
