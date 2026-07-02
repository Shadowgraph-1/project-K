import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type ToolbarIslandProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function ToolbarIsland({
  children,
  className,
  "aria-label": ariaLabel,
}: ToolbarIslandProps) {
  return (
    <div
      role={ariaLabel ? "group" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "flex h-8 shrink-0 items-center gap-0.5 rounded-xl bg-muted/40 p-0.5 ring-1 ring-border/30",
        className,
      )}
    >
      {children}
    </div>
  );
}
