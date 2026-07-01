import { Users } from "lucide-react";

import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";
import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  toolbarIslandItemClass,
  toolbarIslandIconButtonClass,
} from "../layout/ToolbarIsland";
import { SessionTooltip } from "../layout/SessionTooltip";

type CollaborationButtonProps = {
  workspaceId?: string;
  workspaceTitle?: string;
  myRole?: WorkspaceRole;
  /** island — пункт внутри ToolbarIsland; icon — в шапке */
  variant?: "island" | "icon";
  className?: string;
};

export function CollaborationButton({
  workspaceId,
  workspaceTitle,
  myRole,
  variant = "icon",
  className,
}: CollaborationButtonProps) {
  const openCollaboration = useCollaborationModalStore((s) => s.openCollaboration);

  const handleClick = () => {
    openCollaboration({
      workspaceId,
      workspaceTitle,
      myRole,
    });
  };

  if (variant === "island") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(toolbarIslandItemClass, className)}
        onClick={handleClick}
      >
        <Users className="size-3.5 shrink-0" aria-hidden />
        <span>Участники</span>
      </Button>
    );
  }

  return (
    <SessionTooltip label="Участники">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(toolbarIslandIconButtonClass, className)}
        aria-label="Участники проекта"
        onClick={handleClick}
      >
        <Users className="size-3.5" aria-hidden />
      </Button>
    </SessionTooltip>
  );
}
