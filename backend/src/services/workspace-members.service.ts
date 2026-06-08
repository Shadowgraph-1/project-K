import { prisma } from "../db/prisma.js";
import {
  MemberInviteStatus,
  WorkspaceRole,
} from "../generated/prisma/client.js";
import {
  assertWorkspaceAccess,
  canPerformAction,
  getWorkspaceAccess,
} from "../permissions.js";
import { apiErr, type ApiErrorCode } from "../utils/api-errors.js";

const DEFAULT_INVITE_ROLE = WorkspaceRole.EDITOR;

function err(code: ApiErrorCode) {
  return apiErr(code);
}

async function getExcludedUserIds(workspaceId: string): Promise<Set<number>> {
  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: { user_id: true },
  });

  const members = await prisma.workspace_members.findMany({
    where: { workspace_id: workspaceId },
    select: { user_id: true },
  });

  const pendingInvites = await prisma.workspace_member_invites.findMany({
    where: { workspace_id: workspaceId, status: MemberInviteStatus.PENDING },
    select: { invitee_id: true },
  });

  const ids = new Set<number>();
  if (workspace) ids.add(workspace.user_id);
  for (const member of members) ids.add(member.user_id);
  for (const invite of pendingInvites) ids.add(invite.invitee_id);
  return ids;
}

export async function getMembers(workspaceId: string, userId: number) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access) return null;

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: { users: { select: { id: true, name: true } } },
  });
  if (!workspace) return null;

  const members = await prisma.workspace_members.findMany({
    where: { workspace_id: workspaceId },
    include: { users: { select: { id: true, name: true } } },
    orderBy: { joined_at: "asc" },
  });

  const ownerId = workspace.users.id;
  const canManageMembers =
    access.isOwner || canPerformAction(access.role, "manage_members");

  const pendingInvites = canManageMembers
    ? await prisma.workspace_member_invites.findMany({
        where: { workspace_id: workspaceId, status: MemberInviteStatus.PENDING },
        include: { invitee: { select: { id: true, name: true } } },
        orderBy: { created_at: "desc" },
      })
    : [];

  return {
    members: [
      {
        userId: ownerId,
        name: workspace.users.name,
        isOwner: true,
        role: WorkspaceRole.OWNER,
      },
      ...members
        .filter((member) => member.users.id !== ownerId)
        .map((member) => ({
          userId: member.users.id,
          name: member.users.name,
          isOwner: false,
          role: member.role,
        })),
    ],
    pendingInvites: pendingInvites.map((invite) => ({
      id: invite.id,
      userId: invite.invitee.id,
      name: invite.invitee.name,
      role: invite.role,
    })),
  };
}

export async function searchUsersToInvite(
  workspaceId: string,
  actorId: number,
  query: string,
  limit: number,
  offset: number,
) {
  const access = await assertWorkspaceAccess(
    workspaceId,
    actorId,
    "manage_members",
  );
  if (!access) return null;

  const excludedIds = await getExcludedUserIds(workspaceId);
  excludedIds.add(actorId);
  const excluded = [...excludedIds];

  const where = {
    ...(excluded.length > 0 ? { id: { notIn: excluded } } : {}),
    ...(query
      ? { name: { contains: query, mode: "insensitive" as const } }
      : {}),
  };

  const users = await prisma.users.findMany({
    where,
    select: { id: true, name: true },
    orderBy: [{ name: "asc" }, { id: "asc" }],
    skip: offset,
    take: limit + 1,
  });

  const hasMore = users.length > limit;
  return {
    items: hasMore ? users.slice(0, limit) : users,
    nextOffset: hasMore ? offset + limit : null,
  };
}

export async function inviteUser(
  workspaceId: string,
  targetUserId: number,
  actorId: number,
) {
  const access = await assertWorkspaceAccess(
    workspaceId,
    actorId,
    "manage_members",
  );
  if (!access) return err("workspace_not_found");

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: { user_id: true, name: true },
  });
  if (!workspace) return err("workspace_not_found");

  if (workspace.user_id === targetUserId) return err("target_is_owner");

  const targetUser = await prisma.users.findUnique({
    where: { id: targetUserId },
    select: { id: true, name: true },
  });
  if (!targetUser) return err("user_not_found");

  const alreadyMember = await prisma.workspace_members.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: targetUserId,
      },
    },
  });
  if (alreadyMember) return err("already_member");

  const existingInvite = await prisma.workspace_member_invites.findUnique({
    where: {
      workspace_id_invitee_id: {
        workspace_id: workspaceId,
        invitee_id: targetUserId,
      },
    },
  });
  if (existingInvite?.status === MemberInviteStatus.PENDING) {
    return err("already_invited");
  }

  const invite = await prisma.workspace_member_invites.upsert({
    where: {
      workspace_id_invitee_id: {
        workspace_id: workspaceId,
        invitee_id: targetUserId,
      },
    },
    create: {
      workspace_id: workspaceId,
      invitee_id: targetUserId,
      invited_by: actorId,
      role: DEFAULT_INVITE_ROLE,
      status: MemberInviteStatus.PENDING,
    },
    update: {
      invited_by: actorId,
      role: DEFAULT_INVITE_ROLE,
      status: MemberInviteStatus.PENDING,
      responded_at: null,
    },
  });

  return {
    ok: true as const,
    inviteId: invite.id,
    userId: targetUser.id,
    name: targetUser.name,
    workspaceId,
    workspaceName: workspace.name,
  };
}

