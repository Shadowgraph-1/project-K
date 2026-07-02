import { api } from "../client";

export type LlmKeyItem = {
  id: string;
  label: string | null;
  hint: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
};

export type LlmKeysResponse = {
  useDefault: boolean;
  keys: LlmKeyItem[];
};

export type CreateLlmKeyPayload = {
  apiKey: string;
  label?: string;
};

export type LlmKeyListParams = {
  sorting?: "name" | "created";
  ordering?: "asc" | "desc";
};

export async function fetchLlmKeys(
  params?: LlmKeyListParams,
): Promise<LlmKeysResponse> {
  const { data } = await api.get<LlmKeysResponse>("/llm-keys", { params });
  return data;
}

export async function createLlmKeyOnApi(
  payload: CreateLlmKeyPayload,
): Promise<LlmKeysResponse> {
  const { data } = await api.post<LlmKeysResponse>("/llm-keys", payload);
  return data;
}

export async function activateLlmKeyOnApi(
  keyId: string,
): Promise<LlmKeysResponse> {
  const { data } = await api.patch<LlmKeysResponse>(
    `/llm-keys/${keyId}/activate`,
  );
  return data;
}

export async function deleteLlmKeyOnApi(keyId: string): Promise<void> {
  await api.delete(`/llm-keys/${keyId}`);
}

export async function deleteAllLlmKeysOnApi(): Promise<void> {
  await api.delete("/llm-keys");
}
