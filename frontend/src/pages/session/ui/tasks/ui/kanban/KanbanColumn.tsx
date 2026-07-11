import { useDroppable } from "@dnd-kit/core";

import type { Task } from "@/entities/task/model/types";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { cn } from "@/shared/lib/utils";
import { TaskStatusIcon } from "../shared/task-status-icons";
import { KanbanCard } from "./KanbanCard";

type KanbanColumnProps = {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
};

export function KanbanColumn({
  status,
  label,
  tasks,
  onOpenTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  return (
    <section className="session-kanban-column">
      <header className="session-kanban-column-header">
        <TaskStatusIcon status={status} className="size-3.5 shrink-0" />
        <span className="session-kanban-column-title">{label}</span>
        <span className="session-kanban-column-count">{tasks.length}</span>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          "session-kanban-column-body session-panel-scroll",
          isOver && "session-kanban-column--over",
        )}
      >
        {tasks.length === 0 ? (
          <p className="session-kanban-empty">Нет задач</p>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onOpen={onOpenTask} />
          ))
        )}
      </div>
    </section>
  );
}
