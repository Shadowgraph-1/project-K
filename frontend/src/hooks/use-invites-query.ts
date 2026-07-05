import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIncomingInvitesOnApi,
  acceptInviteOnApi,
  declineInviteOnApi,
  type IncomingInviteDto,
} from "@/api/workspaces/members";
import { queryKeys } from "@/shared/api/query-keys";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { notify } from "@/shared/lib/notify";

const invitesQueryBase = {
  queryKey: queryKeys.invites.incoming(),
  queryFn: getIncomingInvitesOnApi,
  refetchInterval: 30_000,
  notifyOnChangeProps: ["data", "error"] as ("data" | "error")[],
};

export function useInvitesQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    ...invitesQueryBase,
    enabled: isAuthenticated,
  });
}

export function useInviteCountQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    ...invitesQueryBase,
    enabled: isAuthenticated,
    select: (invites: IncomingInviteDto[]) => invites.length,
  });
}

export function useInvitesActions() {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: (invite: IncomingInviteDto) => acceptInviteOnApi(invite.id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invites.incoming(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces,
      });
      notify({
        title: "Вы вступили в проект",
        description: `<< ${result.workspaceName} >>`,
        variant: "success",
      });
    },
    onError: () => {
      notify({
        title: "Не удалось принять приглашение",
        variant: "error",
      });
    },
  });

  const decline = useMutation({
    mutationFn: (invite: IncomingInviteDto) => declineInviteOnApi(invite.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invites.incoming(),
      });
      notify({
        title: "Приглашение отклонено",
        variant: "info",
      });
    },
    onError: () => {
      notify({
        title: "Не удалось отклонить",
        variant: "error",
      });
    },
  });

  return {
    accept: (invite: IncomingInviteDto) => accept.mutateAsync(invite),
    decline: (invite: IncomingInviteDto) => decline.mutateAsync(invite),
  };
}
