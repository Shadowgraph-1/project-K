import { fetch, ProxyAgent } from "undici";
import { env } from "../config/env.js";
import { isConnectorEnabledForUser } from "./connectors.service.js";

const agent = env.TELEGRAM_PROXY
  ? new ProxyAgent(env.TELEGRAM_PROXY)
  : undefined;

export async function sendTelegramMessage(text: string) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
      }),
      dispatcher: agent,
    },
  );

  if (!response.ok) {
    console.error("Telegram send failed:", await response.text());
  }
}

export function notifyTelegramForUser(userId: number, lines: string | string[]) {
  void (async () => {
    const enabled = await isConnectorEnabledForUser(userId, "telegram");
    if (!enabled) return;

    const text = Array.isArray(lines) ? lines.join("\n") : lines;
    await sendTelegramMessage(text);
  })().catch((error) => {
    console.error("Telegram notify failed:", error);
  });
}
