import { cn } from "@/shared/lib/utils";
import {
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import { useTaskStatusHistoryQuery } from "@/entities/task/model/use-task-status-history-query";
import { TaskStatusIcon } from "../task-status-icons";
import { formatShortDate } from "../task-feed/format-activity-date";
import { SessionTooltip } from "../../layout/SessionTooltip";

type TaskStatusHistoryTimelineProps = {
  taskId: string;
};

function StatusNode({
  status,
  changedAt,
  userName,
  isLast,
}: {
  status: TaskStatus;
  changedAt: string;
  userName: string | null;
  isLast: boolean;
}) {
  const dateLabel = formatShortDate(changedAt);
  const tooltipParts = [
    TASK_STATUS_LABELS[status],
    dateLabel,
    userName ? userName : null,
  ].filter(Boolean);

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <SessionTooltip label={tooltipParts.join(" · ")}>
        <span
          className={cn(
            "inline-flex flex-col items-center gap-0.5",
            isLast ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <TaskStatusIcon status={status} className="size-3.5 shrink-0" />
          <span className="text-[10px] tabular-nums leading-none">{dateLabel}</span>
        </span>
      </SessionTooltip>
      {!isLast ? (
        <span
          aria-hidden
          className="mx-0.5 h-px w-4 shrink-0 bg-border/80 sm:w-6"
        />
      ) : null}
    </div>
  );
}

export function TaskStatusHistoryTimeline({
  taskId,
}: TaskStatusHistoryTimelineProps) {
  const { data: history = [], isLoading } = useTaskStatusHistoryQuery(taskId);

  if (isLoading || history.length <= 1) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-foreground">История статуса</h2>
      <div
        className="flex flex-wrap items-center gap-y-1"
        aria-label="История статусов"
      >
      {history.map((entry, index) => (
        <StatusNode
          key={entry.id}
          status={entry.toStatus}
          changedAt={entry.changedAt}
          userName={entry.userName}
          isLast={index === history.length - 1}
        />
      ))}
      </div>
    </section>
  );
}
