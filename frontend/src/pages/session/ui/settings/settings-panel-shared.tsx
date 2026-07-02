import * as React from "react";
import { BellIcon, LockIcon, UserRoundIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export type SettingsSection = "account" | "notifications" | "security";

export const settingsNav: {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "account", label: "Аккаунт", icon: UserRoundIcon },
  { id: "notifications", label: "Уведомления", icon: BellIcon },
  { id: "security", label: "Безопасность", icon: LockIcon },
];

export function SettingsDivider() {
  return <div className="mx-3 h-px bg-border/60" />;
}

export function SettingsRow({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4 px-3 py-1.5">
      <div className="min-w-0 max-w-sm flex-1">{children}</div>
      {action ? (
        <div className="flex min-w-24 shrink-0 items-center justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function ComingSoonBadge() {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-muted px-2.5 text-[11px] font-medium text-muted-foreground">
      Скоро
    </span>
  );
}

export function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-full items-center justify-start gap-2.5 rounded-[10px] px-2.5 text-[13px] font-medium sm:min-w-40",
        active
          ? "bg-primary/10 text-foreground ring-1 ring-primary/25 [&_svg]:text-primary"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Button>
  );
}
