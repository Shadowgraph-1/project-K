import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { sessionPillOutline } from "@/pages/session/lib/session-styles";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export type SessionEmptyAction = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
};

export type SessionEmptySuggestion = {
  title: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
  onClick: () => void;
  actionLabel?: string;
};

export type SessionEmptyPageProps = {
  title: string;
  description?: string;
  suggestions?: SessionEmptySuggestion[];
  primaryAction?: SessionEmptyAction;
  secondaryAction?: SessionEmptyAction;
  footerAction?: SessionEmptyAction;
  className?: string;
};

function SessionEmptyFooterButton({ action }: { action: SessionEmptyAction }) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        sessionPillOutline,
        "h-9 gap-1.5 rounded-full px-4 font-medium text-foreground ring-primary/15 hover:bg-primary/5",
      )}
      onClick={action.onClick}
    >
      {action.icon}
      {action.label}
    </Button>
  );
}

function SessionEmptyPrimaryButton({ action }: { action: SessionEmptyAction }) {
  return (
    <Button
      type="button"
      className="h-9 gap-1.5 rounded-full px-4"
      onClick={action.onClick}
    >
      {action.icon}
      {action.label}
    </Button>
  );
}

function SessionEmptySuggestionRow({
  suggestion,
}: {
  suggestion: SessionEmptySuggestion;
}) {
  return (
    <button
      type="button"
      aria-label={suggestion.title}
      onClick={suggestion.onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 py-3 pl-2 pr-3 text-left",
        "transition-colors duration-150 hover:bg-muted/45",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full [&_svg]:size-4",
          suggestion.iconClassName,
        )}
      >
        {suggestion.icon}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="shrink-0 text-sm font-medium tracking-[-0.3px] text-foreground">
          {suggestion.title}
        </p>
        <p className="min-w-0 truncate text-sm font-medium tracking-[-0.3px] text-muted-foreground">
          {suggestion.description}
        </p>
        <span
          aria-hidden
          className={cn(
            "ml-auto flex shrink-0 items-center gap-1.5 text-sm font-medium tracking-[-0.3px] text-muted-foreground",
            "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          {suggestion.actionLabel ?? "Попробовать"}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </button>
  );
}

export function SessionEmptyPage({
  title,
  description,
  suggestions,
  primaryAction,
  secondaryAction,
  footerAction,
  className,
}: SessionEmptyPageProps) {
  const hasSuggestions = (suggestions?.length ?? 0) > 0;
  const hasInlineActions = Boolean(primaryAction || secondaryAction);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-12",
        className,
      )}
    >
      <div className="w-full max-w-2xl">
        <section className="flex flex-col items-center gap-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {hasSuggestions ? (
            <section className="flex w-full flex-col">
              <div className="flex w-full flex-col divide-y divide-border/50">
                {suggestions!.map((item) => (
                  <SessionEmptySuggestionRow key={item.title} suggestion={item} />
                ))}
              </div>
            </section>
          ) : null}

          {footerAction ? (
            <div className="flex justify-center pt-1">
              <SessionEmptyFooterButton action={footerAction} />
            </div>
          ) : null}

          {hasInlineActions && !footerAction ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {primaryAction ? (
                <SessionEmptyPrimaryButton action={primaryAction} />
              ) : null}
              {secondaryAction ? (
                <SessionEmptyFooterButton action={secondaryAction} />
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
