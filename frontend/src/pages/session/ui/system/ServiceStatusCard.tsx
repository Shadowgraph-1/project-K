import { cn } from "@/shared/lib/utils";

export type ServiceStatus = "operational" | "degraded" | "down";

const STATUS_VIEW: Record<
  ServiceStatus,
  {
    label: string;
    dotClassName: string;
    textClassName: string;
  }
> = {
  operational: {
    label: "Работает",
    dotClassName: "bg-emerald-500",
    textClassName: "text-emerald-600 dark:text-emerald-400",
  },
  degraded: {
    label: "Замедлен",
    dotClassName: "bg-amber-500",
    textClassName: "text-amber-600 dark:text-amber-400",
  },
  down: {
    label: "Недоступен",
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
    typeof latencyMs === "number" ? `${latencyMs} мс` : null;

  return (
    <li className="transition-colors hover:bg-muted/25">
      <div className="flex items-start gap-3 px-4 py-3 sm:items-center">
        <span
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full sm:mt-0",
            view.dotClassName,
          )}
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <p className="truncate text-[13px] font-medium text-foreground">
              {name}
            </p>
            <span className="text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <span
              className={cn(
                "text-[12px] font-medium",
                view.textClassName,
              )}
            >
              {view.label}
            </span>
            {latencyLabel ? (
              <>
                <span className="text-muted-foreground/40" aria-hidden>
                  ·
                </span>
                <span className="text-[12px] tabular-nums text-muted-foreground/55">
                  {latencyLabel}
                </span>
              </>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
            {description}
            {message ? (
              <>
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                <span title={message}>{message}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </li>
  );
}
