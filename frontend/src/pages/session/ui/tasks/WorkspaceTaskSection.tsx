import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { Task } from "@/entities/task/model/types";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TaskRow } from "./TaskRow";
import { TASK_LIST_LAYOUT } from "./sessionWorkspaceTypes";

export type WorkspaceTaskSectionProps = {
  title: string;
  tasks: Task[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onRemoveTask: (id: string) => void;
  isTaskChecked: (task: Task) => boolean;
  onToggleTaskChecked: (id: string) => void;
  onOpenTask: (taskId: string) => void;
  headerActions?: ReactNode;
};

export function WorkspaceTaskSection({
  title,
  tasks,
  expanded,
  onToggleExpanded,
  onRemoveTask,
  isTaskChecked,
  onToggleTaskChecked,
  onOpenTask,
  headerActions,
}: WorkspaceTaskSectionProps) {
  return (
    <section className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-muted/40 p-0.5 ring-1 ring-border/30 transition-colors hover:bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto min-w-0 flex-1 items-center justify-start gap-0.5 rounded-md px-0 py-0 text-left hover:bg-transparent"
          aria-expanded={expanded}
          onClick={onToggleExpanded}
        >
          <span className="flex size-7 shrink-0 items-center justify-center text-muted-foreground/70">
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
          </span>
          <span className="text-[13px] font-medium tracking-tight text-foreground/90">
            {title}
            <span className="ml-1.5 text-[11px] font-normal tabular-nums text-muted-foreground/50">
              {tasks.length}
            </span>
          </span>
        </Button>

        {headerActions ? (
          <div
            className="flex shrink-0 items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {headerActions}
          </div>
        ) : null}
      </div>

      {expanded && tasks.length > 0 ? (
        <ul className={TASK_LIST_LAYOUT}>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isChecked={isTaskChecked(task)}
              onToggleChecked={onToggleTaskChecked}
              onRemove={onRemoveTask}
              onOpen={onOpenTask}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
