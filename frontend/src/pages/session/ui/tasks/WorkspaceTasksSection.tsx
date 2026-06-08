import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StickyNote } from "lucide-react";
import {
  getTaskStatus,
  type TaskStatus,
  type Tasks,
} from "@/entities/task/model/useSessionTasks";
import EmptySession from "../placeholders/EmptySession";
import TaskTimeline from "./TaskTimeline";
import type { TasksView } from "./sessionWorkspaceTypes";
import { WorkspaceTaskSection } from "./WorkspaceTaskSection";

type WorkspaceTasksSectionProps = {
  view: TasksView;
  tasks: Tasks[];
  creating: boolean;
  isTaskChecked: (task: Tasks) => boolean;
  onToggleTaskChecked: (id: string) => void;
  onOpenCreate?: () => void;
  onRemove: (id: string) => void;
  onOpenTask: (taskId: string) => void;
  workspaceName?: string;
};

type SectionId = "queue" | "done" | "postponed" | "issues";

function TasksEmptyState({ onOpenCreate }: { onOpenCreate?: () => void }) {
  return (
    <EmptySession
      titleName="Список задач пуст"
      descriptionName={
        onOpenCreate
          ? "Добавьте первую задачу, чтобы собрать очередь, сроки и прогресс в одном месте"
          : "В этом проекте пока нет задач"
      }
      action={onOpenCreate}
      buttonName={onOpenCreate ? "Создать задачу" : undefined}
      icon={<StickyNote />}
    />
  );
}

export function WorkspaceTasksSection({
  view,
  tasks,
  creating,
  isTaskChecked,
  onToggleTaskChecked,
  onOpenCreate,
  onRemove,
  onOpenTask,
  workspaceName,
}: WorkspaceTasksSectionProps) {
  const [manualCollapsed, setManualCollapsed] = useState<
    Partial<Record<SectionId, true>>
  >({});

  const byStatus = useCallback(
    (status: TaskStatus) => tasks.filter((t) => getTaskStatus(t) === status),
    [tasks],
  );

  const queueTasks = useMemo(() => byStatus("В очереди"), [byStatus]);
  const doneTasks = useMemo(() => byStatus("Выполнено"), [byStatus]);
  const postponedTasks = useMemo(() => byStatus("Отложено"), [byStatus]);
  const issuesTasks = useMemo(() => byStatus("Issues"), [byStatus]);

  const sectionCounts = useMemo(
    () => ({
      queue: queueTasks.length,
      done: doneTasks.length,
      postponed: postponedTasks.length,
      issues: issuesTasks.length,
    }),
    [
      queueTasks.length,
      doneTasks.length,
      postponedTasks.length,
      issuesTasks.length,
    ],
  );

  const countsKey = `${sectionCounts.queue}-${sectionCounts.done}-${sectionCounts.postponed}-${sectionCounts.issues}`;
  const prevCountsKeyRef = useRef(countsKey);

  useEffect(() => {
    if (prevCountsKeyRef.current === countsKey) return;
    prevCountsKeyRef.current = countsKey;
    setManualCollapsed({});
  }, [countsKey]);

  const expanded = useMemo(
    () => ({
      queue: sectionCounts.queue > 0 && !manualCollapsed.queue,
      done: sectionCounts.done > 0 && !manualCollapsed.done,
      postponed: sectionCounts.postponed > 0 && !manualCollapsed.postponed,
      issues: sectionCounts.issues > 0 && !manualCollapsed.issues,
    }),
    [sectionCounts, manualCollapsed],
  );

  const showEmptyState = tasks.length === 0 && !creating;

  const toggleSection = useCallback(
    (id: SectionId) => {
      if (sectionCounts[id] === 0) return;
      setManualCollapsed((prev) => {
        const isOpen = !prev[id];
        if (isOpen) return { ...prev, [id]: true };
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [sectionCounts],
  );

  const sections = [
    { id: "queue" as const, title: "В очереди", tasks: queueTasks },
    { id: "done" as const, title: "Выполнено", tasks: doneTasks },
    { id: "postponed" as const, title: "Отложено", tasks: postponedTasks },
    { id: "issues" as const, title: "Issues", tasks: issuesTasks },
  ];

  if (view === "timeline") {
    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:min-h-0">
        {showEmptyState ? (
          <TasksEmptyState onOpenCreate={onOpenCreate} />
        ) : (
          <TaskTimeline tasks={tasks} />
        )}
      </section>
    );
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:min-h-0">
      <div
        className={
          showEmptyState ? "flex flex-col gap-4" : "flex min-h-0 flex-1 flex-col gap-4"
        }
      >
        {showEmptyState ? (
          <TasksEmptyState onOpenCreate={onOpenCreate} />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {sections.map(({ id, title, tasks: sectionTasks }) => (
              <WorkspaceTaskSection
                key={id}
                title={title}
                tasks={sectionTasks}
                expanded={expanded[id]}
                onToggleExpanded={() => toggleSection(id)}
                onRemoveTask={onRemove}
                isTaskChecked={isTaskChecked}
                onToggleTaskChecked={onToggleTaskChecked}
                onOpenTask={onOpenTask}
                workspaceName={workspaceName}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
