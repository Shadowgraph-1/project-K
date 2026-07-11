import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import { useTaskStatusHistoryQuery } from "@/entities/task/model/use-task-status-history-query";
import { TaskStatusIcon } from "../shared/task-status-icons";
import { formatShortDate } from "../../lib/format-activity-date";
import {
  taskDetailSectionHeader,
  taskDetailSectionLabel,
} from "./task-details-ui";

type TaskStatusHistoryTimelineProps = {
  taskId: string;
};

function StatusHistoryRow({
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
  const statusLabel = TASK_STATUS_LABELS[status];
  const author = userName?.trim() || null;

  return (
    <li className="relative flex gap-3">
      <div className="relative flex w-4 shrink-0 flex-col items-center">
        <span
          className={cn(
            "relative z-10 mt-0.5 flex size-4 items-center justify-center",
            isLast ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <TaskStatusIcon status={status} className="size-3.5 shrink-0" />
        </span>
        {!isLast ? (
          <span aria-hidden className="mt-1 w-px flex-1 bg-border/70" />
        ) : null}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-3")}>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-[13px] leading-5">
          <span
            className={cn(
              isLast ? "font-medium text-foreground" : "text-foreground/85",
            )}
          >
            {statusLabel}
          </span>
          {author ? (
            <>
              <span className="text-muted-foreground/40" aria-hidden>
                ·
              </span>
              <span className="truncate font-semibold text-foreground">
                {author}
              </span>
            </>
          ) : null}
        </div>
        {dateLabel ? (
          <time className="mt-0.5 block text-[11px] tabular-nums leading-none text-muted-foreground/55">
            {dateLabel}
          </time>
        ) : null}
      </div>
    </li>
  );
}

export function TaskStatusHistoryTimeline({
  taskId,
}: TaskStatusHistoryTimelineProps) {
  const { data: history = [], isLoading } = useTaskStatusHistoryQuery(taskId);
  const [expanded, setExpanded] = useState(false);

  if (isLoading || history.length <= 1) return null;

  return (
    <section>
      <div className={taskDetailSectionHeader}>
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md py-0.5 pr-1 text-left transition-colors hover:text-foreground"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                expanded && "rotate-90",
              )}
              aria-hidden
            />
            <span className={taskDetailSectionLabel}>История статуса</span>
          </button>
          <span className="text-[13px] tabular-nums text-muted-foreground">
            {history.length}
          </span>
        </div>
      </div>

      {expanded ? (
        <ol className="flex flex-col" aria-label="История статусов">
          {history.map((entry, index) => (
            <StatusHistoryRow
              key={entry.id}
              status={entry.toStatus}
              changedAt={entry.changedAt}
              userName={entry.userName}
              isLast={index === history.length - 1}
            />
          ))}
        </ol>
      ) : null}
    </section>
  );
}
