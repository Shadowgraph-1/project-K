import { AdminMetricsSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import {
  adminOutlineBtn,
  adminSectionHeader,
  adminSectionTitle,
  adminSurface,
  MetricCard,
} from "./admin-page-shared";

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
    <section className={adminSurface}>
      <div className={adminSectionHeader}>
        <h2 className={adminSectionTitle}>Метрики</h2>
      </div>

      {pending ? (
        <div className="p-1">
          <AdminMetricsSkeleton />
        </div>
      ) : isError ? (
        <div className="space-y-3 px-4 py-5">
          <p className="text-[13px] text-muted-foreground">
            Не удалось загрузить обзор. Проверь backend и миграции.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(adminOutlineBtn)}
            onClick={onRetry}
          >
            Повторить
          </Button>
        </div>
      ) : stats ? (
        <div className="grid sm:grid-cols-2">
          <MetricCard
            label="Пользователи"
            value={stats.users}
            subLabel="за 7 дней"
            subValue={`+${stats.recentUsers.toLocaleString("ru-RU")}`}
            className="border-b border-border/40 sm:border-r"
          />
          <MetricCard
            label="Задачи"
            value={stats.tasks}
            className="border-b border-border/40"
          />
          <MetricCard
            label="Проекты"
            value={stats.workspaces}
            className="border-b border-border/40 sm:border-b-0 sm:border-r"
          />
          <MetricCard
            label="Ошибки в журнале"
            value={errorLogCount}
          />
        </div>
      ) : null}
    </section>
  );
}
