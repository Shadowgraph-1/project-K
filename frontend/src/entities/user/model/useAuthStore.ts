import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resetSessionData } from "@/entities/session/reset-session-data";
import { clearAuthToken } from "@/shared/lib/auth-token";
import type { AuthUser } from "@/api/auth";

export const AUTH_STORAGE_KEY = "focus-with-me-auth";

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  register: (user: AuthUser) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
};

/** Единственный persist-стор: профиль сессии. JWT — в localStorage через auth-token.ts */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      register: (user) => {
        resetSessionData();
        set({ user, isAuthenticated: true });
      },

      login: (user) => {
        resetSessionData();
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        clearAuthToken();
        resetSessionData();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
    },
  ),
);
