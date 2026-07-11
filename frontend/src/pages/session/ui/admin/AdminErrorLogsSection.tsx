import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { AdminErrorLogsSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";

import {
  adminSectionHeader,
  adminSectionTitle,
  adminSurface,
  formatDateTime,
} from "./admin-page-shared";

type ErrorLogEntry = {
  id: string;
  timestamp: string;
  method: string;
  statusCode: number;
  url: string;
  message: string;
};

type AdminErrorLogsSectionProps = {
  logs: ErrorLogEntry[];
  loading: boolean;
  isClearing: boolean;
  onClear: () => void;
};

export function AdminErrorLogsSection({
  logs,
  loading,
  isClearing,
  onClear,
}: AdminErrorLogsSectionProps) {
  return (
    <section className={adminSurface}>
      <div className={cn(adminSectionHeader, "justify-between")}>
        <div className="flex min-w-0 items-center gap-2">
          <h2 className={adminSectionTitle}>Журнал ошибок</h2>
          {logs.length > 0 ? (
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {logs.length}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 text-xs text-muted-foreground hover:text-destructive",
          )}
          disabled={isClearing || logs.length === 0}
          onClick={onClear}
        >
          {isClearing ? "Очистка…" : "Очистить"}
        </Button>
      </div>

      {loading ? (
        <AdminErrorLogsSkeleton />
      ) : logs.length === 0 ? (
        <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">
          Ошибок нет. Сюда попадают 5xx (до 200 записей в памяти).
        </p>
      ) : (
        <ul className="divide-y divide-border/40">
          {logs.map((entry) => (
            <li
              key={entry.id}
              className="space-y-1.5 px-4 py-3 transition-colors hover:bg-muted/25"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px]">
                <time className="tabular-nums text-muted-foreground/55">
                  {formatDateTime(entry.timestamp)}
                </time>
                <span className="text-muted-foreground/40" aria-hidden>
                  ·
                </span>
                <span className="font-mono text-foreground/80">
                  {entry.method}
                </span>
                <span className="text-muted-foreground/40" aria-hidden>
                  ·
                </span>
                <span className="font-medium tabular-nums text-red-600 dark:text-red-400">
                  {entry.statusCode}
                </span>
              </div>
              <p className="truncate font-mono text-[11px] text-muted-foreground/70">
                {entry.url}
              </p>
              <p className="text-[13px] leading-relaxed text-foreground/90">
                {entry.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
