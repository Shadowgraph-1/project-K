import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  PauseCircle,
} from "lucide-react";

export type WorkspaceStatus = "new" | "active" | "pause" | "abandoned";

export const STATUS_CONFIG: Record<
  WorkspaceStatus,
  { label: string; icon: LucideIcon; iconClass: string; text: string }
> = {
  new: {
    label: "Новый",
    icon: Circle,
    iconClass: "text-blue-500",
    text: "text-blue-600",
  },
  active: {
    label: "Активен",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    text: "text-green-700",
  },
  pause: {
    label: "Пауза",
    icon: PauseCircle,
    iconClass: "text-amber-500",
    text: "text-amber-700",
  },
  abandoned: {
    label: "Заброшен",
    icon: CircleAlert,
    iconClass: "text-red-500",
    text: "text-red-600",
  },
};
