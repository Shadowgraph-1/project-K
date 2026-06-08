import { api } from "../client";

export type WorkspaceMemberDto = {
  userId: number;
  name: string;
  isOwner: boolean;
  role: string;
};

export type PendingInviteDto = {
  id: string;
  userId: number;
  name: string;
  role: string;
};

export type WorkspaceMembersResponse = {
  members: WorkspaceMemberDto[];
  pendingInvites: PendingInviteDto[];
};

export type UserSearchDto = {
  id: number;
  name: string;
};

export type UserSearchPage = {
  items: UserSearchDto[];
  nextOffset: number | null;
};

export type IncomingInviteDto = {
  id: string;
  workspaceId: string;
  workspaceName: string;
  inviterName: string;
  createdAt: string;
};

export async function getWorkspaceMembersOnApi(workspaceId: string) {
  const { data } = await api.get<WorkspaceMembersResponse>(
    `/workspaces/${workspaceId}/members`,
  );
  return data;
}

export type SearchUsersForInviteOptions = {
  q?: string;
  limit?: number;
  offset?: number;
};

export async function searchUsersForInviteOnApi(
  workspaceId: string,
  options: SearchUsersForInviteOptions = {},
) {
  const { data } = await api.get<UserSearchPage>(
    `/workspaces/${workspaceId}/members/search`,
    {
      params: {
        q: options.q ?? "",
        limit: options.limit ?? 30,
        offset: options.offset ?? 0,
      },
    },
  );
  return data;
}

export async function sendWorkspaceInviteOnApi(
  workspaceId: string,
  userId: number,
) {
  const { data } = await api.post<{
    ok: boolean;
    inviteId: string;
    name: string;
    workspaceName: string;
  }>(`/workspaces/${workspaceId}/members`, { userId });
  return data;
}

export async function getIncomingInvitesOnApi() {
  const { data } = await api.get<IncomingInviteDto[]>("/invites/incoming");
  return data;
}

export async function acceptInviteOnApi(inviteId: string) {
  const { data } = await api.post<{
    ok: boolean;
    workspaceId: string;
    workspaceName: string;
  }>(`/invites/${inviteId}/accept`);
  return data;
}

export async function declineInviteOnApi(inviteId: string) {
  const { data } = await api.post<{ ok: boolean }>(
    `/invites/${inviteId}/decline`,
  );
  return data;
}

export async function updateWorkspaceMemberRoleOnApi(
  workspaceId: string,
  userId: number,
  role: string,
) {
  const { data } = await api.patch<{ ok: boolean; role: string }>(
    `/workspaces/${workspaceId}/members/${userId}`,
    { role },
  );
  return data;
}

export async function removeWorkspaceMemberOnApi(
  workspaceId: string,
  userId: number,
) {
  const { data } = await api.delete<{ ok: boolean }>(
    `/workspaces/${workspaceId}/members/${userId}`,
  );
  return data;
}

export async function leaveWorkspaceOnApi(workspaceId: string) {
  const { data } = await api.post<{ ok: boolean }>(
    `/workspaces/${workspaceId}/members/leave`,
  );
  return data;
}
