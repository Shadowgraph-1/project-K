import { useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Spinner } from "@/shared/ui/spinner";

type ActivityInlineReplyProps = {
  text: string;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  sending: boolean;
  className?: string;
};

export function ActivityInlineReply({
  text,
  onTextChange,
  onSubmit,
  onCancel,
  sending,
  className,
}: ActivityInlineReplyProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = Boolean(text.trim()) && !sending;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        "relative mt-2 overflow-visible rounded-md border border-border/60 bg-background",
        "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/40",
        className,
      )}
    >
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Напишите ответ…"
        rows={2}
        disabled={sending}
        maxLength={FIELD_LIMITS.activityComment}
        className="min-h-[36px] max-h-28 resize-none rounded-md border-0 bg-transparent px-2 pb-2 pt-3 text-[13px] leading-relaxed text-foreground shadow-none placeholder:text-muted-foreground/45 focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent disabled:opacity-60 dark:bg-transparent dark:disabled:bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
      />
      <div className="flex items-center justify-end gap-1.5 px-2 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 px-2.5 text-[11px] text-muted-foreground"
          disabled={sending}
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          type="button"
          size="xs"
          className="h-7 px-2.5 text-[11px]"
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          {sending ? <Spinner className="size-3" /> : "Ответить"}
        </Button>
      </div>
    </div>
  );
}

export type ActivityInlineReplyState = {
  targetId: string | null;
  text: string;
  sending: boolean;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function ActivityInlineReplySlot({
  itemId,
  inlineReply,
}: {
  itemId: string;
  inlineReply: ActivityInlineReplyState;
}) {
  if (inlineReply.targetId !== itemId) return null;

  return (
    <ActivityInlineReply
      text={inlineReply.text}
      onTextChange={inlineReply.onTextChange}
      onSubmit={inlineReply.onSubmit}
      onCancel={inlineReply.onCancel}
      sending={inlineReply.sending}
    />
  );
}
