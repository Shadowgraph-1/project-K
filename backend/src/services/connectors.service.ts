import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { ApiHttpError } from "../utils/api-errors.js";

export type ConnectorState = {
  id: string;
  installed: boolean;
  enabled: boolean;
  configured: boolean;
};

const SUPPORTED_CONNECTORS = ["telegram"] as const;
type SupportedConnectorId = (typeof SUPPORTED_CONNECTORS)[number];

function isSupportedConnector(id: string): id is SupportedConnectorId {
  return SUPPORTED_CONNECTORS.includes(id as SupportedConnectorId);
}

function isConnectorConfigured(id: SupportedConnectorId): boolean {
  if (id === "telegram") {
    return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  }
  return false;
}

export async function listUserConnectors(
  userId: number,
): Promise<ConnectorState[]> {
  const rows = await prisma.user_connectors.findMany({
    where: { user_id: userId },
    select: { connector_id: true, enabled: true },
  });

  const rowsById = new Map(rows.map((row) => [row.connector_id, row]));

  return SUPPORTED_CONNECTORS.map((id) => ({
    id,
    installed: rowsById.has(id),
    enabled: rowsById.get(id)?.enabled ?? false,
    configured: isConnectorConfigured(id),
  }));
}

export async function setConnectorEnabled(
  userId: number,
  connectorId: string,
  enabled: boolean,
): Promise<ConnectorState> {
  if (!isSupportedConnector(connectorId)) {
    throw new ApiHttpError("connector_not_found");
  }

  if (enabled && !isConnectorConfigured(connectorId)) {
    throw new ApiHttpError("connector_not_configured");
  }

  await prisma.user_connectors.upsert({
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
    },
    update: { enabled },
  });

  return {
    id: connectorId,
    installed: true,
    enabled,
    configured: isConnectorConfigured(connectorId),
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

  return row?.enabled === true;
}
