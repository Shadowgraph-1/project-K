import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import {
  canPerformWorkspaceAction,
} from "@/shared/lib/workspace-permissions";
import { notify } from "@/shared/lib/notify";
import { Button } from "@/shared/ui/button";
import { SESSION_PATHS, parseWorkspaceParams } from "../../model/sessionPaths";
import { InviteMemberDialog } from "../workspace/InviteMemberDialog";
import EmptySession from "../placeholders/EmptySession";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import { findWorkspaceByPublicKey } from "@/entities/workspace/lib/resolve-workspace";
import {
  useInvalidateWorkspaceMembers,
  useLeaveWorkspaceMutation,
  useRemoveWorkspaceMemberMutation,
  useWorkspaceMembersQuery,
} from "@/entities/workspace/model/use-workspace-members-query";
import { WorkspaceMembersPageSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import {
  sessionPillOutline,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";

import { WorkspaceMembersHeader } from "./WorkspaceMembersHeader";
import { WorkspaceMembersListSection } from "./WorkspaceMembersListSection";
import { WorkspacePendingInvitesSection } from "./WorkspacePendingInvitesSection";

function apiErrorMessage(error: unknown, fallback: string) {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.error === "string"
  ) {
    return error.response.data.error;
  }
  return fallback;
}

export function WorkspaceMembersPage() {
  const { pathname } = useLocation();
  const { publicKey } = parseWorkspaceParams(pathname);
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();

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

  if (workspacesLoading || membersLoading) {
    return <WorkspaceMembersPageSkeleton />;
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <WorkspaceMembersHeader
          workspaces={workspaces}
          publicKey={publicKey}
          workspaceTitle={workspaceTitle}
        />

        <WorkspaceMembersListSection
          members={members}
          canManage={canManage}
          removePending={removeMember.isPending}
          onInvite={() => setInviteOpen(true)}
          onRemove={handleRemoveMember}
        />

        {canManage ? (
          <WorkspacePendingInvitesSection invites={pendingInvites} />
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
