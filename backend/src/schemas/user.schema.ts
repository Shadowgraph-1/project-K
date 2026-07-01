import { z } from "zod";

export const deleteAccountSchema = z
  .object({
    password: z
      .string()
      .min(1, "Введите пароль")
      .describe("Текущий пароль для подтверждения удаления"),
  })
  .describe("Подтверждение удаления аккаунта");

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
