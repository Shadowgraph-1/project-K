import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { formatReplyCount } from "./activity-thread-ui";

type ThreadRepliesContainerProps = {
  children: ReactNode;
  className?: string;
  replyCount: number;
  threadLineClassName?: string;
};

/** Ветка ответов: вертикальная линия и сворачивание как на YouTube / Reddit. */
export function ThreadRepliesContainer({
  children,
  className,
  replyCount,
  threadLineClassName,
}: ThreadRepliesContainerProps) {
  return (
    <details className={cn("group/replies mt-2 min-w-0", className)} open>
      <summary
        className={cn(
          "flex w-fit max-w-full cursor-pointer list-none items-center gap-1.5",
          "rounded-md px-1 py-1 text-[12px] font-semibold text-primary",
          "transition-colors hover:bg-primary/5 hover:underline",
          "[&::-webkit-details-marker]:hidden",
        )}
        aria-label={`${formatReplyCount(replyCount)}. Нажмите, чтобы развернуть или свернуть.`}
      >
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            "-rotate-90 group-open/replies:rotate-0",
          )}
          aria-hidden
        />
        <span className="group-open/replies:hidden">
          {formatReplyCount(replyCount)}
        </span>
        <span className="hidden group-open/replies:inline">Скрыть ответы</span>
      </summary>

      <div
        className={cn(
          "relative mt-2 ms-2 border-s-2 ps-4",
          threadLineClassName ?? "border-primary/20",
        )}
      >
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </details>
  );
}

type ThreadReplyItemProps = {
  children: ReactNode;
  className?: string;
};

export function ThreadReplyItem({
  children,
  className,
}: ThreadReplyItemProps) {
  return <div className={cn("relative min-w-0", className)}>{children}</div>;
}