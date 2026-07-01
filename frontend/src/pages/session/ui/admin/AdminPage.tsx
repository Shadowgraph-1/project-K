import { useState } from "react";
import {
  Activity,
  ChevronRight,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Navigate } from "react-router-dom";

import {
  useAdminAccessQuery,
  useAdminErrorLogsQuery,
  useAdminFeatureFlagsQuery,
  useAdminOverviewQuery,
  useAdminUsersQuery,
  useClearAdminErrorLogsMutation,
  useUpdateFeatureFlagMutation,
} from "@/hooks/use-admin-query";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { Button } from "@/shared/ui/button";
import { KonoLoader, KonoLoadingPanel } from "@/shared/ui/kono-loader";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

const adminSurface = "rounded-2xl bg-muted/40";
const adminOutlineBtn =
  "rounded-full border-0 bg-transparent ring-1 ring-primary/15 hover:bg-primary/5";

function AdminSectionLoader({
  hint = "Загрузка…",
  className,
}: {
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center px-4 py-12", className)}>
      <KonoLoader size="sm" hint={hint} />
    </div>
  );
}

function HealthPill({ status }: { status: "ok" | "down" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        status === "ok"
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/10 text-red-600 dark:text-red-400",
      )}
    >
      <span
        className={cn(
          status === "ok" ? "bg-emerald-500" : "bg-red-500",
        )}
      />
      {status === "ok" ? "Работает" : "Ошибка"}
    </span>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function MetricCard({
  label,
  value,
  subLabel,
  subValue,
}: {
  label: string;
  value: number;
  subLabel?: string;
  subValue?: string;
}) {
  return (
    <div className={cn(adminSurface, "flex flex-col gap-1 p-4")}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-medium tabular-nums">
        {value.toLocaleString()}
      </p>
      {subLabel && subValue ? (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-medium text-muted-foreground">{subLabel}</p>
          <p className="text-xs font-medium tabular-nums">{subValue}</p>
        </div>
      ) : null}
    </div>
  );
}

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
    return (
      <KonoLoadingPanel
        className="mx-auto w-full max-w-5xl min-h-[40dvh] px-6"
        hint="Проверка доступа…"
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/projects" replace />;
  }

  const systemHealthy = overview?.health?.status === "healthy";
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

      {overviewPending ? (
        <div className={adminSurface}>
          <AdminSectionLoader hint="Загрузка статуса…" className="py-8" />
        </div>
      ) : overview?.health ? (
        <div className={cn(adminSurface, "flex items-center gap-3 px-4 py-3")}>
          <Activity
            className={cn(
              "size-5 shrink-0 -translate-y-px",
              systemHealthy ? "text-emerald-500" : "text-red-500",
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-pretty text-sm font-semibold">
              {systemHealthy
                ? "Система работает штатно"
                : "Обнаружены проблемы в системе"}
            </p>
            <p className="text-pretty text-xs text-muted-foreground">
              v{overview.health.version} ·{" "}
              {formatDateTime(overview.health.timestamp)}
            </p>
          </div>
          <HealthPill status={systemHealthy ? "ok" : "down"} />
        </div>
      ) : null}

      <div>
        <h4 className="px-3 pb-3 pt-4 text-base font-medium text-foreground/75">
          Метрики
        </h4>

        {overviewPending ? (
          <div className={adminSurface}>
            <AdminSectionLoader hint="Загрузка метрик…" />
          </div>
        ) : overviewError ? (
          <div className={cn(adminSurface, "space-y-3 p-4")}>
            <p className="text-sm text-muted-foreground">
              Не удалось загрузить обзор. Проверь, что backend запущен и миграции
              применены.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(adminOutlineBtn, "h-7 px-3 text-xs")}
              onClick={() => void refetchOverview()}
            >
              Повторить
            </Button>
          </div>
        ) : overview?.stats ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <MetricCard
              label="Пользователи"
              value={overview.stats.users}
              subLabel="Новых за 7 дней"
              subValue={`+${overview.stats.recentUsers.toLocaleString()}`}
            />
            <MetricCard
              label="Проекты"
              value={overview.stats.workspaces}
            />
            <MetricCard
              label="Задачи"
              value={overview.stats.tasks}
            />
            <MetricCard
              label="Ошибки в журнале"
              value={errorLogs.length}
            />
          </div>
        ) : null}
      </div>

      <div className="pt-4">
        <h4 className="px-3 pb-3 text-base font-medium text-foreground/75">
          Feature flags
        </h4>
        {flagsLoading ? (
          <AdminSectionLoader hint="Загрузка флагов…" />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {flags.map((flag) => (
              <div
                key={flag.key}
                className="group flex flex-col rounded-2xl border border-primary/10 p-4 transition-[border-color] duration-300 hover:border-primary/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-normal">{flag.label}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-1.5 py-0.5 text-xs font-medium",
                      flag.enabled
                        ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "border-muted-foreground/30 text-muted-foreground",
                    )}
                  >
                    {flag.enabled ? "Активно" : "Неактивно"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {flag.key}
                </p>
                <p className="mt-2 text-pretty text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                  {flag.description}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80"
                    onClick={() =>
                      updateFlag.mutate({
                        key: flag.key,
                        enabled: !flag.enabled,
                      })
                    }
                    disabled={updateFlag.isPending}
                  >
                    {updateFlag.isPending ? (
                      <Spinner className="size-3" />
                    ) : (
                      <>
                        {flag.enabled ? "Выключить" : "Включить"}
                        <ChevronRight className="size-3" aria-hidden />
                      </>
                    )}
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    variant={flag.enabled ? "default" : "outline"}
                    className="h-7 rounded-full px-3 text-xs"
                    disabled={updateFlag.isPending}
                    onClick={() =>
                      updateFlag.mutate({
                        key: flag.key,
                        enabled: !flag.enabled,
                      })
                    }
                  >
                    {flag.enabled ? "Включено" : "Выключено"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 px-3 text-xs text-muted-foreground">
          Флаги хранятся в памяти сервера и сбрасываются при перезапуске.
        </p>
      </div>

      <div className="pt-2">
        <div className="flex min-h-12 items-center justify-between gap-2 px-3 pb-2">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <h4 className="text-base font-medium text-foreground/75">
              Пользователи
            </h4>
          </div>
          {usersData ? (
            <p className="text-sm font-medium text-muted-foreground">
              Всего {usersData.total}
            </p>
          ) : null}
        </div>

        <div className={cn(adminSurface, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/20 text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Имя</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Проекты</th>
                  <th className="px-4 py-3 font-medium">Участник в</th>
                  <th className="px-4 py-3 font-medium">Регистрация</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr>
                    <td colSpan={6}>
                      <AdminSectionLoader hint="Загрузка пользователей…" />
                    </td>
                  </tr>
                ) : usersData?.items?.length ? (
                  usersData.items.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/10 transition-colors last:border-0 hover:bg-primary/3"
                    >
                      <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                        {row.id}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.email}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {row.ownedWorkspaces}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {row.memberships}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {formatDateTime(row.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      Нет пользователей
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex min-h-12 items-center justify-between gap-2 px-3 pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-muted-foreground" />
            <h4 className="text-base font-medium text-foreground/75">
              Журнал ошибок
            </h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(adminOutlineBtn, "h-7 px-3 text-xs")}
            disabled={clearLogs.isPending || errorLogs.length === 0}
            onClick={() => clearLogs.mutate()}
          >
            {clearLogs.isPending ? "Очистка…" : "Очистить"}
          </Button>
        </div>

        <div className={cn(adminSurface, "overflow-hidden")}>
          {logsLoading ? (
            <AdminSectionLoader hint="Загрузка журнала…" />
          ) : errorLogs.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Ошибок пока нет — сюда попадают 5xx с сервера (до 200 записей в
              памяти)
            </p>
          ) : (
            <div className="divide-y divide-border/10">
              {errorLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="space-y-2 p-4 text-sm transition-colors hover:bg-muted/20"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDateTime(entry.timestamp)}
                    </span>
                    <span className="rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-xs">
                      {entry.method}
                    </span>
                    <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive">
                      {entry.statusCode}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {entry.url}
                  </p>
                  <p>{entry.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
