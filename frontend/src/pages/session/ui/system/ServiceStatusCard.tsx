import { cn } from "@/shared/lib/utils";

export type ServiceStatus = "operational" | "degraded" | "down";

const STATUS_VIEW: Record<
  ServiceStatus,
  {
    label: string;
    rowLabel: string;
    dotClassName: string;
    textClassName: string;
  }
> = {
  operational: {
    label: "Работает",
    rowLabel: "доступен",
    dotClassName: "bg-emerald-500",
    textClassName: "text-emerald-600 dark:text-emerald-400",
  },
  degraded: {
    label: "Замедлен",
    rowLabel: "замедлен",
    dotClassName: "bg-amber-500",
    textClassName: "text-amber-600 dark:text-amber-400",
  },
  down: {
    label: "Недоступен",
    rowLabel: "недоступен",
    dotClassName: "bg-red-500",
    textClassName: "text-red-600 dark:text-red-400",
  },
};

type ServiceStatusCardProps = {
  name: string;
  description: string;
  status: ServiceStatus;
  latencyMs?: number;
  message?: string;
};

export function ServiceStatusCard({
  name,
  description,
  status,
  latencyMs,
  message,
}: ServiceStatusCardProps) {
  const view = STATUS_VIEW[status];
  const latencyLabel =
    typeof latencyMs === "number" ? `${latencyMs} мс` : "Нет данных";

  return (
    <li className="border-b border-border/60 last:border-b-0">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {description}
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            <span className="tabular-nums">{latencyLabel}</span>
            {message ? (
              <>
                <span className="mx-1.5 text-muted-foreground/50">·</span>
                <span title={message}>{message}</span>
              </>
            ) : null}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-2 text-xs font-medium",
            view.textClassName,
          )}
        >
          <span
            className={cn("size-2 rounded-full", view.dotClassName)}
            aria-hidden="true"
          />
          {view.rowLabel}
        </span>
      </div>
    </li>
  );
}
