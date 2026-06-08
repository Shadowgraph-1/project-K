import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWorkspaceOnApi, deleteWorkspaceOnApi, getWorkspacesOnApi, type WorkspaceKind } from '@/api/workspaces'
import { queryKeys } from '@/shared/api/query-keys'
import type { WorkspaceRole } from '@/shared/lib/workspace-permissions'
import { useAuthStore } from '@/entities/user/model/useAuthStore'

export type Workspace = {
  id: string;
  title: string;
  hint: string;
  myRole: WorkspaceRole;
  kind: WorkspaceKind;
};

function resolveWorkspaceKind(
  item: {
  myRole: WorkspaceRole;
  kind?: WorkspaceKind
}) {
  if (item.kind === 'owned' || item.kind === 'shared') return item.kind
  return item.myRole === 'OWNER' ? 'owned' : 'shared'
}

function mapApiWorkspace(
  list: {
    id: string,
    name: string,
    myRole: WorkspaceRole,
    kind?: WorkspaceKind,
  }[]
): Workspace[] {
  return list.map((w) => ({
    id: w.id,
    title: w.name,
    hint: '',
    myRole: w.myRole,
    kind: resolveWorkspaceKind(w),
  }))
}

export function useWorkspaceQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: queryKeys.workspaces,
    queryFn: async () => {
      const list = await getWorkspacesOnApi()
      return mapApiWorkspace(list)
    },
    enabled: isAuthenticated
  })
}

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createWorkspaceOnApi(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces
      })
    },
  })
}

export function useDeleteWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkspaceOnApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces
      })
    },
  })
}