import { useCallback, useState } from "react";
import { RefreshCw } from "lucide-react";

import {
  useAdminAccessQuery,
  useAdminErrorLogsQuery,
  useAdminFeatureFlagsQuery,
  useAdminOverviewQuery,
  useAdminUsersQuery,
  useClearAdminErrorLogsMutation,
  useDeleteAdminUserMutation,
  useUpdateFeatureFlagMutation,
} from "@/hooks/use-admin-query";
import type { FeatureFlagKey } from "@/api/admin";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { SessionPageHeader } from "@/pages/session/ui/layout/SessionPageHeader";

import { AdminErrorLogsSection } from "./AdminErrorLogsSection";
import { AdminFeatureFlagsSection } from "./AdminFeatureFlagsSection";
import { AdminHealthSection } from "./AdminHealthSection";
import { AdminMetricsSection } from "./AdminMetricsSection";
import { AdminUsersSection } from "./AdminUsersSection";
import { adminOutlineBtn } from "./admin-page-shared";

export function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const { data: access } = useAdminAccessQuery();
  const isAdmin = access?.isAdmin === true;

  const {
    data: overview,
    isPending: overviewPending,
    isError: overviewError,
    refetch: refetchOverview,
  } = useAdminOverviewQuery(isAdmin);
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useAdminUsersQuery(isAdmin);
  const {
    data: errorLogs = [],
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useAdminErrorLogsQuery(isAdmin);
  const {
    data: flags = [],
    isLoading: flagsLoading,
    refetch: refetchFlags,
  } = useAdminFeatureFlagsQuery(isAdmin);

  const clearLogs = useClearAdminErrorLogsMutation();
  const updateFlag = useUpdateFeatureFlagMutation();
  const deleteUser = useDeleteAdminUserMutation();
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleFlag = useCallback(
    (key: FeatureFlagKey, enabled: boolean) => {
      updateFlag.mutate({ key, enabled });
    },
    [updateFlag],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchOverview(),
        refetchUsers(),
        refetchLogs(),
        refetchFlags(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col pb-8">
      <SessionPageHeader
        title="Админка"
        className="flex-col gap-3 pb-4 sm:flex-row sm:items-end"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={refreshing}
            className={cn(adminOutlineBtn)}
            onClick={() => void handleRefresh()}
          >
            <RefreshCw
              className={cn("size-3.5", refreshing && "animate-spin")}
              aria-hidden
            />
            {refreshing ? "Обновление…" : "Обновить"}
          </Button>
        }
      />

      <div className="space-y-3">
        <AdminHealthSection
          pending={overviewPending}
          health={overview?.health}
        />

        <AdminMetricsSection
          pending={overviewPending}
          isError={overviewError}
          stats={overview?.stats}
          errorLogCount={errorLogs.length}
          onRetry={() => void refetchOverview()}
        />

        <AdminFeatureFlagsSection
          flags={flags}
          loading={flagsLoading}
          updatingKey={
            updateFlag.isPending ? (updateFlag.variables?.key ?? null) : null
          }
          onToggle={handleToggleFlag}
        />

        <AdminUsersSection
          loading={usersLoading}
          total={usersData?.total}
          items={usersData?.items}
          currentUserId={user?.id}
          deletingUserId={
            deleteUser.isPending ? (deleteUser.variables ?? null) : null
          }
          onDeleteUser={(row) => deleteUser.mutateAsync(row.id)}
        />

        <AdminErrorLogsSection
          logs={errorLogs}
          loading={logsLoading}
          isClearing={clearLogs.isPending}
          onClear={() => clearLogs.mutate()}
        />
      </div>
    </div>
  );
}
