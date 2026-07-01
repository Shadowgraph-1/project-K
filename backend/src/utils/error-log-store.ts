import { randomUUID } from "node:crypto";

export type ErrorLogEntry = {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  message: string;
  code?: string;
};

const MAX_ENTRIES = 200;
const entries: ErrorLogEntry[] = [];

export function pushErrorLog(input: Omit<ErrorLogEntry, "id" | "timestamp">) {
  entries.unshift({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...input,
  });

  if (entries.length > MAX_ENTRIES) {
    entries.length = MAX_ENTRIES;
  }
}

export function listErrorLogs(limit = 50) {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_ENTRIES);
  return entries.slice(0, safeLimit);
}

export function clearErrorLogs() {
  entries.length = 0;
}
