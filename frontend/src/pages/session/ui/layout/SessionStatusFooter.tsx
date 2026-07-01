import type { ReactNode } from "react";
import { Activity, Bot, Database, RefreshCw } from "lucide-react";
import { useHealthQuery } from "@/hooks/use-health-query";
import type { HealthCheck } from "@/api/health";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "../../lib/session-styles";
import { SessionTooltip } from "./SessionTooltip";

function formatCheckedAt(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function StatusRow({
  icon,
  label,
  check,
}: {
  icon: ReactNode;
  label: string;
  check?: HealthCheck;
}) {
  const ok = check?.status === "ok";

  return (
    <div className="flex items-start gap-2.5 px-3 py-2">
      <span
        className={cn(
          "mt-1.5 size-1.5 shrink-0 rounded-full",
          ok ? "bg-emerald-500" : "bg-red-500",
        )}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium leading-none text-foreground">
            {label}
          </p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            {ok
              ? `Работает · ${check?.latencyMs ?? 0} ms`
              : (check?.message ?? "Недоступно")}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SessionStatusFooter() {
  const { data, isLoading, isFetching, isError, refetch } = useHealthQuery();

  const databaseOk = data?.checks.database.status === "ok";
  const aiOk = data?.checks.ai.status === "ok";
  const allOk = databaseOk && aiOk && !isError;
  const anyDown = isError || databaseOk === false || aiOk === false;

  const summaryLabel = isLoading
    ? "Проверка…"
    : allOk
      ? "Все системы в норме"
      : anyDown
        ? "Есть проблемы"
        : "Статус системы";

  return (
    <footer className="flex h-7 shrink-0 items-center justify-end border-t border-border/40 bg-background px-2 pr-2">
      <div className="flex items-center gap-0.5">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-6 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors",
                "hover:bg-muted/50 hover:text-foreground data-[state=open]:bg-muted/50 data-[state=open]:text-foreground",
              )}
              aria-label="Статус системы"
            >
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  isLoading
                    ? "bg-muted-foreground/40"
                    : allOk
                      ? "bg-emerald-500"
                      : "bg-red-500",
                )}
                aria-hidden
              />
              <Activity className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span className="leading-none">{summaryLabel}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="top"
            sideOffset={6}
            className="w-[min(17rem,calc(100vw-1.5rem))] p-0"
          >
            <div className="border-b border-border/60 px-3.5 py-2.5">
              <p className="text-sm font-medium leading-none text-foreground">
                Статус системы
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Обновлено: {formatCheckedAt(data?.timestamp)}
              </p>
            </div>
            <div className="flex flex-col py-1">
              {isError ? (
                <p className="px-3 py-2 text-xs text-destructive">
                  Не удалось получить статус сервера
                </p>
              ) : (
                <>
                  <StatusRow
                    icon={<Database className="size-3.5" />}
                    label="База данных"
                    check={data?.checks.database}
                  />
                  <StatusRow
                    icon={<Bot className="size-3.5" />}
                    label="Kono AI"
                    check={data?.checks.ai}
                  />
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <SessionTooltip label="Обновить статус" side="top">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn("size-7", sessionToolbarIconButton)}
            aria-label="Обновить статус"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              className={cn("size-3.5", isFetching && "animate-spin")}
              aria-hidden
            />
          </Button>
        </SessionTooltip>
      </div>
    </footer>
  );
}
