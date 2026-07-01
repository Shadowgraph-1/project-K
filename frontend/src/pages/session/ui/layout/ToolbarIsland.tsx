import type { ReactNode } from "react";

import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "@/pages/session/lib/session-styles";

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

export const toolbarIslandItemClass =
  "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-background/60 hover:text-foreground";

export const toolbarIslandIconButtonClass = cn(
  buttonVariants({ variant: "ghost", size: "icon-sm" }),
  sessionToolbarIconButton,
  "relative size-7 shrink-0 hover:bg-accent data-[state=open]:bg-accent",
);
