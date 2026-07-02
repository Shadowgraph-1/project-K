import { useState } from "react";
import { Navigate } from "react-router-dom";

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
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { AdminAccessSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { AdminErrorLogsSection } from "./AdminErrorLogsSection";
import { AdminFeatureFlagsSection } from "./AdminFeatureFlagsSection";
import { AdminHealthSection } from "./AdminHealthSection";
import { AdminMetricsSection } from "./AdminMetricsSection";
import { AdminUsersSection } from "./AdminUsersSection";
import { adminOutlineBtn } from "./admin-page-shared";

export function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const { data: access, isLoading: accessLoading } = useAdminAccessQuery();
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

  if (accessLoading) {
    return <AdminAccessSkeleton />;
  }

  if (!isAdmin) {
    return <Navigate to="/projects" replace />;
  }

  const firstName = user?.name?.split(" ")[0] ?? "админ";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 pb-6">
      <div className="flex items-center justify-between pb-4">
        <h1 className="px-3 text-2xl font-medium tracking-tight">
          Добро пожаловать, {firstName}
        </h1>
        <Button
          type="button"
          variant="outline"
          disabled={refreshing}
          className={cn(adminOutlineBtn, "h-9 px-4")}
          onClick={handleRefresh}
        >
          {refreshing ? "Обновление…" : "Обновить"}
        </Button>
      </div>

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
        isUpdating={updateFlag.isPending}
        onToggle={(key, enabled) => updateFlag.mutate({ key, enabled })}
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
  );
}
