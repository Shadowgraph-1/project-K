import { cn } from "@/shared/lib/utils";

export const adminSurface = "rounded-2xl bg-muted/40";
export const adminOutlineBtn =
  "rounded-full border-0 bg-transparent ring-1 ring-primary/15 hover:bg-primary/5";

export function HealthPill({ status }: { status: "ok" | "down" }) {
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
