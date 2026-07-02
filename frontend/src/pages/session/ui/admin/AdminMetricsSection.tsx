import { AdminMetricsSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { adminOutlineBtn, adminSurface, MetricCard } from "./admin-page-shared";

type AdminMetricsSectionProps = {
  pending: boolean;
  isError: boolean;
  stats?: {
    users: number;
    recentUsers: number;
    workspaces: number;
    tasks: number;
  };
  errorLogCount: number;
  onRetry: () => void;
};

export function AdminMetricsSection({
  pending,
  isError,
  stats,
  errorLogCount,
  onRetry,
}: AdminMetricsSectionProps) {
  return (
    <div>
      <h4 className="px-3 pb-3 pt-4 text-base font-medium text-foreground/75">
        Метрики
      </h4>

      {pending ? (
        <AdminMetricsSkeleton />
      ) : isError ? (
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
            onClick={onRetry}
          >
            Повторить
          </Button>
        </div>
      ) : stats ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <MetricCard
            label="Пользователи"
            value={stats.users}
            subLabel="Новых за 7 дней"
            subValue={`+${stats.recentUsers.toLocaleString()}`}
          />
          <MetricCard label="Проекты" value={stats.workspaces} />
          <MetricCard label="Задачи" value={stats.tasks} />
          <MetricCard label="Ошибки в журнале" value={errorLogCount} />
        </div>
      ) : null}
    </div>
  );
}
