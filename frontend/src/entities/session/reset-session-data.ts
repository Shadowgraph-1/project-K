import { useSessionTasks } from "@/entities/task/model/useSessionTasks";
import { queryClient } from "@/shared/api/query-client";
import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";


export function resetSessionData() {
  queryClient.clear()

  useSessionTasks.getState().clearTasks();
  useCollaborationModalStore.getState().closeCollaboration();
}
