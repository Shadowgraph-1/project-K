import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearAdminErrorLogs,
  deleteAdminUser,
  fetchAdminAccess,
  fetchAdminErrorLogs,
  fetchAdminFeatureFlags,
  fetchAdminOverview,
  fetchAdminUsers,
  updateAdminFeatureFlag,
  type FeatureFlag,
  type FeatureFlagKey,
} from "@/api/admin";
import { queryKeys } from "@/shared/api/query-keys";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { notify } from "@/shared/lib/notify";

export function useAdminAccessQuery<TData = Awaited<
  ReturnType<typeof fetchAdminAccess>
>>(
  select?: (data: Awaited<ReturnType<typeof fetchAdminAccess>>) => TData,
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.admin.access(),
    queryFn: fetchAdminAccess,
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: isAuthenticated,
    select,
    notifyOnChangeProps: ["data", "error"],
  });
}

export function useAdminOverviewQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.overview(),
    queryFn: fetchAdminOverview,
    enabled,
    refetchInterval: 30_000,
    retry: 1,
  });
}

export function useAdminUsersQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => fetchAdminUsers(),
    enabled,
  });
}

export function useAdminErrorLogsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.errorLogs(),
    queryFn: () => fetchAdminErrorLogs(),
    enabled,
    refetchInterval: 15_000,
  });
}

export function useAdminFeatureFlagsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.featureFlags(),
    queryFn: fetchAdminFeatureFlags,
    enabled,
  });
}

export function useClearAdminErrorLogsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAdminErrorLogs,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.errorLogs() });
      notify({ title: "Журнал ошибок очищен", variant: "success" });
    },
    onError: () => {
      notify({ title: "Не удалось очистить журнал", variant: "error" });
    },
  });
}

export function useUpdateFeatureFlagMutation() {
  const queryClient = useQueryClient();
  const flagsKey = queryKeys.admin.featureFlags();

  return useMutation({
    mutationFn: ({ key, enabled }: { key: FeatureFlagKey; enabled: boolean }) =>
      updateAdminFeatureFlag(key, enabled),
    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey: flagsKey });
      const previous = queryClient.getQueryData<FeatureFlag[]>(flagsKey);

      queryClient.setQueryData<FeatureFlag[]>(flagsKey, (current) =>
        current?.map((flag) =>
          flag.key === key ? { ...flag, enabled } : flag,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(flagsKey, context.previous);
      }
      notify({ title: "Не удалось обновить флаг", variant: "error" });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: flagsKey });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview() });
      notify({ title: "Пользователь удалён", variant: "success" });
    },
    onError: () => {
      notify({ title: "Не удалось удалить пользователя", variant: "error" });
    },
  });
}
