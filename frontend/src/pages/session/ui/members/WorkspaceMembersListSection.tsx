import { Plus, UserMinus } from "lucide-react";

import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";
import { Button } from "@/shared/ui/button";
import {
  sessionRowHover,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";
import { WorkspaceMemberRow } from "@/pages/session/ui/workspace/WorkspaceMemberRow";
import { cn } from "@/shared/lib/utils";

import { MemberRoleBadge } from "./MemberRoleBadge";

type Member = {
  userId: number;
  name: string;
  role: string;
  isOwner: boolean;
};

type WorkspaceMembersListSectionProps = {
  members: Member[];
  canManage: boolean;
  removePending: boolean;
  onInvite: () => void;
  onRemove: (userId: number, userName: string) => void;
};

export function WorkspaceMembersListSection({
  members,
  canManage,
  removePending,
  onInvite,
  onRemove,
}: WorkspaceMembersListSectionProps) {
  return (
    <section className={cn(sessionSurface, "flex flex-col gap-3 p-4")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">В проекте</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {members.length} участник(ов)
          </p>
        </div>
        {canManage ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={onInvite}
          >
            <Plus className="size-4" />
            Пригласить
          </Button>
        ) : null}
      </div>

      {members.length === 0 ? (
        <p className="text-xs text-muted-foreground">Пока никого</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {members.map((member) => {
            const memberRole = member.role as WorkspaceRole;

            return (
              <li
                key={member.userId}
                className={cn("rounded-xl px-1 py-0.5", sessionRowHover)}
              >
                <WorkspaceMemberRow name={member.name}>
                  <div className="flex items-center gap-1">
                    {member.isOwner ? (
                      <MemberRoleBadge memberRole="OWNER" />
                    ) : (
                      <>
                        <MemberRoleBadge memberRole={memberRole} interactive />
                        {canManage ? (
                          <SessionTooltip label="Удалить из проекта">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="size-7 rounded-full text-muted-foreground hover:text-destructive"
                              aria-label={`Удалить ${member.name}`}
                              disabled={removePending}
                              onClick={() => onRemove(member.userId, member.name)}
                            >
                              <UserMinus className="size-3.5" />
                            </Button>
                          </SessionTooltip>
                        ) : null}
                      </>
                    )}
                  </div>
                </WorkspaceMemberRow>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
