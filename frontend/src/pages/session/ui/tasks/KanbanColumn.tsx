import type { Task } from "@/entities/task/model/types";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { TaskStatusIcon } from "./task-status-icons";
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
  return (
    <section className="session-kanban-column">
      <header className="session-kanban-column-header">
        <TaskStatusIcon status={status} className="size-3.5 shrink-0" />
        <span className="session-kanban-column-title">{label}</span>
        <span className="session-kanban-column-count">{tasks.length}</span>
      </header>

      <div className="session-kanban-column-body session-panel-scroll">
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
