import type { ReactNode } from "react";

import { sessionPageTitle } from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";

type SessionPageHeaderProps = {
  title: string;
  actions?: ReactNode;
  children?: ReactNode;
  meta?: ReactNode;
  className?: string;
  variant?: "default" | "toolbar";
};

export function SessionPageHeader({
  title,
  actions,
  children,
  className,
  variant = "default",
}: SessionPageHeaderProps) {
  const isToolbar = variant === "toolbar";

  return (
    <header
      className={cn(
        "flex w-full justify-between gap-3",
        isToolbar
          ? "flex-col items-stretch gap-2 pb-3 sm:flex-row sm:items-center"
          : "flex-col gap-4 pb-6 sm:flex-row sm:items-end",
        className,
      )}
    >
      {isToolbar ? (
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {children}
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className={sessionPageTitle}>{title}</h1>
          {children}
        </div>
      )}
      {actions ? (
        <div
          className={cn(
            "flex items-center gap-2",
            isToolbar
              ? "min-w-0 overflow-x-auto pb-0.5 sm:shrink-0 sm:overflow-visible"
              : "shrink-0 self-end",
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
