import { Reply } from "lucide-react";

import type { TaskActivity } from "@/api/task-activity";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  ActivityActionIcon,
  isActivityReply,
} from "../activity-action-icons";
import {
  isCardActivity,
  isCommentActivity,
  resolveActivityAuthor,
} from "../task-feed/build-activity-feed";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { ActivityThreadMeta } from "./ActivityThreadMeta";
import {
  ActivityInlineReplySlot,
  type ActivityInlineReplyState,
} from "./ActivityInlineReply";
import { activityIconSurfaceClass, activityThreadLineClass } from "./activity-entity-tones";
import {
  ThreadRepliesContainer,
  ThreadReplyItem,
} from "./ActivityThreadline";
import {
  MAX_THREAD_DEPTH,
  THREAD_GRID,
} from "./activity-thread-ui";

function ThreadAvatar({ item }: { item: TaskActivity }) {
  if (isCardActivity(item)) {
    return (
      <UserAvatar
        label={resolveActivityAuthor(item)}
        size={24}
        className="shrink-0"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full [&_svg]:size-3.5",
        activityIconSurfaceClass(item),
      )}
    >
      <ActivityActionIcon item={item} />
    </div>
  );
}

function ThreadReplyAction({ onReply }: { onReply: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="h-7 gap-1 rounded-md px-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
      onClick={onReply}
    >
      <Reply className="size-3" aria-hidden />
      Ответить
    </Button>
  );
}

function ThreadBody({
  item,
  onReply,
  inlineReply,
  inGrid = true,
}: {
  item: TaskActivity;
  onReply: () => void;
  inlineReply: ActivityInlineReplyState;
  inGrid?: boolean;
}) {
  const isCard = isCardActivity(item);
  const body = item.body?.trim() ?? "";
  const canReply = item.type !== "task.created";

  return (
    <div className={cn("min-w-0 space-y-1.5", inGrid && "col-start-2")}>
      {isCard && body ? (
        <p className="text-[14px] leading-relaxed text-foreground/90">{body}</p>
      ) : null}
      {canReply ? <ThreadReplyAction onReply={onReply} /> : null}
      <ActivityInlineReplySlot itemId={item.id} inlineReply={inlineReply} />
    </div>
  );
}

function ActivityCommentReply({
  item,
  repliesByParent,
  onReply,
  inlineReply,
}: {
  item: TaskActivity;
  repliesByParent: Map<string, TaskActivity[]>;
  onReply: (item: TaskActivity) => void;
  inlineReply: ActivityInlineReplyState;
}) {
  const body = item.body?.trim() ?? "";
  const nestedComments = (repliesByParent.get(item.id) ?? []).filter(
    isCommentActivity,
  );
  const hasNested = nestedComments.length > 0;

  return (
    <article className="relative min-w-0">
      <div className="flex gap-2.5">
        <UserAvatar
          label={resolveActivityAuthor(item)}
          size={24}
          className="mt-0.5 shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <ActivityThreadMeta
            item={item}
            isReply={isActivityReply(item)}
          />
          {body ? (
            <p className="text-[14px] leading-relaxed text-foreground/90">
              {body}
            </p>
          ) : null}
          <div className="flex items-center">
            <ThreadReplyAction onReply={() => onReply(item)} />
          </div>
          <ActivityInlineReplySlot itemId={item.id} inlineReply={inlineReply} />
        </div>
      </div>

      {hasNested ? (
        <ThreadRepliesContainer
          replyCount={nestedComments.length}
          threadLineClassName={activityThreadLineClass(item)}
        >
          {nestedComments.map((reply) => (
            <ThreadReplyItem key={reply.id}>
              <ActivityCommentReply
                item={reply}
                repliesByParent={repliesByParent}
                onReply={onReply}
                inlineReply={inlineReply}
              />
            </ThreadReplyItem>
          ))}
        </ThreadRepliesContainer>
      ) : null}
    </article>
  );
}

function ActivityThreadBranch({
  parentItem,
  replies,
  repliesByParent,
  onReply,
  inlineReply,
  depth,
}: {
  parentItem: TaskActivity;
  replies: TaskActivity[];
  repliesByParent: Map<string, TaskActivity[]>;
  onReply: (item: TaskActivity) => void;
  inlineReply: ActivityInlineReplyState;
  depth: number;
}) {
  if (replies.length === 0) return null;

  return (
    <ThreadRepliesContainer
      replyCount={replies.length}
      threadLineClassName={activityThreadLineClass(parentItem)}
    >
      {replies.map((reply) => (
        <ThreadReplyItem key={reply.id}>
          {isCommentActivity(reply) ? (
            <ActivityCommentReply
              item={reply}
              repliesByParent={repliesByParent}
              onReply={onReply}
              inlineReply={inlineReply}
            />
          ) : (
            <ActivityThreadNode
              item={reply}
              repliesByParent={repliesByParent}
              onReply={onReply}
              inlineReply={inlineReply}
              depth={depth + 1}
              showLeadingAvatar
            />
          )}
        </ThreadReplyItem>
      ))}
    </ThreadRepliesContainer>
  );
}

type ActivityThreadNodeProps = {
  item: TaskActivity;
  repliesByParent: Map<string, TaskActivity[]>;
  onReply: (item: TaskActivity) => void;
  inlineReply: ActivityInlineReplyState;
  depth?: number;
  showLeadingAvatar?: boolean;
};

export function ActivityThreadNode({
  item,
  repliesByParent,
  onReply,
  inlineReply,
  depth = 0,
  showLeadingAvatar = true,
}: ActivityThreadNodeProps) {
  if (isCommentActivity(item)) {
    return (
      <ActivityCommentReply
        item={item}
        repliesByParent={repliesByParent}
        onReply={onReply}
        inlineReply={inlineReply}
      />
    );
  }

  const replies = repliesByParent.get(item.id) ?? [];
  const hasReplies = replies.length > 0 && depth < MAX_THREAD_DEPTH;

  const eventHeader = showLeadingAvatar ? (
    <div className={cn(THREAD_GRID, "items-start")}>
      <div className="flex justify-center pt-0.5">
        <ThreadAvatar item={item} />
      </div>
      <div className="min-w-0 pt-0.5">
        <ActivityThreadMeta item={item} />
      </div>
    </div>
  ) : (
    <div className="flex min-h-8 items-center">
      <ActivityThreadMeta item={item} />
    </div>
  );

  const eventBodyRow = showLeadingAvatar ? (
    <div className={cn(THREAD_GRID, "mt-1")}>
      <div aria-hidden />
      <ThreadBody
        item={item}
        onReply={() => onReply(item)}
        inlineReply={inlineReply}
      />
    </div>
  ) : (
    <div className="mt-1">
      <ThreadBody
        item={item}
        onReply={() => onReply(item)}
        inlineReply={inlineReply}
        inGrid={false}
      />
    </div>
  );

  return (
    <article className="relative min-w-0">
      {eventHeader}
      {eventBodyRow}
      {hasReplies ? (
        <ActivityThreadBranch
          parentItem={item}
          replies={replies}
          repliesByParent={repliesByParent}
          onReply={onReply}
          inlineReply={inlineReply}
          depth={depth}
        />
      ) : null}
    </article>
  );
}
