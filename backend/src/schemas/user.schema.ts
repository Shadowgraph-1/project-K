import { z } from "zod";

export const deleteAccountSchema = z
  .object({
    password: z
      .string()
      .min(1, "Введите пароль")
      .describe("Текущий пароль для подтверждения удаления"),
  })
  .describe("Подтверждение удаления аккаунта");

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(1, "Имя обязательно")
      .max(20, "Слишком длинное имя")
      .describe("Имя пользователя (1–20 символов)"),
    email: z
      .string()
      .email("Неверный формат email")
      .describe("E-mail для входа"),
  })
  .describe("Обновление профиля");

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Введите текущий пароль")
      .describe("Текущий пароль"),
    newPassword: z
      .string()
      .min(6, "Минимум 6 символов")
      .describe("Новый пароль (минимум 6 символов)"),
    confirmPassword: z
      .string()
      .describe("Повтор нового пароля"),
  })
  .describe("Смена пароля")
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;