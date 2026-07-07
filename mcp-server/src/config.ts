import { z } from "zod";

const configSchema = z.object({
  KONO_API_URL: z
    .string()
    .url()
    .default("http://localhost:3000/api")
    .transform((url) => url.replace(/\/$/, "")),
  KONO_API_KEY: z.string().min(1, "KONO_API_KEY обязателен"),
});

export type McpConfig = z.infer<typeof configSchema>;

export function loadConfig(): McpConfig {
  const token =
    process.env.KONO_API_KEY?.trim() ||
    process.env.KONO_API_TOKEN?.trim() ||
    "";

  return configSchema.parse({
    KONO_API_URL: process.env.KONO_API_URL,
    KONO_API_KEY: token,
  });
}
