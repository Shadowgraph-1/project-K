import { ShieldAlert } from "lucide-react";

import { AdminErrorLogsSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { adminOutlineBtn, adminSurface, formatDateTime } from "./admin-page-shared";

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
    <div className="pt-2">
      <div className="flex min-h-12 items-center justify-between gap-2 px-3 pb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-muted-foreground" />
          <h4 className="text-base font-medium text-foreground/75">
            Журнал ошибок
          </h4>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(adminOutlineBtn, "h-7 px-3 text-xs")}
          disabled={isClearing || logs.length === 0}
          onClick={onClear}
        >
          {isClearing ? "Очистка…" : "Очистить"}
        </Button>
      </div>

      <div className={cn(adminSurface, "overflow-hidden")}>
        {loading ? (
          <AdminErrorLogsSkeleton />
        ) : logs.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Ошибок пока нет — сюда попадают 5xx с сервера (до 200 записей в
            памяти)
          </p>
        ) : (
          <div className="divide-y divide-border/10">
            {logs.map((entry) => (
              <div
                key={entry.id}
                className="space-y-2 p-4 text-sm transition-colors hover:bg-muted/20"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDateTime(entry.timestamp)}
                  </span>
                  <span className="rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-xs">
                    {entry.method}
                  </span>
                  <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive">
                    {entry.statusCode}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {entry.url}
                </p>
                <p>{entry.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
