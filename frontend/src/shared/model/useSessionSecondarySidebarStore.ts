import { create } from "zustand";

export type SessionRightPanel = "assistant" | "notifications";

type SessionSecondarySidebarState = {
  open: boolean;
  panel: SessionRightPanel;
  setOpen: (open: boolean) => void;
  setPanel: (panel: SessionRightPanel) => void;
  openPanel: (panel: SessionRightPanel) => void;
  toggle: () => void;
};

export const useSessionSecondarySidebarStore =
  create<SessionSecondarySidebarState>((set) => ({
    open: false,
    panel: "assistant",
    setOpen: (open) => set({ open }),
    setPanel: (panel) => set({ panel }),
    openPanel: (panel) => set({ open: true, panel }),
    toggle: () => set((s) => ({ open: !s.open })),
  }));
