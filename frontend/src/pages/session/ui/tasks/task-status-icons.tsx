import { Ban, CheckCircle2, CircleAlert, CircleDot, PauseCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TaskStatus } from "@/entities/task/model/useSessionTasks";
import type { SubtaskStatus } from "@/shared/constants/subtask-statuses";

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
    case "Выполнено":
      return "text-emerald-500";
    case "Отложено":
      return "text-amber-500";
    case "Issues":
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
    case "Выполнено":
      return <CheckCircle2 className={iconClassName} aria-hidden />;
    case "Отложено":
      return <PauseCircle className={iconClassName} aria-hidden />;
    case "Issues":
      return <CircleAlert className={iconClassName} aria-hidden />;
    case "В очереди":
      return <CircleDot className={iconClassName} aria-hidden />;
    default:
      return <CircleDot className={iconClassName} aria-hidden />;
  }
}

function subtaskStatusIconClass(status: SubtaskStatus) {
  switch (status) {
    case "Выполнено":
      return "text-emerald-500";
    case "Отложено":
      return "text-amber-500";
    case "Отменено":
      return "text-red-500";
    case "В процессе":
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
    case "Выполнено":
      return <CheckCircle2 className={cn("size-4 shrink-0", colorClass, className)} aria-hidden />;
    case "Отложено":
      return <PauseCircle className={cn("size-4 shrink-0", colorClass, className)} aria-hidden />;
    case "Отменено":
      return <Ban className={cn("size-4 shrink-0", colorClass, className)} aria-hidden />;
    case "В процессе":
      return <InProgressRing className={className} />;
    default:
      return <InProgressRing className={className} />;
  }
}
