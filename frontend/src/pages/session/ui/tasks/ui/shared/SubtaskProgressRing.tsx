import { cn } from "@/shared/lib/utils";

type SubtaskProgressRingProps = {
  done: number;
  total: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
};

/** Circular progress for subtasks: empty track, fills as done/total grows. */
export function SubtaskProgressRing({
  done,
  total,
  className,
  size = 14,
  strokeWidth = 1.75,
}: SubtaskProgressRingProps) {
  const safeTotal = Math.max(0, total);
  const safeDone = Math.min(Math.max(0, done), safeTotal);
  const progress = safeTotal > 0 ? safeDone / safeTotal : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const center = size / 2;
  const complete = safeTotal > 0 && safeDone === safeTotal;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* empty track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted-foreground/25"
      />
      {/* progress arc */}
      {progress > 0 ? (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-300",
            complete ? "text-emerald-500" : "text-emerald-500/80",
          )}
          transform={`rotate(-90 ${center} ${center})`}
        />
      ) : null}
    </svg>
  );
}

type SubtaskProgressBadgeProps = {
  done: number;
  total: number;
  className?: string;
  showLabel?: boolean;
};

export function SubtaskProgressBadge({
  done,
  total,
  className,
  showLabel = true,
}: SubtaskProgressBadgeProps) {
  if (total <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground/80",
        className,
      )}
    >
      <SubtaskProgressRing done={done} total={total} />
      {showLabel ? (
        <span>
          {done}/{total}
        </span>
      ) : null}
    </span>
  );
}
