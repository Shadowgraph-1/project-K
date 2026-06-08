import { useState } from "react";
import axios from "axios";
import { ChevronDown, LogOut, Plus, UserMinus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  useInvalidateWorkspaceMembers,
  useLeaveWorkspaceMutation,
  useRemoveWorkspaceMemberMutation,
  useUpdateWorkspaceMemberRoleMutation,
  useWorkspaceMembersQuery,
} from "@/entities/workspace/model/useWorkspaceMembersQuery";
import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import {
  canPerformWorkspaceAction,
  type WorkspaceRole,
} from "@/shared/lib/workspace-permissions";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { notify } from "@/shared/lib/notify";
import { Button } from "@/shared/ui/button";
import { KonoLoader } from "@/shared/ui/kono-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { WorkspaceMemberRow } from "./WorkspaceMemberRow";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: "Владелец",
  ADMIN: "Админ",
  EDITOR: "Редактор",
  COMMENTER: "Комментатор",
  VIEWER: "Наблюдатель",
};

const ASSIGNABLE_ROLES: WorkspaceRole[] = [
  "ADMIN",
  "EDITOR",
  "COMMENTER",
  "VIEWER",
];

function apiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error) && typeof error.response?.data?.error === "string") {
    return error.response.data.error;
  }
  return fallback;
}

function MemberRoleBadge({
  role,
  interactive = false,
}: {
  role: WorkspaceRole;
  interactive?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-[7.5rem] items-center px-2 text-[11px] font-medium text-muted-foreground",
        interactive
          ? "justify-between gap-1 rounded-md border border-border bg-muted/40"
          : "justify-center rounded-md border border-border/60 bg-muted/25",
      )}
    >
      {ROLE_LABELS[role]}
      {interactive ? <ChevronDown className="size-3 opacity-60" aria-hidden /> : null}
    </span>
  );
}

