import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_DAYS: z.coerce.number().int().min(1).max(90).default(7),
  COOKIE_SECRET: z.string().min(32, "COOKIE_SECRET must be at least 32 characters"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173")
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),

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
  TELEGRAM_DEFAULT_CHAT_EMAIL: z.string().email().optional().default("litvin4chuk@mail.ru")
});

export const env = envSchema.parse(process.env);