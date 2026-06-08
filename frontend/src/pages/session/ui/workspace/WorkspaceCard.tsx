import { Box, MoreVertical, Trash2, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { buttonVariants } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  getTaskStatus,
  useSessionTasks,
} from "@/entities/task/model/useSessionTasks";
import { cn } from "@/shared/lib/utils";

import { SESSION_PATHS } from "../../model/sessionPaths";
import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { WORKSPACE_LIST_GRID } from "./workspaceListLayout";
import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";

import {
  useDeleteWorkspaceMutation,
  type Workspace,
} from "@/entities/workspace/model/useWorkspaceStoreQuery";

type WorkspaceCardProps = {
  item: Workspace;
};

function WorkspaceCard({ item }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const deleteWorkspace = useDeleteWorkspaceMutation();
  const removeTasksInWorkspace = useSessionTasks(
    (state) => state.removeTasksInWorkspace,
  );

  const allTasks = useSessionTasks((state) => state.tasks);
  const workspaceTasks = allTasks.filter((t) => t.workspaceId === item.id);
  const total = workspaceTasks.length;
  const completed = workspaceTasks.filter(
    (task) => getTaskStatus(task) === "Выполнено",
  ).length;
  const completionPercent =
    total > 0 ? Math.round((completed / total) * 100) : null;

  const openCollaboration = useCollaborationModalStore((s) => s.openCollaboration);

  const isOwned = item.kind === "owned";
  const canDelete = isOwned && item.myRole === "OWNER";

  const handleOpen = () => {
    navigate(SESSION_PATHS.project(item.id));
  };

  async function handleDelete() {
    const taskHint =
      total > 0
        ? ` В проекте ${total} задач — они тоже будут убраны из списка.`
        : "";

    const confirmed = await notifyConfirm({
      title: "Удалить проект?",
      description: `«${item.title}» будет удалена без возможности восстановления.${taskHint}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await deleteWorkspace.mutateAsync(item.id);
      removeTasksInWorkspace(item.id);
      notify({
        title: "Проект удалён",
        variant: "success",
      });
    } catch {
      notify({
        title: "Ошибка удаления",
        description: "Попробуйте через пару минут",
        variant: "error",
      });
      return;
    }

    if (
      location.pathname === SESSION_PATHS.project(item.id) ||
      location.pathname.startsWith(`${SESSION_PATHS.project(item.id)}/`)
    ) {
      navigate(SESSION_PATHS.sessionRoot);
    }
  }

  return (
    <li
      onClick={handleOpen}
      className={cn(
        WORKSPACE_LIST_GRID,
        "group min-h-12 cursor-pointer border-b border-border/40 px-3 py-2 text-sm transition-colors hover:bg-muted/40",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
          {item.kind === "shared" ? (
            <Users className="size-4" />
          ) : (
            <Box className="size-4" />
          )}
        </span>

        <div className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {item.title}
          </span>

          {item.hint?.trim() ? (
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {item.hint.trim()}
            </span>
          ) : null}
        </div>
      </div>

      <span className="text-sm tabular-nums text-muted-foreground">
        {total > 0 ? total : "—"}
      </span>

      <span className="text-sm tabular-nums text-muted-foreground">
        {completionPercent !== null ? `${completionPercent}%` : "—"}
      </span>

      <div
        className="flex items-center justify-end opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "size-7 text-muted-foreground",
            )}
            aria-label="Действия"
            title="Действия"
          >
            <MoreVertical className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onSelect={() => {
                openCollaboration({
                  workspaceId: item.id,
                  workspaceTitle: item.title,
                  myRole: item.myRole,
                });
              }}
            >
              <Users className="size-4" />
              Участники
            </DropdownMenuItem>
            {canDelete ? (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => void handleDelete()}
              >
                <Trash2 className="size-4" />
                Удалить
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}

export default WorkspaceCard;
