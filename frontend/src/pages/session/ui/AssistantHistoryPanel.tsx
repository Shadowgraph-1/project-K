import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { motion } from "motion/react";
import { Bot, MessageSquareText, User, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { SessionCharacter } from "../model/sessionConstants";

type AssistantHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type AssistantHistoryPanelProps = {
  history: AssistantHistoryMessage[];
  selectedCharacter: SessionCharacter | undefined;
  onClose: () => void;
};

export function AssistantHistoryPanel({
  history,
  selectedCharacter,
  onClose,
}: AssistantHistoryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 26,
        stiffness: 380,
      }}
      className="overflow-hidden rounded-2xl border border-border/70 bg-linear-to-b from-card via-card to-muted/25 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.22)] ring-1 ring-black/6 dark:to-muted/15 dark:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.45)] dark:ring-white/[0.07]"
    >
      <div className="relative flex items-center justify-between gap-3 border-b border-border/60 bg-linear-to-r from-muted/40 via-muted/20 to-transparent px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm ring-1 ring-border/60">
            <MessageSquareText className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-tight text-foreground">
              История диалога
            </p>
            <p className="text-[11px] text-muted-foreground">
              {history.length === 0
                ? "Пока пусто"
                : `В истории: ${history.length}`}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={onClose}
          aria-label="Скрыть историю"
        >
          <X className="size-4" />
        </Button>
      </div>
      <div
        className={cn(
          "max-h-[min(42vh,260px)] overflow-y-auto px-3 py-3",
          "[scrollbar-width:thin]",
          "[scrollbar-color:hsl(var(--border))_transparent]",
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-border/90",
          "[&::-webkit-scrollbar-track]:bg-transparent",
        )}
      >
        {history.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="rounded-full bg-muted/70 p-4 ring-8 ring-muted/30">
              <MessageSquareText className="size-9 text-muted-foreground/75" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-foreground">
                Диалог ещё не начат
              </p>
              <p className="max-w-[260px] text-xs leading-relaxed text-muted-foreground">
                Напишите сообщение ниже — ответ появится здесь и сохранится при
                следующем открытии.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((msg, i) => (
              <div
                key={`${msg.role}-${i}-${msg.content.slice(0, 24)}`}
                className={cn(
                  "flex gap-2.5",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {msg.role === "assistant" ? (
                  <Avatar className="size-9 shrink-0 ring-2 ring-background shadow-sm">
                    <AvatarImage
                      src={selectedCharacter?.avatar}
                      alt=""
                    />
                    <AvatarFallback className="bg-muted text-xs font-semibold">
                      {selectedCharacter?.name?.[0] ?? (
                        <Bot className="size-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    aria-hidden
                  >
                    <User className="size-4" strokeWidth={2.25} />
                  </div>
                )}
                <div
                  className={cn(
                    "min-w-0 flex-1",
                    msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "inline-block max-w-full px-3.5 py-2.5 text-[13px] leading-relaxed wrap-anywhere whitespace-pre-wrap",
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "rounded-2xl rounded-bl-md border border-border/70 bg-background/90 text-foreground shadow-sm backdrop-blur-sm dark:bg-background/70",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
