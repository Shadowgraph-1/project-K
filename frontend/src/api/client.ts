import axios from "axios";
import { getAuthToken, clearAuthToken } from "@/shared/lib/auth-token";
import { env } from "@/shared/config/env";
import { AUTH_STORAGE_KEY } from "@/entities/user/model/useAuthStore";

const API_BASE = env.apiUrl || "http://localhost:3000/api";

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
    if (error.response?.status === 401) {
      clearAuthToken();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        const current = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
      }
    }
    return Promise.reject(error);
  },
);