import { Ban, CheckCircle2, CircleAlert, CircleDot, PauseCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import type { SubtaskStatus } from "@/shared/constants/subtask-statuses";

export function TaskStatusFieldIcon({ className }: { className?: string }) {
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
      <path d="M13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8ZM15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM12 8C12 10.2091 10.2091 12 8 12V4C10.2091 4 12 5.79086 12 8Z" />
    </svg>
  );
}

function InProgressRing({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" className="text-amber-500" />
      <circle
        cx="7"
        cy="7"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="7 14"
        className="text-amber-500"
        transform="rotate(-90 7 7)"
      />
    </svg>
  );
}

function taskStatusIconClass(status: TaskStatus) {
  switch (status) {
    case "DONE":
      return "text-emerald-500";
    case "DEFERRED":
      return "text-amber-500";
    case "ISSUES":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export function TaskStatusIcon({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const iconClassName = cn("size-4 shrink-0", taskStatusIconClass(status), className);

  switch (status) {
    case "DONE":
      return <CheckCircle2 className={iconClassName} aria-hidden />;
    case "DEFERRED":
      return <PauseCircle className={iconClassName} aria-hidden />;
    case "ISSUES":
      return <CircleAlert className={iconClassName} aria-hidden />;
    case "TODO":
      return <InProgressRing className={className} />;
    default:
      return <CircleDot className={iconClassName} aria-hidden />;
  }
}

function subtaskStatusIconClass(status: SubtaskStatus) {
  switch (status) {
    case "DONE":
      return "text-emerald-500";
    case "DEFERRED":
      return "text-amber-500";
    case "CANCELLED":
      return "text-red-500";
    case "IN_PROGRESS":
    default:
      return "text-amber-500";
  }
}

export function SubtaskStatusIcon({
  status,
  className,
}: {
  status: SubtaskStatus;
  className?: string;
}) {
  const colorClass = subtaskStatusIconClass(status);

  switch (status) {
    case "DONE":
      return <CheckCircle2 className={cn("size-4 shrink-0", colorClass, className)} aria-hidden />;
    case "DEFERRED":
      return <PauseCircle className={cn("size-4 shrink-0", colorClass, className)} aria-hidden />;
    case "CANCELLED":
      return <Ban className={cn("size-4 shrink-0", colorClass, className)} aria-hidden />;
    case "IN_PROGRESS":
      return <InProgressRing className={className} />;
    default:
      return <InProgressRing className={className} />;
  }
}
