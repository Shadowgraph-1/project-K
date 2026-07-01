import { api } from "../client";

export type HealthCheck = {
  status: "ok" | "down";
  latencyMs: number;
  message?: string;
};

export type HealthResponse = {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    api: HealthCheck;
    database: HealthCheck;
    ai: HealthCheck;
  };
};

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>("/health");
  return data;
}
