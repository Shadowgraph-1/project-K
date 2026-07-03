import { DoorClosed, KeyRound, LockKeyhole } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import { cn } from "@/shared/lib/utils";

type LlmKeysTableEmptyStateProps = {
  className?: string;
};

export function LlmKeysTableEmptyState({
  className,
}: LlmKeysTableEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-linear-to-br from-violet-500/5 via-background to-indigo-500/5 px-4 py-6 sm:px-5",
        className,
      )}
    >
      <Empty className="gap-3 p-0">
        <EmptyHeader>
          <EmptyMedia
            variant="default"
            className="relative mb-0.5 flex size-14 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20"
          >
            <LockKeyhole className="absolute -top-1 -right-1 size-4 text-violet-500/70" />
            <KeyRound className="size-8 text-indigo-600 dark:text-indigo-400" />
            <DoorClosed className="absolute -bottom-1 -left-1 size-4 -rotate-6 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle className="text-base">Ключей пока нет</EmptyTitle>
          <EmptyDescription className="max-w-md">
            LLM стучится в дверь, а вы отвечаете «ключ под ковриком». Спойлер:
            под ковриком пусто. Добавьте настоящий apiKey — модель не умеет
            открывать отмычками.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
