import { Ghost, Mail, Moon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type PendingInvitesEmptyStateProps = {
  className?: string;
};

export function PendingInvitesEmptyState({
  className,
}: PendingInvitesEmptyStateProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-linear-to-br from-violet-500/5 via-background to-amber-500/5 px-4 py-5 text-center",
        className,
      )}
    >
      <div
        className="relative flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/15"
        aria-hidden
      >
        <Mail className="size-5 text-violet-600 dark:text-violet-400" />
        <Moon className="absolute -top-1 -right-1 size-4 text-amber-500/90" />
        <Ghost className="absolute -bottom-1 -left-1 size-3.5 text-muted-foreground/45" />
      </div>
      <div className="max-w-sm space-y-1">
        <h2 className="text-sm font-semibold text-foreground">Тишина в эфире</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Ожидают ответа — никто. Либо все уже с вами, либо ссылка до сих пор
          лежит во «Входящих» между рассылкой и купоном на пиццу.
        </p>
      </div>
    </section>
  );
}
