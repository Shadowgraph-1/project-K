import { useEffect, useState } from "react";
import { Spinner } from "@/shared/ui/spinner";

import type { TaskActivity } from "@/api/task-activity";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { avatarColorClass } from "@/shared/lib/avatar-colors";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";

function getUserLabel(user: { name?: string; email?: string } | null) {
  return user?.name?.trim() || user?.email || "Вы";
}

function replyTargetPreview(item: TaskActivity) {
  const body = item.body?.trim();
  if (body) return body.length > 120 ? `${body.slice(0, 120)}…` : body;
  return item.title;
}

type DialogReplyActivityProps = {
  target: TaskActivity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: string, parentActivityId: string) => void | Promise<void>;
};

export function DialogReplyActivity({
  target,
  open,
  onOpenChange,
  onSubmit,
}: DialogReplyActivityProps) {
  const user = useAuthStore((state) => state.user);
  const label = getUserLabel(user);

  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) setText("");
  }, [open]);

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) return;
    onOpenChange(nextOpen);
    if (!nextOpen) setText("");
  }

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || !target || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed, target.id);
      setText("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/50 px-6 py-4 text-left">
          <DialogTitle className="text-base font-medium">Ответ</DialogTitle>
          <DialogDescription className="sr-only">
            Комментарий к записи в активности задачи
          </DialogDescription>
        </DialogHeader>

        {target ? (
          <div className="flex flex-col gap-4 px-6 py-4">
            <blockquote className="rounded-lg border border-border/50 bg-muted/25 px-3 py-2.5 text-sm text-muted-foreground">
              {replyTargetPreview(target)}
            </blockquote>

            <div className="flex items-center gap-2">
              <Avatar className="size-[18px]">
                <AvatarFallback
                  className={cn(
                    "text-[9px] font-semibold",
                    avatarColorClass(label),
                  )}
                >
                  {label.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>

            <Textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Написать ответ…"
              rows={4}
              disabled={isSubmitting}
              className="min-h-24 resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
            />
            <p className="text-[11px] text-muted-foreground/60">
              Ctrl+Enter — отправить
            </p>
          </div>
        ) : null}

        <DialogFooter className="shrink-0 border-t border-border/60 bg-muted/10 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!text.trim() || !target || isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Отправка…
              </>
            ) : (
              "Ответить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
