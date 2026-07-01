import { Box, MoreVertical, Trash2, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { buttonVariants } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { getTaskStatus } from "@/entities/task/model/types";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "../../lib/session-styles";
import { SessionTooltip } from "../layout/SessionTooltip";

import { SESSION_PATHS } from "../../model/sessionPaths";
import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { WORKSPACE_LIST_GRID } from "./workspaceListLayout";
import { useDeleteWorkspaceMutation } from "@/entities/workspace/model/use-workspace-query";
import type { Workspace } from "@/entities/workspace/model/workspace";
import { useTasksQuery } from "@/entities/task/model/use-tasks-query";

type WorkspaceCardProps = {
  item: Workspace;
};

function WorkspaceCard({ item }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const deleteWorkspace = useDeleteWorkspaceMutation();
  
  const { data: workspaceTasks = [] } = useTasksQuery(item.id);
  const total = workspaceTasks.length;
  const completed = workspaceTasks.filter(
    (task) => getTaskStatus(task) === "DONE",
  ).length;
  const completionPercent =
    total > 0 ? Math.round((completed / total) * 100) : null;

  const isOwned = item.kind === "owned";
  const canDelete = isOwned && item.myRole === "OWNER";

  const handleOpen = () => {
    navigate(SESSION_PATHS.workspace(item.publicKey));
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
      location.pathname === SESSION_PATHS.workspace(item.publicKey) ||
      location.pathname.startsWith(`${SESSION_PATHS.workspace(item.publicKey)}/`)
    ) {
      navigate(SESSION_PATHS.sessionRoot);
    }
  }

  return (
    <li
      onClick={handleOpen}
      className={cn(
        WORKSPACE_LIST_GRID,
        "group min-h-12 cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-background/45",
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

      {canDelete ? (
        <div
          className="flex items-center justify-end opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenu>
            <SessionTooltip label="Действия">
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "size-7",
                  sessionToolbarIconButton,
                )}
                aria-label="Действия"
              >
                <MoreVertical className="size-3.5" />
              </DropdownMenuTrigger>
            </SessionTooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => void handleDelete()}
              >
                <Trash2 className="size-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <span aria-hidden />
      )}
    </li>
  );
}

export default WorkspaceCard;
