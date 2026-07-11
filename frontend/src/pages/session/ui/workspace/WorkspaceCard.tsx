import { memo, type KeyboardEvent } from "react";
import { Box, MoreVertical, Trash2, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { isUnderWorkspacePath } from "../../lib/workspace-route";

import { buttonVariants } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "../../lib/session-styles";
import { SessionTooltip } from "../layout/SessionTooltip";

import { SESSION_PATHS } from "../../model/sessionPaths";
import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { WORKSPACE_LIST_GRID } from "./workspaceListLayout";
import { useDeleteWorkspaceMutation } from "@/entities/workspace/model/use-workspace-query";
import type { Workspace } from "@/entities/workspace/model/workspace";

export type WorkspaceTaskStats = {
  total: number;
  completed: number;
};

type WorkspaceCardProps = {
  item: Workspace;
  taskStats: WorkspaceTaskStats;
};

function WorkspaceCard({ item, taskStats }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const deleteWorkspace = useDeleteWorkspaceMutation();

  const { total, completed } = taskStats;
  const completionPercent =
    total > 0 ? Math.round((completed / total) * 100) : null;

  const isOwned = item.kind === "owned";
  const canDelete = isOwned && item.myRole === "OWNER";

  const handleOpen = () => {
    navigate(SESSION_PATHS.workspace(item.publicKey));
  };

  const handleOpenKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleOpen();
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

    if (isUnderWorkspacePath(location.pathname, item.publicKey)) {
      navigate(SESSION_PATHS.sessionRoot);
    }
  }

  return (
    <li
      className={cn(
        WORKSPACE_LIST_GRID,
        "group relative min-h-11 cursor-pointer px-4 py-2.5 text-sm transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
      )}
      tabIndex={0}
      role="button"
      aria-label={`Открыть проект ${item.title}`}
      onClick={handleOpen}
      onKeyDown={handleOpenKeyDown}
    >
      <div className="relative flex min-w-0 items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
          {item.kind === "shared" ? (
            <Users className="size-3.5" aria-hidden />
          ) : (
            <Box className="size-3.5" aria-hidden />
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

      <span className="relative hidden text-right text-sm tabular-nums text-muted-foreground sm:block">
        {total > 0 ? total : "—"}
      </span>

      <div className="relative hidden sm:block">
        {completionPercent !== null ? (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs tabular-nums text-muted-foreground">
              {completionPercent}%
            </span>
            <div
              className="h-1 w-full max-w-[5.5rem] overflow-hidden rounded-full bg-emerald-500/15"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="block text-right text-sm tabular-nums text-muted-foreground">
            —
          </span>
        )}
      </div>

      <span className="relative text-xs tabular-nums text-muted-foreground sm:hidden">
        {total > 0
          ? completionPercent !== null
            ? `${completionPercent}% · ${total}`
            : `${total}`
          : "—"}
      </span>

      {canDelete ? (
        <div
          className="relative flex items-center justify-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
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
        <span className="hidden sm:block" aria-hidden />
      )}
    </li>
  );
}

export default memo(WorkspaceCard);
