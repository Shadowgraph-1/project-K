import { api } from "../client";

export type ConnectorState = {
  id: string;
  installed: boolean;
  enabled: boolean;
  configured: boolean;
  telegramChatId: string | null;
};

export type ConnectorsResponse = {
  connectors: ConnectorState[];
};

export type PatchConnectorPayload = {
  enabled: boolean;
  telegramChatId?: string | null;
};

export async function fetchConnectors(): Promise<ConnectorsResponse> {
  const { data } = await api.get<ConnectorsResponse>("/connectors");
  return data;
}

export async function patchConnectorOnApi(
  connectorId: string,
  payload: PatchConnectorPayload,
): Promise<ConnectorState> {
  const { data } = await api.patch<ConnectorState>(
    `/connectors/${connectorId}`,
    payload,
  );
  return data;
}

export async function deleteConnectorOnApi(
  connectorId: string,
): Promise<ConnectorState> {
  const { data } = await api.delete<ConnectorState>(`/connectors/${connectorId}`);
  return data;
}