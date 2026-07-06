import axios from "axios";

import { AUTH_PATHS } from "@/pages/auth/auth-paths";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/shared/lib/auth-token";
import { env } from "@/shared/config/env";
import { redirectToLogin } from "@/shared/lib/router-navigation";
import { useAuthStore } from "@/entities/user/model/useAuthStore";

const API_BASE = env.apiUrl || "/api";

function isPublicAuthRequest(url: string | undefined) {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    const status = error.response?.status;
    const requestUrl = original?.url as string | undefined;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isPublicAuthRequest(requestUrl)
    ) {
      original._retry = true;

      refreshPromise ??= api
        .post<{ token: string }>("/auth/refresh")
        .then((res) => {
          const token = res.data.token;
          setAuthToken(token);
          return token;
        })
        .catch(() => {
          clearAuthToken();
          useAuthStore.getState().logout();

          if (typeof window !== "undefined") {
            const path = window.location.pathname;
            if (path !== AUTH_PATHS.login && path !== AUTH_PATHS.register) {
              redirectToLogin(path + window.location.search);
            }
          }

          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const newToken = await refreshPromise;
      if (!newToken) return Promise.reject(error);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    }

    return Promise.reject(error);
  },
);