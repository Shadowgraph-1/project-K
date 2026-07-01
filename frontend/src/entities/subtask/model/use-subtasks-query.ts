import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  createSubtaskOnApi,
  deleteSubtaskOnApi,
  getSubtasksOnApi,
  updateSubtaskOnApi,
  type Subtask,
} from "@/api/subtasks";
import { queryKeys } from "@/shared/api/query-keys";
import { notify } from "@/shared/lib/notify";

export function useSubtasksQuery(taskId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subtasks(taskId ?? ""),
    queryFn: () => getSubtasksOnApi(taskId!),
    enabled: Boolean(taskId),
  });
}

export function useSubtasksQueries(taskIds: string[]) {
  return useQueries({
    queries: taskIds.map((taskId) => ({
      queryKey: queryKeys.subtasks(taskId),
      queryFn: () => getSubtasksOnApi(taskId),
      enabled: Boolean(taskId),
    })),
  });
}

function invalidateSubtasks(queryClient: QueryClient, taskId: string) {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.subtasks(taskId),
  });
}

function invalidateSubtasksAndActivity(queryClient: QueryClient, taskId: string) {
  return Promise.all([
    invalidateSubtasks(queryClient, taskId),
    queryClient.invalidateQueries({
      queryKey: queryKeys.taskActivity(taskId),
    }),
  ]);
}

export function useCreateSubtaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubtaskOnApi,
    onSuccess: (_data, variables) => {
      void invalidateSubtasksAndActivity(queryClient, variables.taskId);
    },
    onError: () => {
      notify({ title: "Не удалось создать подзадачу", variant: "error" });
    },
  });
}

export function useUpdateSubtaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      taskId: string;
      patch: Partial<Pick<Subtask, "title" | "status">>;
    }) => updateSubtaskOnApi(id, patch),
    onSuccess: (_data, variables) => {
      void invalidateSubtasksAndActivity(queryClient, variables.taskId);
    },
  });
}

export function useDeleteSubtaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; taskId: string }) =>
      deleteSubtaskOnApi(id),
    onSuccess: (_data, variables) => {
      void invalidateSubtasksAndActivity(queryClient, variables.taskId);
    },
    onError: () => {
      notify({ title: "Не удалось удалить подзадачу", variant: "error" });
    },
  });
}
