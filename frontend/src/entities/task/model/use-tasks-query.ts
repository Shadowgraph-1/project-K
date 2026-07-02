import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTaskOnApi,
  deleteTaskOnApi,
  deleteAllTasksInWorkspaceOnApi,
  getTaskOnApi,
  updateTaskOnAPI,
  type CreateTaskPayload,
  type TaskPatch,
} from "@/api/tasks";
import { queryKeys } from "@/shared/api/query-keys";
import { notify } from "@/shared/lib/notify";

import { mapApiTask } from "./map-task";
import type { Task, TaskStatus } from "./types";

type TaskFilters = {
  status?: TaskStatus;
};

async function fetchTasksForWorkspace(
  workspaceId: string,
  filters?: TaskFilters,
): Promise<Task[]> {
  const list = await getTaskOnApi({
    workspaceId,
    status: filters?.status,
  });
  return list.map(mapApiTask);
}

export function useTasksQuery(workspaceId: string | undefined, filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks.byWorkspace(workspaceId ?? "", filters),
    queryFn: () => fetchTasksForWorkspace(workspaceId!, filters),
    enabled: Boolean(workspaceId),
  });
}

export function useTasksQueries(workspaceIds: string[]) {
  return useQueries({
    queries: workspaceIds.map((workspaceId) => ({
      queryKey: queryKeys.tasks.byWorkspace(workspaceId),
      queryFn: () => fetchTasksForWorkspace(workspaceId),
      enabled: Boolean(workspaceId),
    })),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTaskOnApi(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.tasks.all, variables.workspaceId],
      });
    },
    onError: () => {
      notify({
        title: "Не удалось создать задачу",
        variant: "error",
      });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: TaskPatch;
      workspaceId: string;
    }) => updateTaskOnAPI(id, patch),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.tasks.all, variables.workspaceId],
      });
      if (variables.patch.status !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.taskStatusHistory(variables.id),
        });
      }
    },
  });
}

export function useDeleteAllTasksMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) =>
      deleteAllTasksInWorkspaceOnApi(workspaceId),
    onSuccess: (_data, workspaceId) => {
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.tasks.all, workspaceId],
      });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; workspaceId: string }) =>
      deleteTaskOnApi(id),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.tasks.all, variables.workspaceId],
      });
    },
  });
}
