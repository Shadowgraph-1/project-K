import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(1, 'Имя обязательно').max(20, 'Слишком длинное имя'),
    email: z.string().email('Неверный формат email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(1, 'Введите пароль'),
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;