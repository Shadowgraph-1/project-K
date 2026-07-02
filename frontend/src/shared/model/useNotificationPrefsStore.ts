import { create } from "zustand";
import { persist } from "zustand/middleware";

type NotificationPrefsState = {
  taskHistoryEnabled: boolean;
  teamInvitesEnabled: boolean;
  setTaskHistoryEnabled: (enabled: boolean) => void;
  setTeamInvitesEnabled: (enabled: boolean) => void;
};

export const useNotificationPrefsStore = create<NotificationPrefsState>()(
  persist(
    (set) => ({
      taskHistoryEnabled: true,
      teamInvitesEnabled: true,
      setTaskHistoryEnabled: (taskHistoryEnabled) => set({ taskHistoryEnabled }),
      setTeamInvitesEnabled: (teamInvitesEnabled) =>
        set({ teamInvitesEnabled }),
    }),
    { name: "kono-notification-prefs" },
  ),
);
