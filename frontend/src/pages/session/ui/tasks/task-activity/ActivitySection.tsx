import { Trash2 } from "lucide-react";

import type { TaskActivity } from "@/api/task-activity";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { KonoLoader } from "@/shared/ui/kono-loader";
import {
  taskDetailIconBtn,
  taskDetailSectionHeader,
  taskDetailSectionLabel,
} from "../task-details/task-details-ui";
import { ActivityComposer } from "./ActivityComposer";
import { ActivityTimeline } from "./ActivityTimeline";
import type { ActivityInlineReplyState } from "./ActivityInlineReply";

type ActivitySectionProps = {
  activity: TaskActivity[];
  activityLoading: boolean;
  onClear: () => void | Promise<void>;
  onReply: (item: TaskActivity) => void;
  commentText: string;
  onCommentTextChange: (value: string) => void;
  onSubmitComment: () => void;
  sending: boolean;
  inlineReply: ActivityInlineReplyState;
};

export function ActivitySection({
  activity,
  activityLoading,
  onClear,
  onReply,
  commentText,
  onCommentTextChange,
  onSubmitComment,
  sending,
  inlineReply,
}: ActivitySectionProps) {
  const hasActivity = activity.length > 0;

  return (
    <section className="min-w-0">
      <div
        className={cn(
          taskDetailSectionHeader,
          "flex items-center justify-between",
        )}
      >
        <div className="flex items-center gap-2.5">
          <h2 className={taskDetailSectionLabel}>Комментарии</h2>
          {hasActivity ? (
            <span className="inline-flex h-5 items-center justify-center rounded-full bg-muted/40 px-2.5 text-xs font-semibold text-muted-foreground tabular-nums ring-1 ring-border/30">
              {activity.length}
            </span>
          ) : null}
        </div>
        {hasActivity ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              taskDetailIconBtn,
              "transition-colors hover:bg-destructive/10 hover:text-destructive/80",
            )}
            aria-label="Очистить историю"
            title="Удалить всю историю активности"
            onClick={() => void onClear()}
          >
            <Trash2 className="size-3.5" />
          </Button>
        ) : null}
      </div>

      <div className="mt-3">
        <ActivityComposer
          commentText={commentText}
          onCommentTextChange={onCommentTextChange}
          onSubmit={onSubmitComment}
          sending={sending}
        />
      </div>

      {activityLoading && activity.length === 0 ? (
        <div className="py-6">
          <KonoLoader size="sm" hint="комментарии" />
        </div>
      ) : hasActivity ? (
        <div className="mt-4 min-w-0">
          <ActivityTimeline
            items={activity}
            onReply={onReply}
            inlineReply={inlineReply}
          />
        </div>
      ) : (
        <p className="mt-4 py-4 text-center text-[13px] text-muted-foreground/45">
          Пока нет комментариев и событий — напишите первое сообщение
        </p>
      )}
    </section>
  );
}
