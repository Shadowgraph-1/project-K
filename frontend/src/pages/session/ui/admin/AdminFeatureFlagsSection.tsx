import { ChevronRight } from "lucide-react";

import { AdminFlagsSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

import type { FeatureFlagKey } from "@/api/admin";

type FeatureFlag = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  enabled: boolean;
};

type AdminFeatureFlagsSectionProps = {
  flags: FeatureFlag[];
  loading: boolean;
  isUpdating: boolean;
  onToggle: (key: FeatureFlagKey, enabled: boolean) => void;
};

export function AdminFeatureFlagsSection({
  flags,
  loading,
  isUpdating,
  onToggle,
}: AdminFeatureFlagsSectionProps) {
  return (
    <div className="pt-4">
      <h4 className="px-3 pb-3 text-base font-medium text-foreground/75">
        Feature flags
      </h4>
      {loading ? (
        <AdminFlagsSkeleton />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {flags.map((flag) => (
            <div
              key={flag.key}
              className="group flex flex-col rounded-2xl border border-primary/10 p-4 transition-[border-color] duration-300 hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-normal">{flag.label}</p>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-1.5 py-0.5 text-xs font-medium",
                    flag.enabled
                      ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {flag.enabled ? "Активно" : "Неактивно"}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {flag.key}
              </p>
              <p className="mt-2 text-pretty text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                {flag.description}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80"
                  onClick={() => onToggle(flag.key, !flag.enabled)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Spinner className="size-3" />
                  ) : (
                    <>
                      {flag.enabled ? "Выключить" : "Включить"}
                      <ChevronRight className="size-3" aria-hidden />
                    </>
                  )}
                </button>
                <Button
                  type="button"
                  size="sm"
                  variant={flag.enabled ? "default" : "outline"}
                  className="h-7 rounded-full px-3 text-xs"
                  disabled={isUpdating}
                  onClick={() => onToggle(flag.key, !flag.enabled)}
                >
                  {flag.enabled ? "Включено" : "Выключено"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 px-3 text-xs text-muted-foreground">
        Изменения сохраняются в базе и действуют для всех пользователей.
      </p>
    </div>
  );
}
