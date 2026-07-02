import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activateLlmKeyOnApi,
  createLlmKeyOnApi,
  deleteAllLlmKeysOnApi,
  deleteLlmKeyOnApi,
  fetchLlmKeys,
  type CreateLlmKeyPayload,
  type LlmKeysResponse,
  type LlmKeyListParams,
} from "@/api/llm-settings";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";
import { notify } from "@/shared/lib/notify";

export function useLlmKeysQuery(
  params?: LlmKeyListParams,
  options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.llmKeys(params),
    queryFn: () => fetchLlmKeys(params),
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: 30_000,
  });
}

function useLlmKeysMutation<TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<LlmKeysResponse>,
  messages: { success: string; error: string },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["llm-keys"] });
      notify({ title: messages.success, variant: "success" });
    },
    onError: (err) => {
      notify({
        title: getApiErrorMessage(err, messages.error),
        variant: "error",
      });
    },
  });
}

export function useCreateLlmKeyMutation() {
  return useLlmKeysMutation(
    (payload: CreateLlmKeyPayload) => createLlmKeyOnApi(payload),
    {
      success: "API ключ добавлен",
      error: "Не удалось добавить ключ",
    },
  );
}

export function useActivateLlmKeyMutation() {
  return useLlmKeysMutation(
    (keyId: string) => activateLlmKeyOnApi(keyId),
    {
      success: "Подключение переключено",
      error: "Не удалось переключить подключение",
    },
  );
}

export function useDeleteLlmKeyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => deleteLlmKeyOnApi(keyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["llm-keys"]});
      notify({ title: "API ключ удалён", variant: "success" });
    },
    onError: (err) => {
      notify({
        title: getApiErrorMessage(err, "Не удалось удалить ключ"),
        variant: "error",
      });
    },
  });
}

export function useDeleteAllLlmKeysMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllLlmKeysOnApi(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["llm-keys"] });
      notify({ title: "Все ключи удалены", variant: "success" });
    },
    onError: (err) => {
      notify({
        title: getApiErrorMessage(err, "Не удалось удалить ключи"),
        variant: "error",
      });
    },
  });
}
