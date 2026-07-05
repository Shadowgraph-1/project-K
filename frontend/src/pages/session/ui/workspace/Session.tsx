import { useMemo } from "react";

import { useWorkspaceTaskStatsQueries } from "@/entities/task/model/use-tasks-query";
import { useLocation, useNavigate } from "react-router-dom";
import { FolderKanban, Plus } from "lucide-react";
import { partitionWorkspaces } from "@/entities/workspace/lib/partition-workspaces";
import {
  useDeleteAllWorkspacesMutation,
  useWorkspaceQuery,
} from "@/entities/workspace/model/use-workspace-query";
import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { Button } from "@/shared/ui/button";
import EmptySession from "./EmptySession";
import { WorkspaceGridSkeleton } from "./WorkspaceGridSkeleton";
import type { WorkspaceTaskStats } from "./WorkspaceCard";
import { WorkspaceListSection } from "./WorkspaceListSection";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { SessionPageHeader } from "../layout/SessionPageHeader";

function Session() {
  const { data: workspaces = [], isLoading } = useWorkspaceQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const deleteAllWorkspaces = useDeleteAllWorkspacesMutation();

  const { owned, shared } = useMemo(
    () => partitionWorkspaces(workspaces),
    [workspaces],
  );

  const workspaceIds = useMemo(
    () => workspaces.map((workspace) => workspace.id),
    [workspaces],
  );
  const taskStatsQueries = useWorkspaceTaskStatsQueries(workspaceIds);
  const taskStatsByWorkspaceId = useMemo(() => {
    const map = new Map<string, WorkspaceTaskStats>();

    workspaces.forEach((workspace, index) => {
      map.set(
        workspace.id,
        taskStatsQueries[index]?.data ?? { total: 0, completed: 0 },
      );
    });

    return map;
  }, [workspaces, taskStatsQueries]);

  async function handleDeleteAllWorkspaces() {
    const confirmed = await notifyConfirm({
      title: "Удалить все проекты?",
      description: "Все ваши проекты и задачи будут удалены без восстановления.",
      confirmLabel: "Удалить всё",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    const ownedPublicKeys = owned.map((workspace) => workspace.publicKey);

    try {
      await deleteAllWorkspaces.mutateAsync();
      notify({ title: "Проекты удалены", variant: "success" });
    } catch {
      notify({
        title: "Ошибка удаления",
        description: "Попробуйте через пару минут",
        variant: "error",
      });
      return;
    }

    if (
      ownedPublicKeys.some(
        (publicKey) =>
          location.pathname === SESSION_PATHS.workspace(publicKey) ||
          location.pathname.startsWith(
            `${SESSION_PATHS.workspace(publicKey)}/`,
          ),
      )
    ) {
      navigate(SESSION_PATHS.sessionRoot);
    }
  }

  if (isLoading) {
    return <WorkspaceGridSkeleton />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {workspaces.length === 0 ? (
        <EmptySession
          titleName="Создайте проект"
          descriptionName="Выберите шаблон или начните с нуля"
          suggestions={[
            {
              title: "Новый проект",
              description: "Задачи, команда и сроки в одном месте",
              icon: <FolderKanban />,
              iconClassName:
                "bg-[#E3F5E8] text-[#1A854D] dark:bg-emerald-500/15 dark:text-emerald-400",
              onClick: () => navigate(SESSION_PATHS.workspaceNew),
            },
          ]}
          footerAction={{
            label: "Создать с нуля",
            onClick: () => navigate(SESSION_PATHS.workspaceNew),
            icon: <Plus className="size-4" />,
          }}
        />
      ) : (
        <>
          <SessionPageHeader title="Проекты" className="pb-4" />
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-auto">
              <WorkspaceListSection
                title="Мои проекты"
                items={owned}
                taskStatsByWorkspaceId={taskStatsByWorkspaceId}
                showColumnHeader={owned.length > 0}
                headerAction={
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-xs ring-1 ring-border/40"
                      onClick={() => navigate(SESSION_PATHS.workspaceNew)}
                    >
                      <Plus className="size-3.5" aria-hidden />
                      Создать проект
                    </Button>
                    {owned.length > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={deleteAllWorkspaces.isPending}
                        onClick={handleDeleteAllWorkspaces}
                        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-xs ring-1 ring-border/40"
                      >
                        Удалить все
                      </Button>
                    ) : null}
                  </div>
                }
              />
              <WorkspaceListSection
                title="Совместная работа"
                items={shared}
                taskStatsByWorkspaceId={taskStatsByWorkspaceId}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Session;
