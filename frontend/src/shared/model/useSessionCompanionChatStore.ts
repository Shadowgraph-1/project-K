import { create } from "zustand";

type SessionCompanionChatState = {
  showChat: boolean;
  setShowChat: (open: boolean) => void;
  toggleChat: () => void;
};

export const useSessionCompanionChatStore = create<SessionCompanionChatState>(
  (set) => ({
    showChat: false,
    setShowChat: (open) => set({ showChat: open }),
    toggleChat: () => set((s) => ({ showChat: !s.showChat })),
  }),
);
