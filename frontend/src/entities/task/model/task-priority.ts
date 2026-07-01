import type { TaskPriority } from "./types";

const LEGACY_PRIORITY_MAP: Record<string, TaskPriority> = {
  Срочно: "Срочный",
  Срочный: "Срочный",
  Высокий: "Высокий",
  Фокус: "Средний",
  Средний: "Средний",
  Работа: "Средний",
  Низкий: "Низкий",
  Личное: "Низкий",
  Быстрый: "Низкий",
};

export function normalizeTaskPriority(tags?: string | null): TaskPriority | null {
  if (!tags?.trim()) return null;
  return LEGACY_PRIORITY_MAP[tags.trim()] ?? null;
}
