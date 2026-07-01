import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  applySessionTheme,
  getStoredSessionTheme,
} from "@/shared/lib/session-theme";

export type SessionTheme = "light" | "dark";

type SessionThemeState = {
  theme: SessionTheme;
  setTheme: (theme: SessionTheme) => void;
};

export const useSessionThemeStore = create<SessionThemeState>()(
  persist(
    (set) => ({
      theme: getStoredSessionTheme(),
      setTheme: (theme) => {
        applySessionTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "kono-session-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applySessionTheme(state.theme);
      },
    },
  ),
);