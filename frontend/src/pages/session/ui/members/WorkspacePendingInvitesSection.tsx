import { UserMinus } from "lucide-react";

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

type PendingInvite = {
  id: string;
  name: string;
  role: string;
};

type WorkspacePendingInvitesSectionProps = {
  invites: PendingInvite[];
};

export function WorkspacePendingInvitesSection({
  invites,
}: WorkspacePendingInvitesSectionProps) {
  return (
    <section className={cn(sessionSurface, "flex flex-col gap-3 p-4")}>
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Ожидают ответа
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Приглашения, которые ещё не приняли
        </p>
      </div>

      {invites.length === 0 ? (
        <p className="text-xs text-muted-foreground">Нет активных приглашений</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className={cn("rounded-xl px-1 py-0.5", sessionRowHover)}
            >
              <WorkspaceMemberRow name={invite.name} muted>
                <div className="flex items-center gap-1">
                  <MemberRoleBadge
                    memberRole={invite.role as WorkspaceRole}
                    interactive
                  />
                  <SessionTooltip label="Отменить приглашение">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-7 rounded-md text-muted-foreground hover:text-destructive"
                      aria-label="Отменить приглашение"
                    >
                      <UserMinus className="size-3.5" />
                    </Button>
                  </SessionTooltip>
                </div>
              </WorkspaceMemberRow>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
