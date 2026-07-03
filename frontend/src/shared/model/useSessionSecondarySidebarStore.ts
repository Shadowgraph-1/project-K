import { create } from "zustand";

export type SessionRightPanel = "assistant" | "notifications";
export type AssistantPresentation = "floating" | "full";

type SessionSecondarySidebarState = {
  open: boolean;
  panel: SessionRightPanel;
  assistantPresentation: AssistantPresentation;
  setOpen: (open: boolean) => void;
  setPanel: (panel: SessionRightPanel) => void;
  setAssistantPresentation: (presentation: AssistantPresentation) => void;
  openPanel: (
    panel: SessionRightPanel,
    presentation?: AssistantPresentation,
  ) => void;
  openAssistantFull: () => void;
  openAssistantFloating: () => void;
  toggle: () => void;
};

export const useSessionSecondarySidebarStore =
  create<SessionSecondarySidebarState>((set) => ({
    open: false,
    panel: "assistant",
    assistantPresentation: "floating",
    setOpen: (open) => set({ open }),
    setPanel: (panel) => set({ panel }),
    setAssistantPresentation: (assistantPresentation) =>
      set({ assistantPresentation }),
    openPanel: (panel, presentation = "floating") =>
      set({ open: true, panel, assistantPresentation: presentation }),
    openAssistantFull: () =>
      set({ open: true, panel: "assistant", assistantPresentation: "full" }),
    openAssistantFloating: () =>
      set({ open: true, panel: "assistant", assistantPresentation: "floating" }),
    toggle: () => set((s) => ({ open: !s.open })),
  }));
