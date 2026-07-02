import { Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Workspace } from "@/entities/workspace/model/workspace";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { SessionPageHeader } from "@/pages/session/ui/layout/SessionPageHeader";
import {
  sessionField,
} from "@/pages/session/lib/session-styles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

type WorkspaceMembersHeaderProps = {
  workspaces: Workspace[];
  publicKey: string;
  workspaceTitle: string;
};

export function WorkspaceMembersHeader({
  workspaces,
  publicKey,
  workspaceTitle,
}: WorkspaceMembersHeaderProps) {
  const navigate = useNavigate();

  return (
    <SessionPageHeader title="Участники">
      {workspaces.length > 0 ? (
        <div className="mt-3 flex max-w-sm flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Проект</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                sessionField,
                "flex h-9 w-full items-center justify-between gap-2 px-3 text-sm",
              )}
            >
              <span className="truncate">{workspaceTitle}</span>
              <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-64 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
            >
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="cursor-pointer"
                  onSelect={() =>
                    navigate(SESSION_PATHS.workspaceMembers(workspace.publicKey))
                  }
                >
                  <span className="truncate">{workspace.title}</span>
                  {workspace.publicKey === publicKey ? (
                    <Check className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Проект «{workspaceTitle}» · роли, приглашения и доступ
        </p>
      )}
    </SessionPageHeader>
  );
}
