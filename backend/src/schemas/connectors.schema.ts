import { z } from "zod";

export const connectorIdParamSchema = z
  .object({
    id: z.string().min(1).describe("ID коннектора, например telegram"),
  })
  .describe("Параметры URL: коннектор");

export const patchConnectorSchema = z
  .object({
    enabled: z.boolean().describe("Включить или выключить коннектор"),
    telegramChatId: z
      .string()
      .trim()
      .regex(/^-?\d+$/, "Chat ID должен быть числом из Telegram")
      .optional()
      .nullable()
      .describe("Telegram chat_id пользователя"),
  })
  .describe("Изменение состояния коннектора");

export type PatchConnectorInput = z.infer<typeof patchConnectorSchema>;
