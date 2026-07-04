import axios from "axios";
import { getAuthToken, clearAuthToken } from "@/shared/lib/auth-token";
import { env } from "@/shared/config/env";
import { useAuthStore } from "@/entities/user/model/useAuthStore";

/** Относительный /api — Vite proxy в dev и nginx в Docker. Явный VITE_API_URL — для кастомного хоста. */
const API_BASE = env.apiUrl || "/api";

function isPublicAuthRequest(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/register");
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url as string | undefined;

    if (status === 401 && !isPublicAuthRequest(requestUrl)) {
      clearAuthToken();
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path !== "/login" && path !== "/register") {
          const current = path + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
        }
      }
    }
    return Promise.reject(error);
  },
);