import { create } from "zustand";
import { persist } from "zustand/middleware";

type Workspace = {
  id: string;
  title: string;
  hint: string;
};

type WorkspaceStore = {
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
  reorderWorkspaces: (workspaces: Workspace[]) => void;
  renameWorkspaces: (id: string, title: string) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      addWorkspace: (workspace) =>
        set((state) => ({ workspaces: [...state.workspaces, workspace] })),
      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
        })),
      reorderWorkspaces: (workspaces) => set({ workspaces }),
      renameWorkspaces: (id, title) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, title } : w,
          ),
        })),
    }),
    { name: "workspaces" },
  ),
);
