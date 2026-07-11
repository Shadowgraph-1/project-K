import {
  ArrowRightLeft,
  CirclePlus,
  ListPlus,
  MessageSquarePlus,
  PencilLine,
  Trash2,
} from "lucide-react";
import type { TaskActivity } from "@/api/task-activity";
import { Activity, isActivityType } from "@/shared/constants/activity-types";
import { isSubtaskStatus } from "@/shared/constants/subtask-statuses";
import { SubtaskStatusIcon } from "./task-status-icons";
import { cn } from "@/shared/lib/utils";

export { isSubtaskStatus } from "@/shared/constants/subtask-statuses";

export function getActivityMetadata(item: TaskActivity) {
  if (!item.metadata || typeof item.metadata !== "object" || Array.isArray(item.metadata)) {
    return {} as {
      from?: string;
      to?: string;
      subtaskId?: string;
      parentActivityId?: string;
    };
  }
  const meta = item.metadata as Record<string, unknown>;
  return {
    from: typeof meta.from === "string" ? meta.from : undefined,
    to: typeof meta.to === "string" ? meta.to : undefined,
    subtaskId: typeof meta.subtaskId === "string" ? meta.subtaskId : undefined,
    parentActivityId:
      typeof meta.parentActivityId === "string"
        ? meta.parentActivityId
        : undefined,
  };
}

export function isActivityReply(item: TaskActivity) {
  return Boolean(getActivityMetadata(item).parentActivityId);
}

export function getActivityEntityName(item: TaskActivity) {
  const body = item.body?.trim();
  if (body) return body;

  const meta = getActivityMetadata(item);
  if (meta.to?.trim()) return meta.to.trim();
  if (item.title?.trim()) return item.title.trim();

  return null;
}

export function formatActivityActionText(item: TaskActivity) {
  if (!isActivityType(item.type)) {
    return item.title;
  }

  switch (item.type) {
    case Activity.TASK_CREATED:
      return "создал задачу";
    case Activity.SUBTASK_CREATED:
      return "создал подзадачу";
    case Activity.SUBTASK_DELETED:
      return "удалил подзадачу";
    case Activity.SUBTASK_TITLE_CHANGED:
      return "изменил название подзадачи";
    case Activity.SUBTASK_STATUS_CHANGED:
      return "изменил статус подзадачи";
    case Activity.UPDATE_CREATED:
      return "добавил обновление";
    default:
      return item.title;
  }
}

export function ActivityActionIcon({
  item,
  className,
}: {
  item: TaskActivity;
  className?: string;
}) {
  const meta = getActivityMetadata(item);
  const iconClass = cn("size-3.5 shrink-0", className);

  if (!isActivityType(item.type)) {
    return <ArrowRightLeft className={cn(iconClass, "text-muted-foreground")} aria-hidden />;
  }

  switch (item.type) {
    case Activity.TASK_CREATED:
      return <CirclePlus className={cn(iconClass, "text-emerald-500")} aria-hidden />;
    case Activity.SUBTASK_CREATED:
      return <ListPlus className={cn(iconClass, "text-violet-500")} aria-hidden />;
    case Activity.SUBTASK_DELETED:
      return <Trash2 className={cn(iconClass, "text-red-500")} aria-hidden />;
    case Activity.SUBTASK_TITLE_CHANGED:
      return <PencilLine className={cn(iconClass, "text-muted-foreground")} aria-hidden />;
    case Activity.SUBTASK_STATUS_CHANGED:
      if (meta.to && isSubtaskStatus(meta.to)) {
        return <SubtaskStatusIcon status={meta.to} className={iconClass} />;
      }
      return <ArrowRightLeft className={cn(iconClass, "text-amber-500")} aria-hidden />;
    case Activity.UPDATE_CREATED:
      return <MessageSquarePlus className={cn(iconClass, "text-rose-500")} aria-hidden />;
    default:
      return <ArrowRightLeft className={cn(iconClass, "text-muted-foreground")} aria-hidden />;
  }
}
