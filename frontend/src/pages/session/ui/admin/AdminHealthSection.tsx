import { Check, TriangleAlert } from "lucide-react";

import { AdminHealthSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { cn } from "@/shared/lib/utils";

import {
  adminSurface,
  formatDateTime,
  HealthPill,
} from "./admin-page-shared";

type AdminHealthSectionProps = {
  pending: boolean;
  health?: {
    status: string;
    version: string;
    timestamp: string;
  };
};

export function AdminHealthSection({ pending, health }: AdminHealthSectionProps) {
  if (pending) {
    return <AdminHealthSkeleton />;
  }

  if (!health) return null;

  const systemHealthy = health.status === "healthy";

  return (
    <section className={adminSurface}>
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
            systemHealthy
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400",
          )}
        >
          {systemHealthy ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <TriangleAlert className="size-4" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[13px] font-medium text-foreground">
              {systemHealthy ? "Система в порядке" : "Есть проблемы"}
            </p>
            <HealthPill status={systemHealthy ? "ok" : "down"} />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground/55">
            <span className="tabular-nums">v{health.version}</span>
            <span className="mx-1.5 text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <time className="tabular-nums">
              {formatDateTime(health.timestamp)}
            </time>
          </p>
        </div>
      </div>
    </section>
  );
}
