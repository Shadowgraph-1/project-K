import { Reply } from "lucide-react";

import type { TaskActivity } from "@/api/task-activity";
import {
  formatActivityActionText,
  getActivityEntityName,
  getActivityMetadata,
  isSubtaskStatus,
} from "../shared/activity-action-icons";
import { Activity } from "@/shared/constants/activity-types";
import { isCardActivity, resolveActivityAuthor } from "../../lib/build-activity-feed";
import { formatActivityDate } from "../../lib/format-activity-date";
import { getSubtaskStatusLabel } from "@/shared/constants/subtask-statuses";
import {
  activityEntityBadgeClass,
  getActivityEntityTone,
  type ActivityEntityTone,
} from "./activity-entity-tones";

function ReplyBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300">
      <Reply className="size-2.5" aria-hidden />
      ответ
    </span>
  );
}

function ActivityEntityName({
  children,
  tone,
}: {
  children: string;
  tone: ActivityEntityTone;
}) {
  return <span className={activityEntityBadgeClass(tone)}>{children}</span>;
}

function ActivityStatusLabel({
  children,
  tone = "slate",
}: {
  children: string;
  tone?: ActivityEntityTone;
}) {
  return (
    <span className={activityEntityBadgeClass(tone, "font-medium")}>
      {children}
    </span>
  );
}

export function ActivityThreadMeta({
  item,
  isReply = false,
}: {
  item: TaskActivity;
  isReply?: boolean;
}) {
  const author = resolveActivityAuthor(item);
  const meta = getActivityMetadata(item);
  const fromStatus = meta.from;
  const toStatus = meta.to;

  if (isCardActivity(item)) {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] leading-snug">
        <span className="truncate font-semibold text-foreground">{author}</span>
        {isReply ? <ReplyBadge /> : null}
        <span className="text-muted-foreground/40" aria-hidden>
          ·
        </span>
        <time className="shrink-0 tabular-nums text-muted-foreground/55">
          {formatActivityDate(item.createdAt)}
        </time>
      </div>
    );
  }

  const entityName = getActivityEntityName(item);
  const tone = getActivityEntityTone(item);

  return (
    <div className="min-w-0 text-[12px] leading-snug text-muted-foreground">
      <span className="font-semibold text-foreground">{author}</span>
      {item.type === Activity.SUBTASK_STATUS_CHANGED &&
      fromStatus &&
      toStatus &&
      isSubtaskStatus(fromStatus) &&
      isSubtaskStatus(toStatus) ? (
        <>
          {" "}
          изменил статус подзадачи
          {entityName ? (
            <>
              {" "}
              <ActivityEntityName tone="amber">{entityName}</ActivityEntityName>
            </>
          ) : null}
          {": "}
          <ActivityStatusLabel tone="slate">
            {getSubtaskStatusLabel(fromStatus)}
          </ActivityStatusLabel>
          {" → "}
          <ActivityStatusLabel tone="amber">
            {getSubtaskStatusLabel(toStatus)}
          </ActivityStatusLabel>
        </>
      ) : item.type === Activity.SUBTASK_TITLE_CHANGED &&
        meta.from &&
        meta.to ? (
        <>
          {" "}
          переименовал подзадачу{" "}
          <ActivityEntityName tone="slate">{meta.from}</ActivityEntityName>
          {" → "}
          <ActivityEntityName tone="sky">{meta.to}</ActivityEntityName>
        </>
      ) : (
        <>
          {" "}
          {formatActivityActionText(item)}
          {entityName &&
          (item.type === Activity.SUBTASK_CREATED ||
            item.type === Activity.SUBTASK_DELETED ||
            item.type === Activity.TASK_CREATED) ? (
            <>
              {" "}
              <ActivityEntityName tone={tone}>{entityName}</ActivityEntityName>
            </>
          ) : null}
        </>
      )}
      <span className="mx-1.5 text-muted-foreground/40">·</span>
      <time className="tabular-nums text-muted-foreground/55">
        {formatActivityDate(item.createdAt)}
      </time>
    </div>
  );
}
