import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export const ACTIVITY_RAIL_WIDTH = "w-5";

type ActivityTimelineRailProps = {
  icon: ReactNode;
  ringClassName?: string;
};

/** Иконка на левом rail; вертикальная линия рисуется на уровне списка. */
export function ActivityTimelineRail({
  icon,
  ringClassName,
}: ActivityTimelineRailProps) {
  return (
    <div
      className={cn(
        ACTIVITY_RAIL_WIDTH,
        "relative z-10 flex shrink-0 flex-col items-center",
      )}
    >
      <div className="flex h-8 w-full shrink-0 items-center justify-center">
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full bg-background ring-1 [&_svg]:size-3.5",
            ringClassName ?? "ring-border/35",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
