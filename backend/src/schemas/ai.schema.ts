import { z } from "zod";

export const aiChatSchema = z.object({
  message: z.string().trim().min(1, "Сообщение не может быть пустым"),
  tasks: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean(),
        description: z.string().optional(),
      }),
    )
    .default([]),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;
