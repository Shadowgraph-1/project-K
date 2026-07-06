import axios from "axios";

export type ApiErrorPayload = {
  code?: string;
  message?: string;
  error?: string;
  fields?: Record<string, string[]>;
};

export function getApiErrorPayload(err: unknown): ApiErrorPayload | null {
  if (!axios.isAxiosError(err)) return null;

  const data = err.response?.data;
  if (typeof data !== "object" || data === null) return null;

  return data as ApiErrorPayload;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const payload = getApiErrorPayload(err);
  if (!payload) return fallback;

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  return fallback;
}

export function getApiErrorCode(err: unknown): string | null {
  const payload = getApiErrorPayload(err);
  if (!payload || typeof payload.code !== "string") return null;
  return payload.code;
}