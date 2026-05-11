import { useCallback, useState, memo } from "react";
import { useParams } from "react-router-dom";
import {
  useSessionTasks,
  type Tasks,
} from "@/entities/task/model/useSessionTasks";
import WorkspaceTaskSubheader from "./Workspacetasksubheader";
import { CreateTaskModal } from "./CreateTaskModal";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import {
  resolveCreatorField,
  suggestedCreatorLabel,
} from "./sessionWorkspaceUtils";
import type { TasksView } from "./sessionWorkspaceTypes";
import { WorkspaceTasksSection } from "./WorkspaceTasksSection";
import { SessionWorkspaceSidebar } from "./SessionWorkspaceSidebar";

export type { TasksView } from "./sessionWorkspaceTypes";

type SessionWorkspaceProps = {
  modelIndex?: number;
  character: string;
  onCharacterChange: (id: string) => void;
};

function SessionWorkspace({
  modelIndex = 0,
  character,
  onCharacterChange,
}: SessionWorkspaceProps) {
  const [creating, setCreating] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [view, setView] = useState<TasksView>("line");

  const openCreateModal = useCallback(() => {
    setCreateModalKey((k) => k + 1);
    setCreating(true);
  }, []);

  const { cardId } = useParams();

  const allTasks = useSessionTasks((state) => state.tasks);
  const tasks = allTasks.filter((t) => t.workspaceId === cardId);
  const addTask = useSessionTasks((state) => state.addTask);
  const toggleTask = useSessionTasks((state) => state.toggleTask);
  const removeTask = useSessionTasks((state) => state.removeTask);
  const reorderTask = useSessionTasks((state) => state.reorderTask);
  const user = useAuthStore((state) => state.user);

  const doneTasks = tasks.filter((t) => t.done);
  const queueTasks = tasks.filter((t) => !t.done);

  function handleReorderQueue(nextQueue: Tasks[]) {
    reorderTask([...nextQueue, ...doneTasks]);
  }
  function handleReorderDone(nextDone: Tasks[]) {
    reorderTask([...queueTasks, ...nextDone]);
  }

  return (
    <div className="relative flex w-full flex-col gap-3 pb-4">
      <WorkspaceTaskSubheader
        className="shrink-0"
        view={view}
        onViewChange={setView}
        doneCount={doneTasks.length}
        totalCount={tasks.length}
        onCreate={openCreateModal}
      />

      <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <WorkspaceTasksSection
          view={view}
          tasks={tasks}
          creating={creating}
          onOpenCreate={openCreateModal}
          onToggle={toggleTask}
          onRemove={removeTask}
          onReorderQueue={handleReorderQueue}
          onReorderDone={handleReorderDone}
        />

        <SessionWorkspaceSidebar
          modelIndex={modelIndex}
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </div>

      <CreateTaskModal
        key={createModalKey}
        open={creating}
        onOpenChange={setCreating}
        defaultCreator={suggestedCreatorLabel(user)}
        onSubmit={(payload) => {
          addTask({
            id: Date.now().toString(),
            workspaceId: cardId ?? "",
            done: false,
            ...payload,
            creator: resolveCreatorField(payload.creator, user),
          });
        }}
      />
    </div>
  );
}

export default memo(SessionWorkspace);