function MemberRoleSelect({
  role,
  disabled,
  onSelectRole,
}: {
  role: WorkspaceRole;
  disabled?: boolean;
  onSelectRole: (role: WorkspaceRole) => void;
}) {
  if (disabled) {
    return <MemberRoleBadge role={role} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MemberRoleBadge role={role} interactive />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem] p-1">
        {ASSIGNABLE_ROLES.map((option) => (
          <DropdownMenuItem
            key={option}
            className="cursor-pointer text-sm"
            disabled={option === role}
            onSelect={() => onSelectRole(option)}
          >
            {ROLE_LABELS[option]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type WorkspaceMembersPanelProps = {
  workspaceId: string;
  workspaceTitle?: string;
  onLeaveSuccess?: () => void;
};

export function WorkspaceMembersPanel({
  workspaceId,
  workspaceTitle,
  onLeaveSuccess,
}: WorkspaceMembersPanelProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: workspaces = [] } = useWorkspaceQuery();
  const invalidateMembers = useInvalidateWorkspaceMembers();

  const { data, isLoading: membersLoading } = useWorkspaceMembersQuery(workspaceId);
  const removeMember = useRemoveWorkspaceMemberMutation(workspaceId);
  const updateRole = useUpdateWorkspaceMemberRoleMutation(workspaceId);
  const leaveWorkspace = useLeaveWorkspaceMutation();

  const members = data?.members ?? [];
  const pendingInvites = data?.pendingInvites ?? [];

  const resolvedWorkspace = workspaces.find((w) => w.id === workspaceId);
  const effectiveTitle = workspaceTitle ?? resolvedWorkspace?.title ?? "Проект";
  const myRole = resolvedWorkspace?.myRole;
  const canManage =
    Boolean(workspaceId) &&
    canPerformWorkspaceAction(myRole, "manage_members");
  const canLeave = resolvedWorkspace?.kind === "shared";

  async function handleRemoveMember(userId: number, name: string) {
    const confirmed = await notifyConfirm({
      title: `Удалить ${name}?`,
      description: "Участник потеряет доступ к проекту.",
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await removeMember.mutateAsync(userId);
      notify({
        title: "Участник удалён",
        description: `${name} больше не в проекте`,
        variant: "success",
      });
    } catch (error) {
      notify({
        title: "Не удалось удалить",
        description: apiErrorMessage(error, "Попробуйте позже"),
        variant: "error",
      });
    }
  }

  async function handleRoleChange(userId: number, name: string, role: WorkspaceRole) {
    try {
      await updateRole.mutateAsync({ userId, role });
      notify({
        title: "Роль обновлена",
        description: `${name} — ${ROLE_LABELS[role]}`,
        variant: "success",
      });
    } catch (error) {
      notify({
        title: "Не удалось сменить роль",
        description: apiErrorMessage(error, "Попробуйте позже"),
        variant: "error",
      });
    }
  }

  async function handleLeave() {
    const confirmed = await notifyConfirm({
      title: `Выйти из «${effectiveTitle}»?`,
      description: "Вы потеряете доступ к задачам этого проекта.",
      confirmLabel: "Выйти",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await leaveWorkspace.mutateAsync(workspaceId);
      onLeaveSuccess?.();
      if (
        pathname === SESSION_PATHS.project(workspaceId) ||
        pathname.startsWith(`${SESSION_PATHS.project(workspaceId)}/`)
      ) {
        navigate(SESSION_PATHS.sessionRoot);
      }
      notify({
        title: "Вы вышли из проекта",
        description: `«${effectiveTitle}» больше не в вашем списке`,
        variant: "success",
      });
    } catch (error) {
      notify({
        title: "Не удалось выйти",
        description: apiErrorMessage(error, "Попробуйте позже"),
        variant: "error",
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {canManage ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={() => setInviteOpen(true)}
          >
            <Plus className="size-4" />
            Пригласить участника
          </Button>
        ) : null}

        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">В проекте</h3>
            <p className="text-xs text-muted-foreground">
              {members.length} участник(ов)
            </p>
          </div>

          {membersLoading ? (
            <div className="py-8">
              <KonoLoader size="sm" hint="участники" />
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground">Пока никого</p>
          ) : (
            <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto rounded-md border border-border/60 p-1">
              {members.map((member) => (
                <li
                  key={member.userId}
                  className="rounded-md px-1 py-0.5 transition-colors hover:bg-muted/50"
                >
                  <WorkspaceMemberRow
                    name={member.name}
                    trailing={
                      <div className="flex items-center gap-1">
                        {member.isOwner ? (
                          <MemberRoleBadge role="OWNER" />
                        ) : (
                          <>
                            <MemberRoleSelect
                              role={member.role as WorkspaceRole}
                              disabled={!canManage || updateRole.isPending}
                              onSelectRole={(role) =>
                                void handleRoleChange(
                                  member.userId,
                                  member.name,
                                  role,
                                )
                              }
                            />
                            {canManage ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-7 text-muted-foreground hover:text-destructive"
                                aria-label={`Удалить ${member.name}`}
                                title="Удалить из проекта"
                                disabled={removeMember.isPending}
                                onClick={() =>
                                  void handleRemoveMember(
                                    member.userId,
                                    member.name,
                                  )
                                }
                              >
                                <UserMinus className="size-3.5" />
                              </Button>
                            ) : null}
                          </>
                        )}
                      </div>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {canManage && pendingInvites.length > 0 ? (
          <div className="space-y-2 border-t border-border pt-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Ожидают ответа
              </h3>
              <p className="text-xs text-muted-foreground">
                Приглашения, которые ещё не приняли
              </p>
            </div>
            <ul className="flex flex-col gap-0.5">
              {pendingInvites.map((invite) => (
                <li
                  key={invite.id}
                  className="rounded-md px-1 py-0.5 hover:bg-muted/40"
                >
                  <WorkspaceMemberRow
                    name={invite.name}
                    muted
                    trailing={
                      <MemberRoleBadge role={invite.role as WorkspaceRole} />
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {canLeave ? (
          <div className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-destructive hover:text-destructive"
              disabled={leaveWorkspace.isPending}
              onClick={() => void handleLeave()}
            >
              <LogOut className="size-4" />
              Выйти из проекта
            </Button>
          </div>
        ) : null}
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        workspaceId={workspaceId}
        workspaceTitle={effectiveTitle}
        onInvited={() => invalidateMembers(workspaceId)}
      />
    </>
  );
}
