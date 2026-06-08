import { useMemo } from "react";
import { Box, ChevronRight, Users } from "lucide-react";

import type { Workspace } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import { partitionWorkspaces } from "@/entities/workspace/lib/partition-workspaces";
import type { Tasks } from "@/entities/task/model/useSessionTasks";

import { WorkspaceHubGroup } from "./WorkspaceListSection";
import { Button } from "@/shared/ui/button";

type WorkspaceHubPickerProps = {
  workspaces: Workspace[];
  allTasks: Tasks[];
  onSelect: (workspaceId: string) => void;
};

export function WorkspaceHubPicker({
  workspaces,
  allTasks,
  onSelect,
}: WorkspaceHubPickerProps) {
  const { owned, shared } = useMemo(
    () => partitionWorkspaces(workspaces),
    [workspaces],
  );

  function renderWorkspaceButton(ws: Workspace) {
    const taskCount = allTasks.filter((t) => t.workspaceId === ws.id).length;

    return (
      <Button
        key={ws.id}
        type="button"
        variant="ghost"
        className="flex h-auto w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/25 px-4 py-3 text-left hover:bg-muted/40"
        onClick={() => onSelect(ws.id)}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
            {ws.kind === "shared" ? (
              <Users className="size-4" aria-hidden />
            ) : (
              <Box className="size-4" aria-hidden />
            )}
          </span>
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {ws.title}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 tabular-nums text-xs text-muted-foreground">
          {taskCount}
          <ChevronRight className="size-4" aria-hidden />
        </span>
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-muted-foreground">Выберите проект</p>
      <WorkspaceHubGroup
        title="Мои проекты"
        items={owned}
        renderItem={renderWorkspaceButton}
      />
      <WorkspaceHubGroup
        title="Совместная работа"
        description="Проекты, куда вас пригласили"
        items={shared}
        renderItem={renderWorkspaceButton}
      />
    </div>
  );
}
