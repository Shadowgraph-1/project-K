import { cn } from "@/shared/lib/utils";

/** Отступ справа под счётчик «0/127» внутри поля (xAI-style). */
export function charCountPadding(maxLength: number) {
  const labelLen = String(maxLength).length * 2 + 1;
  if (labelLen >= 7) return "pr-16";
  if (labelLen >= 5) return "pr-14";
  return "pr-12";
}

type CharCountIndicatorProps = {
  valueLength: number;
  maxLength: number;
  /** Для однострочных полей — по центру по вертикали; для textarea — у верхнего края. */
  align?: "center" | "top";
  className?: string;
};

export function CharCountIndicator({
  valueLength,
  maxLength,
  align = "center",
  className,
}: CharCountIndicatorProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-1.5 flex items-center",
        align === "center" ? "inset-y-0" : "top-2.5",
        className,
      )}
      aria-hidden
    >
      <p
        className={cn(
          "text-xs tabular-nums text-muted-foreground",
          valueLength >= maxLength && "text-destructive",
        )}
      >
        {valueLength}/{maxLength}
      </p>
    </div>
  );
}