export async function removeMember(
  workspaceId: string,
  targetUserId: number,
  actorId: number,
) {
  const access = await assertWorkspaceAccess(
    workspaceId,
    actorId,
    "manage_members",
  );
  if (!access) return err("workspace_not_found");

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: { user_id: true },
  });
  if (!workspace) return err("workspace_not_found");
  if (workspace.user_id === targetUserId) return err("owner_remove_forbidden");
  if (targetUserId === actorId) return err("self_remove_forbidden");

  const member = await prisma.workspace_members.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: targetUserId,
      },
    },
  });
  if (!member) return err("member_not_found");

  await prisma.workspace_members.delete({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: targetUserId,
      },
    },
  });

  return { ok: true as const };
}

export const ASSIGNABLE_ROLES: WorkspaceRole[] = [
  WorkspaceRole.ADMIN,
  WorkspaceRole.EDITOR,
  WorkspaceRole.COMMENTER,
  WorkspaceRole.VIEWER,
];

export async function updateMemberRole(
  workspaceId: string,
  targetUserId: number,
  actorId: number,
  role: WorkspaceRole,
) {
  const access = await assertWorkspaceAccess(
    workspaceId,
    actorId,
    "manage_members",
  );
  if (!access) return err("workspace_not_found");

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId },
    select: { user_id: true },
  });
  if (!workspace) return err("workspace_not_found");
  if (workspace.user_id === targetUserId) return err("owner_role_forbidden");

  const member = await prisma.workspace_members.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: targetUserId,
      },
    },
  });
  if (!member) return err("member_not_found");

  await prisma.workspace_members.update({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: targetUserId,
      },
    },
    data: { role },
  });

  return { ok: true as const, role };
}

export async function leaveWorkspace(workspaceId: string, userId: number) {
  const access = await getWorkspaceAccess(workspaceId, userId);
  if (!access) return err("workspace_not_found");
  if (access.isOwner) return err("owner_leave_forbidden");

  await prisma.workspace_members.delete({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    },
  });

  return { ok: true as const };
}

export async function getIncomingInvites(userId: number) {
  const invites = await prisma.workspace_member_invites.findMany({
    where: {
      invitee_id: userId,
      status: MemberInviteStatus.PENDING,
    },
    include: {
      workspaces: { select: { id: true, name: true } },
      inviter: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return invites.map((invite) => ({
    id: invite.id,
    workspaceId: invite.workspaces.id,
    workspaceName: invite.workspaces.name,
    inviterName: invite.inviter.name,
    createdAt: invite.created_at.toISOString(),
  }));
}

export async function acceptInvite(inviteId: string, userId: number) {
  const invite = await prisma.workspace_member_invites.findUnique({
    where: { id: inviteId },
    include: {
      workspaces: { select: { id: true, name: true } },
    },
  });

  if (!invite || invite.invitee_id !== userId) {
    return err("invite_not_found");
  }

  if (invite.status !== MemberInviteStatus.PENDING) {
    return err("invite_already_processed");
  }

  await prisma.$transaction(async (tx) => {
    await tx.workspace_members.upsert({
      where: {
        workspace_id_user_id: {
          workspace_id: invite.workspace_id,
          user_id: userId,
        },
      },
      create: {
        workspace_id: invite.workspace_id,
        user_id: userId,
        role: invite.role,
        invited_by: invite.invited_by,
      },
      update: {
        role: invite.role,
        invited_by: invite.invited_by,
      },
    });

    await tx.workspace_member_invites.update({
      where: { id: inviteId },
      data: {
        status: MemberInviteStatus.ACCEPTED,
        responded_at: new Date(),
      },
    });
  });

  return {
    ok: true as const,
    workspaceId: invite.workspaces.id,
    workspaceName: invite.workspaces.name,
  };
}

export async function declineInvite(inviteId: string, userId: number) {
  const invite = await prisma.workspace_member_invites.findUnique({
    where: { id: inviteId },
    select: { id: true, invitee_id: true, status: true },
  });

  if (!invite || invite.invitee_id !== userId) {
    return err("invite_not_found");
  }

  if (invite.status !== MemberInviteStatus.PENDING) {
    return err("invite_already_processed");
  }

  await prisma.workspace_member_invites.update({
    where: { id: inviteId },
    data: {
      status: MemberInviteStatus.DECLINED,
      responded_at: new Date(),
    },
  });

  return { ok: true as const };
}
