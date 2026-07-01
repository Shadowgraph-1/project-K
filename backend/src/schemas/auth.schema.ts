import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Имя обязательно")
      .max(20, "Слишком длинное имя")
      .describe("Имя пользователя (1–20 символов)"),
    email: z.string().email("Неверный формат email").describe("E-mail для входа"),
    password: z
      .string()
      .min(6, "Минимум 6 символов")
      .describe("Пароль (минимум 6 символов)"),
    confirmPassword: z.string().describe("Повтор пароля — должен совпадать с password"),
  })
  .describe("Тело запроса регистрации")
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const loginSchema = z
  .object({
    email: z.string().email("Неверный формат email").describe("E-mail"),
    password: z.string().min(1, "Введите пароль").describe("Пароль"),
  })
  .describe("Тело запроса входа");

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
