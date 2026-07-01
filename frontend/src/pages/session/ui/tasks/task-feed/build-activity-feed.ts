import type { TaskActivity } from "@/api/task-activity";
import { Activity } from "@/shared/constants/activity-types";
import { getActivityMetadata } from "../activity-action-icons";

export function isCommentActivity(item: TaskActivity) {
  return item.type === Activity.UPDATE_CREATED && Boolean(item.body?.trim());
}

export function resolveActivityAuthor(item: TaskActivity) {
  if (item.authorName?.trim()) return item.authorName.trim();
  if (item.userId != null) return "Пользователь";
  return "Система";
}

export function isCardActivity(item: TaskActivity) {
  const body = item.body?.trim();
  if (!body) return false;
  return item.type === Activity.UPDATE_CREATED;
}

export type ActivityFeed = {
  roots: TaskActivity[];
  repliesByParent: Map<string, TaskActivity[]>;
};

export function buildActivityFeed(
  items: TaskActivity[],
  options?: { rootOrder?: "asc" | "desc" },
): ActivityFeed {
  const repliesByParent = new Map<string, TaskActivity[]>();
  const roots: TaskActivity[] = [];
  const itemIds = new Set(items.map((i) => i.id));

  for (const item of items) {
    const parentId = getActivityMetadata(item).parentActivityId;
    if (parentId && itemIds.has(parentId)) {
      const list = repliesByParent.get(parentId) ?? [];
      list.push(item);
      repliesByParent.set(parentId, list);
    } else {
      roots.push(item);
    }
  }

  for (const replies of repliesByParent.values()) {
    replies.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  const rootOrder = options?.rootOrder ?? "desc";
  roots.sort((a, b) => {
    const diff =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return rootOrder === "desc" ? diff : -diff;
  });

  return { roots, repliesByParent };
}
