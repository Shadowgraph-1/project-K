import { CalendarDays, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import type { Tasks } from "@/entities/task/model/useSessionTasks";

type TaskTimelineProps = {
  tasks: Tasks[];
};

const ROW_HEIGHT = 42;

function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function diffDays(a: Date, b: Date) {
  return Math.floor(
    (normalizeDate(b).getTime() - normalizeDate(a).getTime()) / 86400000,
  );
}

function getDaysRange(tasks: Tasks[]) {
  const today = normalizeDate(new Date());

  const dates = tasks
    .flatMap((t) => [t.startDate, t.dueDate])
    .filter(Boolean)
    .map((d) => new Date(d!));

  const max = dates.length
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : today;

  const end = new Date(Math.max(max.getTime(), today.getTime() + 7 * 86400000));

  const days: Date[] = [];
  const cur = new Date(today);

  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return days;
}

function formatDay(date: Date) {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

function getTaskRange(task: Tasks) {
  const start = normalizeDate(new Date(task.startDate ?? task.dueDate!));
  const end = normalizeDate(new Date(task.dueDate ?? task.startDate!));
  return { start, end };
}

function TaskTimeline({ tasks }: TaskTimelineProps) {
  const today = normalizeDate(new Date());

  const tasksWithDates = tasks.filter((t) => t.startDate || t.dueDate);
  const days = getDaysRange(tasksWithDates);
  const n = days.length;

  const gridTemplate =
    n > 0 ? `repeat(${n}, minmax(0, 1fr))` : "minmax(0, 1fr)";

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Планировщик задач
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ближайшие даты, дедлайны и рабочий ритм в одном месте
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-8 rounded-xl text-muted-foreground",
            )}
            aria-label="Дополнительно"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>Функция в разработке</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full min-w-0 px-0">
        {n === 0 ? (
          <div className="flex h-[240px] items-center justify-center">
            <p className="rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
              Нет диапазона дат
            </p>
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{
              minHeight:
                tasksWithDates.length > 0
                  ? tasksWithDates.length * ROW_HEIGHT + 140
                  : 240,
            }}
          >
            <div
              className="grid w-full border-b border-border/60 bg-background/70"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {days.map((day) => {
                const todayCol = isSameDay(day, today);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "relative min-w-0 px-2 py-4 sm:px-3",
                      "border-r border-border/50 last:border-r-0",
                      isWeekend(day) && "bg-muted/25",
                    )}
                  >
                    <div
                      className={cn(
                        "inline-flex max-w-full rounded-full px-2 py-1 text-[11px] font-medium",
                        todayCol
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground",
                      )}
                    >
                      <span className="truncate">{formatDay(day)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="pointer-events-none grid w-full"
              style={{ gridTemplateColumns: gridTemplate }}
              aria-hidden
            >
              {days.map((day) => (
                <div
                  key={`grid-${day.toISOString()}`}
                  className="min-h-[10px] border-r border-border/40 last:border-r-0"
                />
              ))}
            </div>

            <div className="relative w-full pt-5">
              {tasksWithDates.map((task, index) => {
                const { start, end } = getTaskRange(task);

                const startOffset = Math.max(0, diffDays(days[0], start));
                const duration = Math.max(diffDays(start, end) + 1, 1);

                const leftPct = (startOffset / n) * 100;
                const widthPct = (duration / n) * 100;

                const top = index * ROW_HEIGHT + 12;

                return (
                  <div
                    key={task.id}
                    className="absolute box-border px-1"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      top,
                    }}
                  >
                    <div
                      className={cn(
                        "flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5",
                        task.checked
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground shadow-sm",
                      )}
                    >
                      <span className="shrink-0 text-[10px] font-semibold opacity-70">
                        {formatDay(start)}
                      </span>

                      <span
                        className={cn(
                          "min-w-0 truncate text-[10px] font-medium",
                          task.checked && "line-through",
                        )}
                      >
                        {task.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {tasksWithDates.length === 0 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[72px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Добавьте задачу с датой, чтобы увидеть её на планировщике.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskTimeline;
