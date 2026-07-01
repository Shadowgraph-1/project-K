import { Reply, X } from "lucide-react";

import type { TaskActivity } from "@/api/task-activity";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { resolveActivityAuthor } from "../task-feed";

function truncateText(text: string, max = 120) {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

type ActivityReplyPreviewProps = {
  target: TaskActivity;
  onCancel: () => void;
  className?: string;
};

export function ActivityReplyPreview({
  target,
  onCancel,
  className,
}: ActivityReplyPreviewProps) {
  const author = resolveActivityAuthor(target);
  const preview = truncateText(target.body?.trim() ?? "");

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md bg-primary/5 py-1.5 pr-1 pl-2.5",
        className,
      )}
    >
      <Reply
        className="mt-0.5 size-3.5 shrink-0 text-primary/70"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-primary/80">
          Ответ {author}
        </p>
        {preview ? (
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
            {preview}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Отменить ответ"
        onClick={onCancel}
      >
        <X className="size-3" aria-hidden />
      </Button>
    </div>
  );
}
