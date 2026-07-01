import { ArrowUp, Reply } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Spinner } from "@/shared/ui/spinner";

const composerIconBtn =
  "size-7 shrink-0 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground";

type ActivityComposerProps = {
  commentText: string;
  onCommentTextChange: (value: string) => void;
  onSubmit: () => void;
  sending: boolean;
  isReply?: boolean;
};

export function ActivityComposer({
  commentText,
  onCommentTextChange,
  onSubmit,
  sending,
  isReply = false,
}: ActivityComposerProps) {
  const canSubmit = Boolean(commentText.trim()) && !sending;

  return (
    <div
      className={cn(
        "relative overflow-visible rounded-lg border border-input/60 bg-background transition-colors",
        "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/40",
      )}
    >
      <Textarea
        value={commentText}
        onChange={(e) => onCommentTextChange(e.target.value)}
        placeholder={isReply ? "Напишите ответ…" : "Оставить комментарий…"}
        rows={2}
        disabled={sending}
        maxLength={FIELD_LIMITS.activityComment}
        className="min-h-[44px] max-h-32 resize-none rounded-lg border-0 bg-transparent px-3 pb-1 pt-3 text-[14px] leading-relaxed text-foreground shadow-none placeholder:text-muted-foreground/45 focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent disabled:opacity-60 dark:bg-transparent dark:disabled:bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="flex items-center justify-end gap-1 px-3 pb-1.5 pt-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(
            composerIconBtn,
            canSubmit &&
              (isReply
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "bg-foreground text-background hover:bg-foreground/90 hover:text-background"),
            !canSubmit && "opacity-40",
          )}
          disabled={!canSubmit}
          aria-label={isReply ? "Отправить ответ" : "Отправить комментарий"}
          onClick={onSubmit}
        >
          {sending ? (
            <Spinner className="size-3.5" />
          ) : isReply ? (
            <Reply className="size-3.5" aria-hidden />
          ) : (
            <ArrowUp className="size-3.5" aria-hidden />
          )}
        </Button>
      </div>
    </div>
  );
}