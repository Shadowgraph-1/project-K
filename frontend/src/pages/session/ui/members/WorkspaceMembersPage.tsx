import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, LogOut, Plus, UserMinus, Users } from "lucide-react";

import {
  canPerformWorkspaceAction,
  type WorkspaceRole,
} from "@/shared/lib/workspace-permissions";
import { notify } from "@/shared/lib/notify";
import { Button } from "@/shared/ui/button";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { InviteMemberDialog } from "../workspace/InviteMemberDialog";
import { WorkspaceMemberRow } from "../workspace/WorkspaceMemberRow";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import {
  useInvalidateWorkspaceMembers,
  useLeaveWorkspaceMutation,
  useRemoveWorkspaceMemberMutation,
  useWorkspaceMembersQuery,
} from "@/entities/workspace/model/useWorkspaceMembersQuery";
import { KonoLoader } from "@/shared/ui/kono-loader";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";

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
          ? "inline-flex h-7 min-w-[7.5rem] items-center justify-between gap-1 rounded-none border border-border bg-muted/30 px-2 text-[11px] font-medium text-muted-foreground"
          : "inline-flex h-7 items-center rounded-none border border-border/60 bg-muted/20 px-2 text-[11px] font-medium text-muted-foreground"
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
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useWorkspaceMembersQuery(workspaceId ?? "");
  const members = data?.members ?? [];
  const pendingInvites = data?.pendingInvites ?? [];

  const removeMember = useRemoveWorkspaceMemberMutation(workspaceId ?? "");
  const leaveWorkspace = useLeaveWorkspaceMutation();
  const invalidateMembers = useInvalidateWorkspaceMembers();

  const { data: workspaces = [] } = useWorkspaceQuery();
  const currentWorkspace = workspaces.find((w) => w.id === workspaceId);
  const workspaceTitle = currentWorkspace?.title ?? "Проект";
  const myRole = currentWorkspace?.myRole;
  const canManage = canPerformWorkspaceAction(myRole, "manage_members");
  const canLeave = currentWorkspace?.kind === "shared";

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

  if (!workspaceId) {
    return (
      <Empty className="session-empty-state min-h-[min(420px,60vh)]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Выберите проект</EmptyTitle>
          <EmptyDescription>
            Откройте список проектов и выберите, чью команду хотите посмотреть
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline" className="rounded-none">
            <Link to={SESSION_PATHS.membersHub}>К выбору проекта</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[min(420px,60vh)] items-center justify-center">
        <KonoLoader size="sm" hint="Участники" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="border-b border-border pb-5">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Kono · Команда
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Участники
          </h1>
          {workspaces.length > 0 ? (
            <label className="mt-3 flex max-w-sm flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Проект</span>
              <select
                value={workspaceId}
                onChange={(event) =>
                  navigate(SESSION_PATHS.projectMembers(event.target.value))
                }
                className="h-8 w-full border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Проект «{workspaceTitle}» · роли, приглашения и доступ
            </p>
          )}
        </header>

        <section className="flex flex-col gap-3 border border-border bg-card p-4">
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
                className="gap-1.5 rounded-none"
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
              {members.map((member) => (
                <li
                  key={member.userId}
                  className="rounded-none border border-transparent px-1 py-0.5 transition-colors hover:border-border/50 hover:bg-muted/20"
                >
                  <WorkspaceMemberRow
                    name={member.name}
                    trailing={
                      <div className="flex items-center gap-1">
                        {member.isOwner ? (
                          <MemberRoleBadge role="OWNER" />
                        ) : (
                          <>
                            <MemberRoleBadge
                              role={member.role as WorkspaceRole}
                              interactive
                            />
                            {canManage ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-7 rounded-none text-muted-foreground hover:text-destructive"
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
        </section>

        {canManage ? (
          <section className="flex flex-col gap-3 border border-border bg-card p-4">
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
                    className="rounded-none border border-transparent px-1 py-0.5 hover:border-border/50 hover:bg-muted/20"
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-7 rounded-none text-muted-foreground hover:text-destructive"
                            aria-label="Отменить приглашение"
                            title="Отменить приглашение"
                          >
                            <UserMinus className="size-3.5" />
                          </Button>
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
          <section className="border border-border bg-card p-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-1.5 rounded-none text-destructive hover:text-destructive"
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
