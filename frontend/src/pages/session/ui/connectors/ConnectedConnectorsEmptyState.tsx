import { Palmtree, PlugZap, Sun } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import { cn } from "@/shared/lib/utils";

type ConnectedConnectorsEmptyStateProps = {
  className?: string;
};

export function ConnectedConnectorsEmptyState({
  className,
}: ConnectedConnectorsEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-linear-to-br from-amber-500/5 via-background to-sky-500/5 px-4 py-6 sm:px-5",
        className,
      )}
    >
      <Empty className="gap-3 p-0">
        <EmptyHeader>
          <EmptyMedia
            variant="default"
            className="relative mb-0.5 flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20"
          >
            <Sun className="absolute -top-1 -right-1 size-5 text-amber-500/80" />
            <Palmtree className="size-8 text-emerald-600 dark:text-emerald-400" />
            <PlugZap className="absolute -bottom-1 -left-1 size-4 -rotate-12 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle className="text-base">
            Подключённых коннекторов нет
          </EmptyTitle>
          <EmptyDescription className="max-w-md">
            Видимо, у них выходные: Telegram загорает, Slack на ретрите, а
            GitHub уехал без ноутбука. Пока отдыхают — загляни в рекомендуемые
            ниже.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
