import { z } from "zod";

export const createLlmKeySchema = z
  .object({
    apiKey: z
      .string()
      .trim()
      .min(8, "Ключ слишком короткий")
      .describe("OpenAI-compatible API key"),
    label: z
      .string()
      .trim()
      .max(64)
      .optional()
      .describe("Подпись ключа в настройках"),
  })
  .describe("Добавление LLM-ключа");

export const listLlmQuerySchema = z
  .object({
    sorting: z
      .enum(["name", "created"])
      .default("name")
      .describe("Сортировка: по имени или дате создания"),
    ordering: z.enum(["asc", "desc"]).default("asc").describe("Порядок"),
  })
  .describe("Query-параметры списка ключей");

export const llmKeyIdParamSchema = z
  .object({
    id: z.string().min(1).describe("UUID LLM-ключа"),
  })
  .describe("Параметры URL: LLM-ключ");

export type CreateLlmKeyInput = z.infer<typeof createLlmKeySchema>;
export type ListLlmQuerySchema = z.infer<typeof listLlmQuerySchema>;
