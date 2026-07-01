import type { ReactElement } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

type SessionTooltipProps = {
  label: string;
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
};

export function SessionTooltip({
  label,
  children,
  side = "bottom",
  sideOffset = 6,
}: SessionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
