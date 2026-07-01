import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getWorkspaceMembersOnApi,
  leaveWorkspaceOnApi,
  removeWorkspaceMemberOnApi,
  updateWorkspaceMemberRoleOnApi,
} from "@/api/workspaces/members";
import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";
import { queryKeys } from "@/shared/api/query-keys";

type UseWorkspaceMembersQueryOptions = {
  enabled?: boolean;
};

export function useWorkspaceMembersQuery(
  workspaceId: string,
  options?: UseWorkspaceMembersQueryOptions,
) {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: queryKeys.workspaceMembers(workspaceId),
    queryFn: () => getWorkspaceMembersOnApi(workspaceId),
    enabled: Boolean(workspaceId) && enabled,
  });
}

export function useInvalidateWorkspaceMembers() {
  const queryClient = useQueryClient();

  return useCallback(
    (workspaceId: string) => {
      if (!workspaceId) return;
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembers(workspaceId),
      });
    },
    [queryClient],
  );
}

export function useUpdateWorkspaceMemberRoleMutation(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: number;
      role: WorkspaceRole;
    }) => updateWorkspaceMemberRoleOnApi(workspaceId, userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembers(workspaceId),
      });
    },
  });
}

export function useRemoveWorkspaceMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      removeWorkspaceMemberOnApi(workspaceId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembers(workspaceId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces,
      });
    },
  });
}

export function useLeaveWorkspaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) => leaveWorkspaceOnApi(workspaceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces,
      });
    },
  });
}
