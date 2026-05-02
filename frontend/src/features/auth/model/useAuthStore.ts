import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  register: (payload: RegisterPayload) => void;
  login: (payload: LoginPayload) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      register: (payload) => {
        set({
          user: {
            name: payload.name,
            email: payload.email,
          },
          isAuthenticated: true,
        });
      },

      login: (payload) => {
        set({
          user: {
            name: payload.email.split("@")[0],
            email: payload.email,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
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
