import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resetSessionData } from "@/entities/session/reset-session-data";
import { clearAuthToken } from "@/shared/lib/auth-token";

type AuthUser = {
  name: string;
  email: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload | AuthUser) => void;
  login: (payload: LoginPayload | AuthUser) => void;
  logout: () => void;
};

/** Единственный persist-стор: профиль сессии. JWT — в localStorage через auth-token.ts */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      register: (payload) => {
        resetSessionData();
        set({
          user: {
            name: payload.name,
            email: payload.email,
          },
          isAuthenticated: true,
        });
      },

      login: (payload) => {
        resetSessionData();
        const user: AuthUser =
          "password" in payload
            ? {
                name: payload.email.split("@")[0],
                email: payload.email,
              }
            : { name: payload.name, email: payload.email };
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        clearAuthToken();
        resetSessionData();
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "focus-with-me-auth",
    },
  ),
);
