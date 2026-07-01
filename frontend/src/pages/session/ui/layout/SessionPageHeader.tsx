import type { ReactNode } from "react";

import { sessionPageTitle } from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";

type SessionPageHeaderProps = {
  title: string;
  actions?: ReactNode;
  children?: ReactNode;
  /** Inline caption for `toolbar` variant (e.g. task count). */
  meta?: ReactNode;
  className?: string;
  variant?: "default" | "toolbar";
};

export function SessionPageHeader({
  title,
  actions,
  children,
  meta,
  className,
  variant = "default",
}: SessionPageHeaderProps) {
  const isToolbar = variant === "toolbar";

  return (
    <header
      className={cn(
        "flex w-full justify-between gap-3",
        isToolbar
          ? "items-center pb-3"
          : "flex-col gap-4 pb-6 sm:flex-row sm:items-end",
        className,
      )}
    >
      {isToolbar ? (
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {meta ? (
            <>
              <span
                className="shrink-0 text-muted-foreground/35"
                aria-hidden
              >
                ·
              </span>
              <p className="shrink-0 text-sm text-muted-foreground">{meta}</p>
            </>
          ) : null}
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
            "flex shrink-0 items-center gap-2",
            !isToolbar && "self-end",
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
