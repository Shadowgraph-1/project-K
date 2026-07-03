import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  LM_BASE_URL: z
    .string()
    .url("LM_BASE_URL must be a valid URL")
    .optional()
    .default("http://localhost:1234/v1"),
  LM_API_KEY: z
    .string()
    .min(1, "LM_API_KEY is required")
    .optional()
    .default("lm-studio"),
  LM_MODEL: z.string().min(1).default("gemma-4-e4b-it"),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  VERSION: z.string().min(1).default("1.0.0"),

  ADMIN_EMAILS: z.string().optional(),
  ADMIN_USER_IDS: z.string().optional(),

  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  TELEGRAM_PROXY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
