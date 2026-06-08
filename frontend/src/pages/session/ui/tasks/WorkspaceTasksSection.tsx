import {
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { SortableList } from "@/shared/sortable";
import type { Tasks } from "@/entities/task/model/useSessionTasks";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import EmptySession from "./EmptySession";
import TaskTimeline from "./TaskTimeline";
import { SortableTaskRow } from "./SortableTaskRow";
import type { TasksView } from "./sessionWorkspaceTypes";
import { VIEW_LAYOUT } from "./sessionWorkspaceTypes";
import { useState } from "react";

const QUEUE_PREVIEW = 3;

type WorkspaceTasksSectionProps = {
  view: TasksView;
  tasks: Tasks[];
  creating: boolean;
  onOpenCreate: () => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onReorderQueue: (nextQueue: Tasks[]) => void;
  onReorderDone: (nextDone: Tasks[]) => void;
};

export function WorkspaceTasksSection({
  view,
  tasks,
  creating,
  onOpenCreate,
  onToggle,
  onRemove,
  onReorderQueue,
  onReorderDone,
}: WorkspaceTasksSectionProps) {
  const [queueExpanded, setQueueExpanded] = useState(false);

  const doneTasks = tasks.filter((t) => t.done);
  const queueTasks = tasks.filter((t) => !t.done);
  const showEmptyState = tasks.length === 0 && !creating;
  const bothLists = doneTasks.length > 0 && queueTasks.length > 0;

  const sortableListClasses = (variant: TasksView) =>
    cn(VIEW_LAYOUT[variant], variant === "square" && "lg:min-h-0");

  const squareListWrap =
    view === "square" ? "flex min-h-0 flex-1 flex-col" : undefined;

  const queueVisible =
    queueExpanded || queueTasks.length <= QUEUE_PREVIEW
      ? queueTasks
      : queueTasks.slice(0, QUEUE_PREVIEW);

  const showQueueExpandToggle = queueTasks.length > QUEUE_PREVIEW;
  const hiddenQueueCount = queueTasks.length - QUEUE_PREVIEW;

  function handleQueueReorder(nextVisible: Tasks[]) {
    if (queueExpanded || queueTasks.length <= QUEUE_PREVIEW) {
      onReorderQueue(nextVisible);
      return;
    }

    const tail = queueTasks.slice(QUEUE_PREVIEW);
    onReorderQueue([...nextVisible, ...tail]);
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:min-h-0">
      <TaskTimeline tasks={tasks} />

      <div
        className={cn(
          "flex flex-col gap-6",
          !showEmptyState && "min-h-0 flex-1",
        )}
      >
        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center py-16">
            <EmptySession
              titleName="Список задач пуст"
              descriptionName="Добавьте новые задачи"
              action={onOpenCreate}
            />
          </div>
        ) : (
          <>
            {doneTasks.length > 0 && (
              <div
                className={cn(
                  "flex flex-col gap-2",
                  bothLists ? "shrink-0" : "min-h-0 flex-1",
                )}
              >
                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  Выполнено {doneTasks.length}
                </p>
                <SortableList
                  items={doneTasks}
                  onReorder={onReorderDone}
                  wrapperClassName={squareListWrap}
                  className={sortableListClasses(view)}
                >
                  {(task, index) => (
                    <SortableTaskRow
                      key={task.id}
                      task={task}
                      index={index}
                      layout={view}
                      onToggle={onToggle}
                      onRemove={onRemove}
                    />
                  )}
                </SortableList>
              </div>
            )}

            {queueTasks.length > 0 && (
              <div className="flex w-full min-h-0 flex-1 flex-col gap-2">
                <p className="flex shrink-0 flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  <span>В очереди {queueTasks.length}</span>
                </p>
                <div
                  className={cn(
                    "flex flex-col rounded-lg border p-3",
                    view === "square" && "min-h-0 flex-1",
                  )}
                >
                  <div className="flex shrink-0 items-center justify-end gap-0.5">
                    <Button type="button" variant="ghost" size="sm">
                      <Plus />
                    </Button>

                    {showQueueExpandToggle ? (
                      <span className="ml-0.5 flex items-center gap-1 border-l border-border/60 pl-2">
                        {!queueExpanded ? (
                          <span className="select-none text-[10px] font-medium tabular-nums text-muted-foreground">
                            +{hiddenQueueCount}
                          </span>
                        ) : null}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-expanded={queueExpanded}
                          aria-label={
                            queueExpanded
                              ? "Показать меньше задач"
                              : "Показать все задачи"
                          }
                          onClick={() => setQueueExpanded((v) => !v)}
                        >
                          {queueExpanded ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )}
                        </Button>
                      </span>
                    ) : null}
                  </div>
                  <SortableList
                    items={queueVisible}
                    onReorder={handleQueueReorder}
                    wrapperClassName={squareListWrap}
                    className={sortableListClasses(view)}
                  >
                    {(task, index) => (
                      <SortableTaskRow
                        key={task.id}
                        task={task}
                        index={index}
                        layout={view}
                        onToggle={onToggle}
                        onRemove={onRemove}
                      />
                    )}
                  </SortableList>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
