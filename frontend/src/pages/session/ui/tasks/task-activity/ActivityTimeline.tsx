import type { TaskActivity } from "@/api/task-activity";
import { cn } from "@/shared/lib/utils";
import { ActivityActionIcon } from "../activity-action-icons";
import { activityIconRingClass } from "./activity-entity-tones";
import { buildActivityFeed } from "../task-feed";
import type { ActivityInlineReplyState } from "./ActivityInlineReply";
import { ActivityThreadNode } from "./ActivityThreadNode";
import { ActivityTimelineRail } from "./ActivityTimelineRail";

type ActivityTimelineProps = {
  items: TaskActivity[];
  onReply: (item: TaskActivity) => void;
  inlineReply: ActivityInlineReplyState;
};

export function ActivityTimeline({
  items,
  onReply,
  inlineReply,
}: ActivityTimelineProps) {
  const timelineItems = items.filter((item) => item.type !== "task.created");
  const { roots, repliesByParent } = buildActivityFeed(timelineItems);
  if (roots.length === 0) return null;

  const showConnector = roots.length > 1;

  return (
    <ul className="relative flex list-none flex-col p-0" role="list">
      {showConnector ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-2.5 top-4 bottom-4 w-0.5 -translate-x-1/2 rounded-full bg-border/80"
        />
      ) : null}

      {roots.map((item, index) => {
        const isLast = index === roots.length - 1;

        return (
          <li
            key={item.id}
            role="listitem"
            className="relative flex min-w-0 items-start gap-2.5"
          >
            <ActivityTimelineRail
              icon={<ActivityActionIcon item={item} />}
              ringClassName={activityIconRingClass(item)}
            />
            <div className={cn("min-w-0 flex-1", !isLast && "pb-5")}>
              <ActivityThreadNode
                item={item}
                repliesByParent={repliesByParent}
                onReply={onReply}
                inlineReply={inlineReply}
                showLeadingAvatar={false}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
