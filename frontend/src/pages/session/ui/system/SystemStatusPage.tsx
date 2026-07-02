import { Check, RefreshCw, TriangleAlert } from "lucide-react";

import { useHealthQuery } from "@/hooks/use-health-query";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { SystemStatusTableSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
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
  incidentTitle: string;
  incidentDescription: string;
  dotClassName: string;
  textClassName: string;
};

const STATUS_THEME: Record<ServiceStatus, StatusTheme> = {
  operational: {
    incidentTitle: "Инцидентов нет",
    incidentDescription: "Сейчас мы не устраняем известных проблем с сервисами.",
    dotClassName: "bg-emerald-500",
    textClassName: "text-emerald-600 dark:text-emerald-400",
  },
  degraded: {
    incidentTitle: "Есть замедление",
    incidentDescription: "Основные функции доступны, но часть сервисов отвечает дольше обычного.",
    dotClassName: "bg-amber-500",
    textClassName: "text-amber-600 dark:text-amber-400",
  },
  down: {
    incidentTitle: "Есть проблема с доступностью",
    incidentDescription: "Один или несколько сервисов не вернули корректный ответ.",
    dotClassName: "bg-red-500",
    textClassName: "text-red-600 dark:text-red-400",
  },
};

function formatCheckedAt(iso?: string) {
  if (!iso) return "Ожидаем первый ответ";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Ожидаем первый ответ";

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
  const liveRows = services.filter((service) => service.latencyMs !== undefined);
  const liveColumns = liveRows.map((service) => service.name);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Kono Status
          </h1>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-lg border-border/70 bg-transparent px-3"
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          <RefreshCw
            className={cn("size-3.5", isFetching && "animate-spin")}
            aria-hidden="true"
          />
          Обновить
        </Button>
      </header>

      <main className="space-y-10">
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Статус сервисов
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {data?.version
                ? `Версия ${data.version}. Данные обновляются автоматически каждые 30 секунд.`
                : "Данные обновляются автоматически каждые 30 секунд."}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-5">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-background",
                  theme.dotClassName,
                )}
              >
                {summaryStatus === "operational" ? (
                  <Check className="size-5" aria-hidden="true" />
                ) : (
                  <TriangleAlert className="size-5" aria-hidden="true" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {isLoading ? "Проверяем состояние" : theme.incidentTitle}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {isError
                    ? "Сервер статуса сейчас не отвечает. Попробуйте обновить проверку."
                    : theme.incidentDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Живые данные
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Ниже показаны данные, полученные из health endpoint. Они отражают
              состояние сервисов даже тогда, когда отдельный инцидент не создан.
            </p>
          </div>

          {isLoading ? (
            <SystemStatusTableSkeleton />
          ) : liveRows.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/70">
                      <th className="w-40 px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Источник
                      </th>
                      <th
                        className="px-4 py-3 text-center text-xs font-medium text-muted-foreground"
                        colSpan={liveColumns.length}
                      >
                        Сервис
                      </th>
                    </tr>
                    <tr className="border-b border-border/70">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Проверка
                      </th>
                      {liveColumns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 text-center text-xs font-medium text-foreground"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveRows.map((row) => (
                      <tr key={row.name} className="border-b border-border/50 last:border-b-0">
                        <th className="px-4 py-5 text-left text-xs font-medium text-foreground">
                          {row.name}
                        </th>
                        {liveColumns.map((column) => (
                          <td
                            key={column}
                            className="bg-[repeating-linear-gradient(135deg,hsl(var(--muted))_0,hsl(var(--muted))_1px,transparent_1px,transparent_7px)] px-4 py-5 text-center text-xs text-muted-foreground"
                          >
                            {column === row.name ? (
                              <span
                                className={cn(
                                  "font-medium tabular-nums",
                                  STATUS_THEME[row.status].textClassName,
                                )}
                              >
                                {row.latencyMs} мс
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border/70 px-4 py-2 text-right text-xs text-muted-foreground">
                Последнее обновление: {formatCheckedAt(data?.timestamp)}
              </div>
            </div>
          ) : (
            <EmptyStatus />
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Сервисы
          </h2>

          {isLoading ? null : services.length > 0 ? (
            <ul className="overflow-hidden rounded-2xl border border-border/70 bg-background/60">
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
            <EmptyStatus />
          )}
        </section>
      </main>
    </div>
  );
}

function EmptyStatus() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 p-5">
      <div className="flex items-start gap-3">
        <TriangleAlert
          className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Не удалось загрузить статус
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Сервер статуса не вернул данные. Проверьте backend или повторите
            запрос кнопкой «Обновить».
          </p>
        </div>
      </div>
    </div>
  );
}
