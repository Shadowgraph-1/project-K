import { fetch, ProxyAgent } from "undici";
import { env } from "../config/env.js";
import {
  isConnectorEnabledForUser,
  resolveTelegramChatId,
} from "./connectors.service.js";
import { createModuleLogger } from "../utils/logger.js";

const log = createModuleLogger("telegram");

const agent = env.TELEGRAM_PROXY
  ? new ProxyAgent(env.TELEGRAM_PROXY)
  : undefined;

async function sendTelegramMessage(chatId: string, text: string) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
      dispatcher: agent,
    },
  );

  if (!response.ok) {
    const body = await response.text();
    log.error({ status: response.status, body, chatId }, "Telegram send failed");
  }
}

export async function notifyTelegramForUser(
  userId: number,
  lines: string | string[],
) {
  try {
    const enabled = await isConnectorEnabledForUser(userId, "telegram");
    if (!enabled) return;

    const chatId = await resolveTelegramChatId(userId);
    if (!chatId) return;

    const text = Array.isArray(lines) ? lines.join("\n") : lines;
    await sendTelegramMessage(chatId, text);
  } catch (error) {
    log.error({ err: error, userId }, "Telegram notify failed");
  }
}