import type { KeyboardEvent } from "react";
import { useDraggable } from "@dnd-kit/core";

import { getTaskStatus, type Task } from "@/entities/task/model/types";
import { cn } from "@/shared/lib/utils";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { normalizeTaskPriority, TaskPriorityIcon } from "./task-priority-icons";
import { TaskStatusIcon } from "./task-status-icons";

function formatTaskKey(id: string) {
  const compact = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `K-${compact}`;
}

type KanbanCardProps = {
  task: Task;
  onOpen?: (taskId: string) => void;
  overlay?: boolean;
};

export function KanbanCard({ task, onOpen, overlay = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { taskId: task.id },
    disabled: overlay,
  });

  const priority = normalizeTaskPriority(task.tags);
  const status = getTaskStatus(task);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen?.(task.id);
  };

  const className = cn(
    "session-kanban-card",
    status === "DONE" && "session-kanban-card--done",
    overlay && "session-kanban-card--overlay",
    isDragging && !overlay && "session-kanban-card--dragging",
  );

  const content = (
    <>
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

      {priority ? (
        <div className="session-kanban-card-meta">
          <TaskPriorityIcon priority={priority} className="size-3.5 shrink-0" />
        </div>
      ) : null}
    </>
  );

  if (overlay) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      onClick={() => onOpen?.(task.id)}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {content}
    </button>
  );
}
