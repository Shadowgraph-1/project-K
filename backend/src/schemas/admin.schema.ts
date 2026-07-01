import { z } from "zod";
import { FEATURE_FLAG_KEYS } from "../services/feature-flags.service.js";

export const updateFeatureFlagSchema = z
  .object({
    enabled: z.boolean().describe("true — включить функцию, false — выключить"),
  })
  .describe("Обновление feature flag");

export const adminUsersQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(50)
      .describe("Записей на страницу (1–100)"),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .optional()
      .default(0)
      .describe("Смещение"),
  })
  .describe("Пагинация списка пользователей");

export const adminErrorLogsQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(200)
      .optional()
      .default(50)
      .describe("Сколько последних ошибок вернуть (1–200)"),
  })
  .describe("Query журнала ошибок");

export const featureFlagKeyParamSchema = z
  .object({
    key: z
      .enum(FEATURE_FLAG_KEYS)
      .describe(
        "Ключ: assistant_enabled, registration_open, workspace_creation, llm_user_keys",
      ),
  })
  .describe("Параметры URL: feature flag");
