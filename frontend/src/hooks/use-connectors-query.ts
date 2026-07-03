import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteConnectorOnApi,
  fetchConnectors,
  patchConnectorOnApi,
  type ConnectorState,
} from "@/api/connectors";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";
import { notify } from "@/shared/lib/notify";

export function useConnectorsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.connectors,
    queryFn: fetchConnectors,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function usePatchConnectorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      connectorId,
      enabled,
    }: {
      connectorId: string;
      enabled: boolean;
    }) => patchConnectorOnApi(connectorId, enabled),
    onMutate: async ({ connectorId, enabled }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.connectors });
      const previous = queryClient.getQueryData<{ connectors: ConnectorState[] }>(
        queryKeys.connectors,
      );

      if (previous) {
        queryClient.setQueryData(queryKeys.connectors, {
          connectors: previous.connectors.map((item) =>
            item.id === connectorId ? { ...item, enabled } : item,
          ),
        });
      }

      return { previous };
    },
    onSuccess: (_data, variables) => {
      notify({
        title: variables.enabled ? "Коннектор включён" : "Коннектор выключен",
        variant: "success",
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.connectors, context.previous);
      }
      notify({
        title: getApiErrorMessage(err, "Не удалось изменить коннектор"),
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connectors });
    },
  });
}

export function useDeleteConnectorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectorId: string) => deleteConnectorOnApi(connectorId),
    onMutate: async (connectorId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.connectors });
      const previous = queryClient.getQueryData<{ connectors: ConnectorState[] }>(
        queryKeys.connectors,
      );

      if (previous) {
        queryClient.setQueryData(queryKeys.connectors, {
          connectors: previous.connectors.map((item) =>
            item.id === connectorId
              ? { ...item, installed: false, enabled: false }
              : item,
          ),
        });
      }

      return { previous };
    },
    onSuccess: () => {
      notify({ title: "Коннектор удалён", variant: "success" });
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.connectors, context.previous);
      }
      notify({
        title: getApiErrorMessage(err, "Не удалось удалить коннектор"),
        variant: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connectors });
    },
  });
}
