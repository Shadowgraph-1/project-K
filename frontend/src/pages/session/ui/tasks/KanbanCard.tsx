import type { KeyboardEvent } from "react";

import { getTaskStatus, type Task } from "@/entities/task/model/types";
import { cn } from "@/shared/lib/utils";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { normalizeTaskPriority, TaskPriorityIcon } from "./task-priority-icons";
import { TaskStatusIcon } from "./task-status-icons";
import { formatShortDate } from "./task-feed";

function formatTaskKey(id: string) {
  const compact = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `K-${compact}`;
}

type KanbanCardProps = {
  task: Task;
  onOpen: (taskId: string) => void;
};

export function KanbanCard({ task, onOpen }: KanbanCardProps) {
  const priority = normalizeTaskPriority(task.tags);
  const status = getTaskStatus(task);
  const dateLabel = task.dueDate ?? task.startDate;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen(task.id);
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(task.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        "session-kanban-card",
        status === "DONE" && "session-kanban-card--done",
      )}
    >
      <div className="session-kanban-card-main">
        <div className="session-kanban-card-content">
          <span className="session-kanban-card-key">{formatTaskKey(task.id)}</span>

          <div className="session-kanban-card-title-row">
            <TaskStatusIcon status={status} className="size-3.5 shrink-0" />
            <span className="session-kanban-card-title">{task.title}</span>
          </div>
        </div>

        {task.creator ? (
          <UserAvatar
            name={task.creator}
            className="session-kanban-card-avatar"
            fallbackClassName="text-[8px]"
          />
        ) : null}
      </div>

      {(priority || dateLabel) && (
        <div className="session-kanban-card-meta">
          {priority ? (
            <TaskPriorityIcon priority={priority} className="size-3.5 shrink-0" />
          ) : null}

          {dateLabel ? (
            <span className="session-kanban-card-date">
              {formatShortDate(dateLabel)}
            </span>
          ) : null}
        </div>
      )}
    </button>
  );
}
