import { useQuery } from "@tanstack/react-query";

import { getTaskStatusHistoryOnApi } from "@/api/task-status-history";
import { queryKeys } from "@/shared/api/query-keys";

export function useTaskStatusHistoryQuery(taskId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.taskStatusHistory(taskId ?? ""),
    queryFn: () => getTaskStatusHistoryOnApi(taskId!),
    enabled: Boolean(taskId),
  });
}
