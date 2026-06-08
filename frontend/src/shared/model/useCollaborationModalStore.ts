import { create } from "zustand";

import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";

export type OpenCollaborationOptions = {
  workspaceId?: string;
  workspaceTitle?: string;
  myRole?: WorkspaceRole;
};

type CollaborationModalStore = {
  open: boolean;
  workspaceId: string | null;
  workspaceTitle: string | null;
  openCollaboration: (options?: OpenCollaborationOptions) => void;
  closeCollaboration: () => void;
};

export const useCollaborationModalStore = create<CollaborationModalStore>()(
  (set) => ({
    open: false,
    workspaceId: null,
    workspaceTitle: null,
    openCollaboration: (options) =>
      set({
        open: true,
        workspaceId: options?.workspaceId ?? null,
        workspaceTitle: options?.workspaceTitle ?? null,
      }),
    closeCollaboration: () => set({ open: false }),
  }),
);
