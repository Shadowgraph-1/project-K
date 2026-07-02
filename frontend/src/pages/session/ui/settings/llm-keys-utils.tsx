import type { LlmKeyItem } from "@/api/llm-settings";
import { ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export function keyTitle(key: LlmKeyItem) {
  return key.label?.trim() || key.hint?.trim() || "API ключ";
}

export function formatLastUpdated(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "—";

  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "только что";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} мин назад`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} дн назад`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} мес назад`;
  return `${Math.floor(months / 12)} г назад`;
}

export function formatFullDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SortHeader({
  label,
  active = false,
  order = "asc",
  onClick,
}: {
  label: string;
  active?: boolean;
  order?: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <ChevronDown
        className={cn(
          "size-3 shrink-0 transition-transform",
          !active && "opacity-50",
          active && order === "desc" && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}

export const thClass =
  "whitespace-nowrap px-3 pb-3 pt-2 text-left text-sm font-medium text-muted-foreground";
export const tdClass = "whitespace-nowrap px-3 py-2.5 text-sm align-middle";
