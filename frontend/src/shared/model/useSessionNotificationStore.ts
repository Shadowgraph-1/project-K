import { create } from "zustand";

/** Заглушка: позже подтянуть с API. */
type SessionNotificationState = {
  unreadCount: number;
  setUnreadCount: (n: number) => void;
};

export const useSessionNotificationStore = create<SessionNotificationState>(
  (set) => ({
    unreadCount: 3,
    setUnreadCount: (n) => set({ unreadCount: Math.max(0, n) }),
  }),
);
