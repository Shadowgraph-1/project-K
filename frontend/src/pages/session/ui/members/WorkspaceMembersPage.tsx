import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronDown, LogOut, Plus, UserMinus } from "lucide-react";

import {
  canPerformWorkspaceAction,
  type WorkspaceRole,
} from "@/shared/lib/workspace-permissions";
import { notify } from "@/shared/lib/notify";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { SESSION_PATHS, parseWorkspaceParams } from "../../model/sessionPaths";
import { InviteMemberDialog } from "../workspace/InviteMemberDialog";
import { WorkspaceMemberRow } from "../workspace/WorkspaceMemberRow";
import EmptySession from "../placeholders/EmptySession";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import { findWorkspaceByPublicKey } from "@/entities/workspace/lib/resolve-workspace";
import {
  useInvalidateWorkspaceMembers,
  useLeaveWorkspaceMutation,
  useRemoveWorkspaceMemberMutation,
  useWorkspaceMembersQuery,
} from "@/entities/workspace/model/use-workspace-members-query";
import { KonoLoader } from "@/shared/ui/kono-loader";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import {
  sessionField,
  sessionPillOutline,
  sessionRowHover,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import { SessionPageHeader } from "@/pages/session/ui/layout/SessionPageHeader";
import { SessionTooltip } from "@/pages/session/ui/layout/SessionTooltip";
import { cn } from "@/shared/lib/utils";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: "Владелец",
  ADMIN: "Админ",
  EDITOR: "Редактор",
  COMMENTER: "Комментатор",
  VIEWER: "Наблюдатель",
};

function apiErrorMessage(error: unknown, fallback: string) {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.error === "string"
  ) {
    return error.response.data.error;
  }
  return fallback;
}

type MemberRoleBadgeProps = {
  role: WorkspaceRole;
  interactive?: boolean;
};

function MemberRoleBadge({ role, interactive = false }: MemberRoleBadgeProps) {
  return (
    <span
      className={
        interactive
          ? "inline-flex h-7 min-w-[7.5rem] items-center justify-between gap-1 rounded-full bg-muted/35 px-2.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/35"
          : "inline-flex h-7 items-center rounded-full bg-muted/25 px-2.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/30"
      }
    >
      {ROLE_LABELS[role]}
      {interactive ? (
        <ChevronDown className="size-3 opacity-60" aria-hidden />
      ) : null}
    </span>
  );
}

export function WorkspaceMembersPage() {
  const { pathname } = useLocation();
  const { publicKey } = parseWorkspaceParams(pathname);
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: workspaces = [], isLoading: workspacesLoading } =
    useWorkspaceQuery();
  const currentWorkspace = findWorkspaceByPublicKey(workspaces, publicKey);
  const workspaceId = currentWorkspace?.id ?? "";

  const { data, isLoading: membersLoading } = useWorkspaceMembersQuery(
    workspaceId,
    { enabled: Boolean(workspaceId) },
  );
  const members = data?.members ?? [];
  const pendingInvites = data?.pendingInvites ?? [];

  const removeMember = useRemoveWorkspaceMemberMutation(workspaceId);
  const leaveWorkspace = useLeaveWorkspaceMutation();
  const invalidateMembers = useInvalidateWorkspaceMembers();
  const workspaceTitle = currentWorkspace?.title ?? "Проект";
  const myRole = currentWorkspace?.myRole;
  const canManage = canPerformWorkspaceAction(myRole, "manage_members");
  const canLeave = currentWorkspace?.kind === "shared";

  useEffect(() => {
    if (searchParams.get("invite") !== "1" || !canManage) return;

    const id = window.setTimeout(() => {
      setInviteOpen(true);
    }, 0);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("invite");
        return next;
      },
      { replace: true },
    );

    return () => window.clearTimeout(id);
  }, [searchParams, setSearchParams, canManage]);

  async function handleRemoveMember(userId: number, userName: string) {
    const confirmed = await notifyConfirm({
      title: `Вы действительно хотите выгнать ${userName}`,
      confirmLabel: "Да",
      cancelLabel: "Нет",
    });

    if (!confirmed) return;

    try {
      await removeMember.mutateAsync(userId);
      notify({
        title: "Участник удалён",
        description: `${userName} больше не в проекте`,
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

  async function handleLeave(projectName: string) {
    if (!workspaceId) return;

    const confirmed = await notifyConfirm({
      title: `Вы действительно хотите покинуть проект ${projectName}`,
      confirmLabel: "Да",
      cancelLabel: "Нет",
    });

    if (!confirmed) return;

    try {
      await leaveWorkspace.mutateAsync(workspaceId);
      navigate(SESSION_PATHS.membersHub);
      notify({
        title: "Вы вышли из проекта",
        description: `«${projectName}» больше не в вашем списке`,
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

  if (!publicKey) {
    return (
      <EmptySession
        titleName="Выберите проект"
        descriptionName="Откройте список и выберите команду"
        footerAction={{
          label: "К выбору проекта",
          onClick: () => navigate(SESSION_PATHS.membersHub),
        }}
      />
    );
  }

  if (!workspacesLoading && !currentWorkspace) {
    return (
      <EmptySession
        titleName="Проект не найден"
        descriptionName="Нет доступа или ссылка устарела"
        footerAction={{
          label: "К выбору проекта",
          onClick: () => navigate(SESSION_PATHS.membersHub),
        }}
      />
    );
  }

  const isLoading = workspacesLoading || membersLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[min(420px,60vh)] items-center justify-center">
        <KonoLoader size="sm" hint="Участники" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
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

        <section className={cn(sessionSurface, "flex flex-col gap-3 p-4")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                В проекте
              </h2>
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
                onClick={() => setInviteOpen(true)}
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
                    <WorkspaceMemberRow
                      name={member.name}
                      trailing={
                        <div className="flex items-center gap-1">
                          {member.isOwner ? (
                            <MemberRoleBadge role="OWNER" />
                          ) : (
                            <>
                              <MemberRoleBadge role={memberRole} interactive />
                              {canManage ? (
                                <SessionTooltip label="Удалить из проекта">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="size-7 rounded-full text-muted-foreground hover:text-destructive"
                                    aria-label={`Удалить ${member.name}`}
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
                                </SessionTooltip>
                              ) : null}
                            </>
                          )}
                        </div>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {canManage ? (
          <section className={cn(sessionSurface, "flex flex-col gap-3 p-4")}>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Ожидают ответа
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Приглашения, которые ещё не приняли
              </p>
            </div>

            {pendingInvites.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Нет активных приглашений
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {pendingInvites.map((invite) => (
                  <li
                    key={invite.id}
                    className={cn("rounded-xl px-1 py-0.5", sessionRowHover)}
                  >
                    <WorkspaceMemberRow
                      name={invite.name}
                      muted
                      trailing={
                        <div className="flex items-center gap-1">
                          <MemberRoleBadge
                            role={invite.role as WorkspaceRole}
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
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        {canLeave ? (
          <section className={cn(sessionSurface, "p-4")}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "w-full gap-1.5 text-destructive hover:text-destructive",
                sessionPillOutline,
              )}
              disabled={leaveWorkspace.isPending}
              onClick={() => void handleLeave(workspaceTitle)}
            >
              <LogOut className="size-4" />
              Выйти из проекта
            </Button>
          </section>
        ) : null}
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        workspaceId={workspaceId}
        workspaceTitle={workspaceTitle}
        onInvited={() => invalidateMembers(workspaceId)}
      />
    </>
  );
}

export default WorkspaceMembersPage;
