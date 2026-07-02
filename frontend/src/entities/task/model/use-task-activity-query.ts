import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  clearTaskActivityOnApi,
  createTaskActivityOnApi,
  getTaskActivityOnApi,
} from "@/api/task-activity";
import { queryKeys } from "@/shared/api/query-keys";
import { notify } from "@/shared/lib/notify";

export function useTaskActivityQuery(taskId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.taskActivity(taskId ?? ""),
    queryFn: () => getTaskActivityOnApi(taskId!),
    enabled: Boolean(taskId),
  });
}

export function useCreateTaskActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskActivityOnApi,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.taskActivity(variables.taskId),
      });
    },
    onError: () => {
      notify({ title: "Не удалось отправить комментарий", variant: "error" });
    },
  });
}

export function useClearTaskActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => clearTaskActivityOnApi(taskId),
    onSuccess: (_data, taskId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.taskActivity(taskId),
      });
    },
    onError: () => {
      notify({ title: "Не удалось очистить активность", variant: "error" });
    },
  });
}
