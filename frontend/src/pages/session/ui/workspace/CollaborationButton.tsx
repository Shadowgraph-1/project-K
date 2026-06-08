import { Users } from "lucide-react";



import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";

import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";

import { Button } from "@/shared/ui/button";

import { cn } from "@/shared/lib/utils";

import { toolbarIslandItemClass } from "../layout/ToolbarIsland";



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

        title="Пригласить участников"

        onClick={handleClick}

      >

        <Users className="size-3.5 shrink-0" aria-hidden />

        <span>Участники</span>

      </Button>

    );

  }



  return (

    <Button

      type="button"

      variant="ghost"

      size="icon-sm"

      className={cn(

        "size-7 shrink-0 rounded-none text-muted-foreground hover:bg-accent hover:text-accent-foreground",

        className,

      )}

      aria-label="Участники проекта"

      title="Участники"

      onClick={handleClick}

    >

      <Users className="size-3.5" aria-hidden />

    </Button>

  );

}

