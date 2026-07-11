import { memo } from "react";

import { AdminFlagsSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

import type { FeatureFlagKey } from "@/api/admin";
import {
  adminSectionHeader,
  adminSectionTitle,
  adminSurface,
} from "./admin-page-shared";

type FeatureFlag = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  enabled: boolean;
};

type AdminFeatureFlagsSectionProps = {
  flags: FeatureFlag[];
  loading: boolean;
  updatingKey?: FeatureFlagKey | null;
  onToggle: (key: FeatureFlagKey, enabled: boolean) => void;
};

const FlagRow = memo(function FlagRow({
  flag,
  isUpdating,
  onToggle,
}: {
  flag: FeatureFlag;
  isUpdating: boolean;
  onToggle: (key: FeatureFlagKey, enabled: boolean) => void;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/25">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <p className="text-[13px] font-medium text-foreground">{flag.label}</p>
          <span className="text-muted-foreground/40" aria-hidden>
            ·
          </span>
          <span
            className={cn(
              "text-[12px] font-medium",
              flag.enabled
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground/70",
            )}
          >
            {flag.enabled ? "Вкл" : "Выкл"}
          </span>
        </div>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/55">
          {flag.key}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          {flag.description}
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        variant={flag.enabled ? "default" : "outline"}
        className="h-7 w-14 shrink-0 rounded-full px-3 text-xs"
        disabled={isUpdating}
        onClick={() => onToggle(flag.key, !flag.enabled)}
      >
        {isUpdating ? (
          <Spinner className="size-3" />
        ) : flag.enabled ? (
          "Выкл"
        ) : (
          "Вкл"
        )}
      </Button>
    </li>
  );
});

export function AdminFeatureFlagsSection({
  flags,
  loading,
  updatingKey = null,
  onToggle,
}: AdminFeatureFlagsSectionProps) {
  return (
    <section className={adminSurface}>
      <div className={adminSectionHeader}>
        <h2 className={adminSectionTitle}>Флаги</h2>
        {flags.length > 0 ? (
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {flags.length}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="p-1">
          <AdminFlagsSkeleton />
        </div>
      ) : flags.length === 0 ? (
        <p className="px-4 py-6 text-center text-[13px] text-muted-foreground">
          Флаги не настроены
        </p>
      ) : (
        <ul className="divide-y divide-border/40">
          {flags.map((flag) => (
            <FlagRow
              key={flag.key}
              flag={flag}
              isUpdating={updatingKey === flag.key}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}

      <p className="border-t border-border/40 px-4 py-2.5 text-[11px] text-muted-foreground/70">
        Изменения в базе, действуют для всех пользователей.
      </p>
    </section>
  );
}
