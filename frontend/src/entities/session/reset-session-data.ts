import { queryClient } from "@/shared/api/query-client";
import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";


export function resetSessionData() {
  queryClient.clear()
  useCollaborationModalStore.getState().closeCollaboration();
}
