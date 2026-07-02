import type { ReactNode } from "react";
import { Check } from "lucide-react";
import {
  ContextMenuItem,
  ContextMenuSubTrigger,
} from "@/shared/ui/context-menu";
import { cn } from "@/shared/lib/utils";

export const linearContextMenuContentClass = "min-w-[220px] p-1";

const linearRowClass =
  "h-8 gap-0 rounded-sm px-2 text-[13px] leading-none";

const linearIconWrapClass =
  "flex size-4 shrink-0 items-center justify-center text-muted-foreground";

const linearSubTriggerChevronClass =
  "[&>svg:last-child]:size-2.5 [&>svg:last-child]:text-muted-foreground/55";

export function TaskDeleteFieldIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="m2 3 1.652 9.911A2.5 2.5 0 0 0 6.118 15h3.764a2.5 2.5 0 0 0 2.466-2.089L14 3H2Zm1.77 1.5 1.361 8.164a1 1 0 0 0 .987.836h3.764a1 1 0 0 0 .987-.836l1.36-8.164H3.771Z"
        clipRule="evenodd"
      />
      <path d="M5.5 2.5A1.5 1.5 0 0 1 7 1h2a1.5 1.5 0 0 1 1.5 1.5v1h-5v-1Z" />
      <path d="M1 3.75A.75.75 0 0 1 1.75 3h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 3.75Z" />
    </svg>
  );
}

export function ContextMenuFieldSubTrigger({
  icon,
  label,
  className,
}: {
  icon: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <ContextMenuSubTrigger
      className={cn(linearRowClass, linearSubTriggerChevronClass, className)}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className={linearIconWrapClass}>{icon}</span>
        <span className="truncate">{label}</span>
      </span>
    </ContextMenuSubTrigger>
  );
}

export function ContextMenuPickItem({
  icon,
  label,
  selected,
  onSelect,
  className,
}: {
  icon: ReactNode;
  label: string;
  selected?: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <ContextMenuItem
      className={cn(linearRowClass, "gap-2", className)}
      onSelect={onSelect}
    >
      <span className={linearIconWrapClass}>{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {selected ? (
        <Check className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
      ) : null}
    </ContextMenuItem>
  );
}

export function ContextMenuActionItem({
  icon,
  label,
  onSelect,
  variant = "default",
  className,
}: {
  icon: ReactNode;
  label: string;
  onSelect: () => void;
  variant?: "default" | "destructive";
  className?: string;
}) {
  return (
    <ContextMenuItem
      variant={variant}
      className={cn(linearRowClass, "gap-2", className)}
      onSelect={onSelect}
    >
      <span
        className={cn(
          linearIconWrapClass,
          variant === "destructive" && "text-destructive",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </ContextMenuItem>
  );
}
