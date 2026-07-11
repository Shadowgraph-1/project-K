import { cn } from "@/shared/lib/utils";

export const adminSurface =
  "overflow-hidden rounded-xl border border-border/60 text-left";

export const adminSectionHeader =
  "flex items-center gap-2 border-b border-primary/10 px-4 py-2.5";

export const adminSectionTitle = "text-xs text-primary";

export const adminOutlineBtn =
  "h-8 shrink-0 gap-1.5 rounded-full px-3 text-xs ring-1 ring-border/40";

export function HealthPill({ status }: { status: "ok" | "down" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "ok"
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "bg-red-500/10 text-red-700 dark:text-red-300",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "ok" ? "bg-emerald-500" : "bg-red-500",
        )}
        aria-hidden
      />
      {status === "ok" ? "Работает" : "Сбой"}
    </span>
  );
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function MetricCard({
  label,
  value,
  subLabel,
  subValue,
  className,
}: {
  label: string;
  value: number;
  subLabel?: string;
  subValue?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[4.75rem] flex-col gap-0.5 px-4 py-3", className)}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-lg font-medium tabular-nums tracking-tight text-foreground">
        {value.toLocaleString("ru-RU")}
      </p>
      {subLabel && subValue ? (
        <p className="mt-0.5 text-[11px] text-muted-foreground/70">
          {subLabel}{" "}
          <span className="font-medium tabular-nums text-foreground/80">
            {subValue}
          </span>
        </p>
      ) : null}
    </div>
  );
}
