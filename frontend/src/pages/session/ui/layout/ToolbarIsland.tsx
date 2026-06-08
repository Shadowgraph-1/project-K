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
        "flex h-8 shrink-0 items-center gap-0.5 rounded-none border border-border bg-muted/50 p-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const toolbarIslandItemClass =
  "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 rounded-none px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";
