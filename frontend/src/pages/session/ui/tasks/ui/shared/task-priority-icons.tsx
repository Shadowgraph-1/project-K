import { cn } from "@/shared/lib/utils";
import type { TaskPriority } from "@/entities/task/model/types";
import { normalizeTaskPriority } from "@/entities/task/model/task-priority";

export { normalizeTaskPriority };

type IconProps = {
  className?: string;
};

export function TaskPriorityFieldIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0 text-muted-foreground", className)}
      fill="currentColor"
    >
      <rect x="1" y="8" width="3" height="6" rx="1" />
      <rect x="6" y="5" width="3" height="9" rx="1" />
      <rect x="11" y="2" width="3" height="12" rx="1" />
    </svg>
  );
}

function NoPriorityIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0 text-muted-foreground", className)}
      fill="currentColor"
    >
      <rect x="1.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
      <rect x="6.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
      <rect x="11.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
    </svg>
  );
}


function UrgentPriorityIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0 text-[#f2994a]", className)}
      fill="currentColor"
    >
      <path d="M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4L9 4L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z" />
    </svg>
  );
}


function HighPriorityIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0 text-muted-foreground", className)}
      fill="currentColor"
    >
      <rect x="1.5" y="8" width="3" height="6" rx="1" />
      <rect x="6.5" y="5" width="3" height="9" rx="1" />
      <rect x="11.5" y="2" width="3" height="12" rx="1" />
    </svg>
  );
}


function MediumPriorityIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0 text-muted-foreground", className)}
      fill="currentColor"
    >
      <rect x="1.5" y="8" width="3" height="6" rx="1" />
      <rect x="6.5" y="5" width="3" height="9" rx="1" />
      <rect x="11.5" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  );
}


function LowPriorityIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-hidden
      className={cn("shrink-0 text-muted-foreground", className)}
      fill="currentColor"
    >
      <rect x="1.5" y="8" width="3" height="6" rx="1" />
      <rect x="6.5" y="5" width="3" height="9" rx="1" fillOpacity="0.4" />
      <rect x="11.5" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  );
}

export const TASK_PRIORITY_OPTIONS = [
  { value: null as TaskPriority | null, label: "Без приоритета"},
  { value: "Срочный" as const, label: "Срочный"},
  { value: "Высокий" as const, label: "Высокий"},
  { value: "Средний" as const, label: "Средний"},
  { value: "Низкий" as const, label: "Низкий"},
] as const;

export function TaskPriorityIcon({
  priority,
  className,
}: {
  priority?: TaskPriority | null;
  className?: string;
}) {
  switch (priority) {
    case "Срочный":
      return <UrgentPriorityIcon className={className} />;
    case "Высокий":
      return <HighPriorityIcon className={className} />;
    case "Средний":
      return <MediumPriorityIcon className={className} />;
    case "Низкий":
      return <LowPriorityIcon className={className} />;
    default:
      return <NoPriorityIcon className={className} />;
  }
}

export function getTaskPriorityLabel(priority?: TaskPriority | null) {
  const option = TASK_PRIORITY_OPTIONS.find((o) => o.value === (priority ?? null));
  return option?.label ?? "Без приоритета";
}
