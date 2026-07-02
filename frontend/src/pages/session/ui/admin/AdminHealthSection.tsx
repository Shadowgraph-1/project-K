import { Activity } from "lucide-react";

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
    <div className={cn(adminSurface, "flex items-center gap-3 px-4 py-3")}>
      <Activity
        className={cn(
          "size-5 shrink-0 -translate-y-px",
          systemHealthy ? "text-emerald-500" : "text-red-500",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-pretty text-sm font-semibold">
          {systemHealthy
            ? "Система работает штатно"
            : "Обнаружены проблемы в системе"}
        </p>
        <p className="text-pretty text-xs text-muted-foreground">
          v{health.version} · {formatDateTime(health.timestamp)}
        </p>
      </div>
      <HealthPill status={systemHealthy ? "ok" : "down"} />
    </div>
  );
}
