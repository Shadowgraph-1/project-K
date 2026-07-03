import { api } from "../client";

export type ConnectorState = {
  id: string;
  installed: boolean;
  enabled: boolean;
  configured: boolean;
};

export type ConnectorsResponse = {
  connectors: ConnectorState[];
};

export async function fetchConnectors(): Promise<ConnectorsResponse> {
  const { data } = await api.get<ConnectorsResponse>("/connectors");
  return data;
}

export async function patchConnectorOnApi(
  connectorId: string,
  enabled: boolean,
): Promise<ConnectorState> {
  const { data } = await api.patch<ConnectorState>(`/connectors/${connectorId}`, {
    enabled,
  });
  return data;
}

export async function deleteConnectorOnApi(
  connectorId: string,
): Promise<ConnectorState> {
  const { data } = await api.delete<ConnectorState>(`/connectors/${connectorId}`);
  return data;
}
