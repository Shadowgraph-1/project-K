import { Check, RefreshCw, TriangleAlert } from "lucide-react";

import { useHealthQuery } from "@/hooks/use-health-query";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { SystemStatusTableSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { SessionPageHeader } from "@/pages/session/ui/layout/SessionPageHeader";
import {
  ServiceStatusCard,
  type ServiceStatus,
} from "./ServiceStatusCard";

type ServiceEntry = {
  name: string;
  description: string;
  status: ServiceStatus;
  latencyMs?: number;
  message?: string;
};

type StatusTheme = {
  title: string;
  description: string;
  badgeClassName: string;
  iconClassName: string;
};

const STATUS_THEME: Record<ServiceStatus, StatusTheme> = {
  operational: {
    title: "Всё работает",
    description: "Известных проблем с сервисами нет.",
    badgeClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  degraded: {
    title: "Есть замедление",
    description: "Сервисы отвечают, но часть запросов дольше обычного.",
    badgeClassName: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
    iconClassName: "text-amber-600 dark:text-amber-400",
  },
  down: {
    title: "Есть сбой",
    description: "Один или несколько сервисов не ответили корректно.",
    badgeClassName: "bg-red-500/10 text-red-700 dark:text-red-300",
    iconClassName: "text-red-600 dark:text-red-400",
  },
};

function formatCheckedAt(iso?: string) {
  if (!iso) return null;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function resolveServiceStatus(ok: boolean, latencyMs?: number): ServiceStatus {
  if (!ok) return "down";
  if (typeof latencyMs === "number" && latencyMs > 500) return "degraded";
  return "operational";
}

export function SystemStatusPage() {
  const { data, isLoading, isFetching, isError, refetch } = useHealthQuery();

  const apiOk = data?.checks.api.status === "ok";
  const dbOk = data?.checks.database.status === "ok";
  const aiOk = data?.checks.ai.status === "ok";
  const systemHealthy = data?.status === "healthy";

  const services: ServiceEntry[] = data
    ? [
        {
          name: "API",
          description: "Сервер приложения",
          status: resolveServiceStatus(
            apiOk && systemHealthy,
            data.checks.api.latencyMs,
          ),
          latencyMs: data.checks.api.latencyMs,
          message: data.checks.api.message,
        },
        {
          name: "База данных",
          description: "Хранилище PostgreSQL",
          status: resolveServiceStatus(dbOk, data.checks.database.latencyMs),
          latencyMs: data.checks.database.latencyMs,
          message: data.checks.database.message,
        },
        {
          name: "AI-сервис",
          description: "Помощник Kono",
          status: resolveServiceStatus(aiOk, data.checks.ai.latencyMs),
          latencyMs: data.checks.ai.latencyMs,
          message: data.checks.ai.message,
        },
        {
          name: "Веб-приложение",
          description: "Текущая клиентская сессия",
          status: "operational",
          message: "Работает локально",
        },
      ]
    : [];

  const downCount = services.filter((s) => s.status === "down").length;
  const degradedCount = services.filter((s) => s.status === "degraded").length;

  const summaryStatus: ServiceStatus =
    isError || downCount > 0
      ? "down"
      : degradedCount > 0
        ? "degraded"
        : "operational";

  const theme = STATUS_THEME[summaryStatus];
  const checkedAt = formatCheckedAt(data?.timestamp);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pb-8">
      <SessionPageHeader
        title="Статус"
        className="flex-col gap-3 pb-4 sm:flex-row sm:items-end"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-xs ring-1 ring-border/40"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              className={cn("size-3.5", isFetching && "animate-spin")}
              aria-hidden
            />
            Обновить
          </Button>
        }
      />

      <div className="space-y-3">
        {/* Summary */}
        <section className="overflow-hidden rounded-xl border border-border/60">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                theme.badgeClassName,
              )}
            >
              {isLoading ? (
                <RefreshCw
                  className={cn("size-3.5 animate-spin", theme.iconClassName)}
                  aria-hidden
                />
              ) : summaryStatus === "operational" ? (
                <Check className={cn("size-4", theme.iconClassName)} aria-hidden />
              ) : (
                <TriangleAlert
                  className={cn("size-4", theme.iconClassName)}
                  aria-hidden
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">
                {isLoading
                  ? "Проверяем…"
                  : isError
                    ? "Не удалось проверить"
                    : theme.title}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                {isError
                  ? "Health endpoint не ответил. Проверьте backend или нажмите «Обновить»."
                  : theme.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground/55">
                {data?.version ? (
                  <span className="tabular-nums">v{data.version}</span>
                ) : null}
                {data?.version && checkedAt ? (
                  <span className="text-muted-foreground/40" aria-hidden>
                    ·
                  </span>
                ) : null}
                {checkedAt ? (
                  <time className="tabular-nums">обновлено {checkedAt}</time>
                ) : (
                  <span>автообновление каждые 30 с</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="overflow-hidden rounded-xl border border-border/60">
          <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-2.5">
            <h2 className="text-xs text-primary">Сервисы</h2>
            {services.length > 0 ? (
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {services.length}
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <SystemStatusTableSkeleton embedded />
          ) : services.length > 0 ? (
            <ul className="divide-y divide-border/40" aria-label="Статус сервисов">
              {services.map((service) => (
                <ServiceStatusCard
                  key={service.name}
                  name={service.name}
                  description={service.description}
                  status={service.status}
                  latencyMs={service.latencyMs}
                  message={service.message}
                />
              ))}
            </ul>
          ) : (
            <div className="flex items-start gap-3 px-4 py-6">
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400"
                aria-hidden
              />
              <div>
                <p className="text-[13px] font-medium text-foreground">
                  Нет данных
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  Сервер статуса не вернул проверки. Повторите запрос.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
