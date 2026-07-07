import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { ApiHttpError } from "../utils/api-errors.js";

export type ConnectorState = {
  id: string;
  installed: boolean;
  enabled: boolean;
  configured: boolean;
  telegramChatId: string | null;
};

const SUPPORTED_CONNECTORS = ["telegram"] as const;
type SupportedConnectorId = (typeof SUPPORTED_CONNECTORS)[number];

function isSupportedConnector(id: string): id is SupportedConnectorId {
  return SUPPORTED_CONNECTORS.includes(id as SupportedConnectorId);
}

function isConnectorConfigured(id: SupportedConnectorId): boolean {
  if (id === "telegram") {
    return Boolean(env.TELEGRAM_BOT_TOKEN);
  }
  return false;
}

export async function resolveTelegramChatId(
  userId: number,
): Promise<string | null> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) return null;

  const row = await prisma.user_connectors.findUnique({
    where: {
      user_id_connector_id: {
        user_id: userId,
        connector_id: "telegram",
      },
    },
    select: { telegram_chat_id: true },
  });

  if (row?.telegram_chat_id?.trim()) {
    return row.telegram_chat_id.trim();
  }

  const fallbackEmail = env.TELEGRAM_DEFAULT_CHAT_EMAIL ?? "litvin4chuk@mail.ru";
  if (user.email.toLowerCase() === fallbackEmail.toLowerCase()) {
    return env.TELEGRAM_CHAT_ID?.trim() ?? null;
  }

  return null;
}

export async function listUserConnectors(
  userId: number,
): Promise<ConnectorState[]> {
  const rows = await prisma.user_connectors.findMany({
    where: { user_id: userId },
    select: { connector_id: true, enabled: true, telegram_chat_id: true },
  });

  const rowsById = new Map(rows.map((row) => [row.connector_id, row]));

  return SUPPORTED_CONNECTORS.map((id) => ({
    id,
    installed: rowsById.has(id),
    enabled: rowsById.get(id)?.enabled ?? false,
    configured: isConnectorConfigured(id),
    telegramChatId:
      id === "telegram" ? (rowsById.get(id)?.telegram_chat_id ?? null) : null,
  }));
}

export async function setConnectorEnabled(
  userId: number,
  connectorId: string,
  enabled: boolean,
  telegramChatId?: string | null,
): Promise<ConnectorState> {
  if (!isSupportedConnector(connectorId)) {
    throw new ApiHttpError("connector_not_found");
  }

  if (enabled && !isConnectorConfigured(connectorId)) {
    throw new ApiHttpError("connector_not_configured");
  }

  if (enabled && connectorId === "telegram") {
    const resolved =
      telegramChatId?.trim() || (await resolveTelegramChatId(userId));
    if (!resolved) {
      throw new ApiHttpError("connector_not_configured");
    }
  }

  const row = await prisma.user_connectors.upsert({
    where: {
      user_id_connector_id: {
        user_id: userId,
        connector_id: connectorId,
      },
    },
    create: {
      user_id: userId,
      connector_id: connectorId,
      enabled,
      telegram_chat_id:
        connectorId === "telegram" ? (telegramChatId?.trim() ?? null) : null,
    },
    update: {
      enabled,
      ...(connectorId === "telegram" && telegramChatId !== undefined
        ? { telegram_chat_id: telegramChatId?.trim() ?? null }
        : {}),
    },
    select: { enabled: true, telegram_chat_id: true },
  });

  return {
    id: connectorId,
    installed: true,
    enabled: row.enabled,
    configured: isConnectorConfigured(connectorId),
    telegramChatId:
      connectorId === "telegram" ? row.telegram_chat_id : null,
  };
}

export async function removeConnector(
  userId: number,
  connectorId: string,
): Promise<ConnectorState> {
  if (!isSupportedConnector(connectorId)) {
    throw new ApiHttpError("connector_not_found");
  }

  await prisma.user_connectors.deleteMany({
    where: {
      user_id: userId,
      connector_id: connectorId,
    },
  });

  return {
    id: connectorId,
    installed: false,
    enabled: false,
    configured: isConnectorConfigured(connectorId),
    telegramChatId: null,
  };
}

export async function isConnectorEnabledForUser(
  userId: number,
  connectorId: SupportedConnectorId,
): Promise<boolean> {
  if (!isConnectorConfigured(connectorId)) {
    return false;
  }

  const row = await prisma.user_connectors.findUnique({
    where: {
      user_id_connector_id: {
        user_id: userId,
        connector_id: connectorId,
      },
    },
    select: { enabled: true },
  });

  if (row?.enabled !== true) {
    return false;
  }

  if (connectorId === "telegram") {
    return (await resolveTelegramChatId(userId)) !== null;
  }

  return true;
}