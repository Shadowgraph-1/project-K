import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

import { getTaskStatus, type Task } from "@/entities/task/model/types";
import { cn } from "@/shared/lib/utils";
import { TaskStatusIcon } from "./task-status-icons";
import { normalizeTaskPriority, TaskPriorityIcon } from "./task-priority-icons";
import { formatShortDate } from "./task-feed";

type TaskTimelineProps = {
  tasks: Task[];
  isTaskChecked: (task: Task) => boolean;
  onOpenTask: (taskId: string) => void;
};

type DateBucket = "overdue" | "today" | "tomorrow" | "week" | "later" | "none";

type DateChapter = {
  id: string;
  label: string;
  hint?: string;
  bucket: DateBucket;
  tasks: Task[];
};

type FlowSegment = {
  chapterId: string;
  bucket: DateBucket;
  label: string;
  count: number;
};

const BUCKET_ORDER: DateBucket[] = [
  "overdue",
  "today",
  "tomorrow",
  "week",
  "later",
  "none",
];

const BUCKET_LABELS: Record<DateBucket, string> = {
  overdue: "Просрочено",
  today: "Сегодня",
  tomorrow: "Завтра",
  week: "На этой неделе",
  later: "Позже",
  none: "Без даты",
};

const BUCKET_SHORT: Record<DateBucket, string> = {
  overdue: "Просроч.",
  today: "Сегодня",
  tomorrow: "Завтра",
  week: "Неделя",
  later: "Позже",
  none: "Без даты",
};

const EMPTY_HINTS: Record<DateBucket, string> = {
  overdue: "Нет просроченных задач",
  today: "На сегодня ничего не запланировано",
  tomorrow: "Завтра свободно",
  week: "На этой неделе пусто",
  later: "Дальних дедлайнов нет",
  none: "Все задачи с датами",
};

function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffDays(from: Date, to: Date) {
  return Math.floor(
    (normalizeDate(to).getTime() - normalizeDate(from).getTime()) / 86400000,
  );
}

function formatTaskKey(id: string) {
  const compact = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `K-${compact}`;
}

function getAnchorDate(task: Task) {
  const raw = task.dueDate ?? task.startDate;
  return raw ? normalizeDate(new Date(raw)) : null;
}

function getBucket(task: Task, today: Date): DateBucket {
  const anchor = getAnchorDate(task);
  if (!anchor) return "none";

  const offset = diffDays(today, anchor);

  if (task.dueDate && getTaskStatus(task) !== "DONE" && offset < 0) {
    return "overdue";
  }

  if (offset === 0) return "today";
  if (offset === 1) return "tomorrow";

  const endOfWeek = new Date(today);
  const weekday = today.getDay();
  endOfWeek.setDate(today.getDate() + (weekday === 0 ? 0 : 7 - weekday));

  if (anchor <= endOfWeek && offset > 1) return "week";
  return "later";
}

function formatDateRange(task: Task) {
  const start = task.startDate ? formatShortDate(task.startDate) : null;
  const due = task.dueDate ? formatShortDate(task.dueDate) : null;

  if (start && due && start !== due) {
    return `${start} — ${due}`;
  }

  return due ?? start ?? "";
}

function formatChapterDate(date: Date) {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function groupTasksByDate(tasks: Task[], today: Date) {
  const groups = new Map<DateBucket, Task[]>();

  for (const bucket of BUCKET_ORDER) {
    groups.set(bucket, []);
  }

  for (const task of tasks) {
    groups.get(getBucket(task, today))!.push(task);
  }

  for (const [bucket, bucketTasks] of groups) {
    bucketTasks.sort((a, b) => {
      const aDate = getAnchorDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bDate = getAnchorDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;

      if (bucket === "overdue") return aDate - bDate;
      if (bucket === "none") return a.title.localeCompare(b.title, "ru");
      return aDate - bDate || a.title.localeCompare(b.title, "ru");
    });
  }

  return groups;
}

function groupByAnchorDate(tasks: Task[]) {
  const map = new Map<number, Task[]>();

  for (const task of tasks) {
    const anchor = getAnchorDate(task);
    if (!anchor) continue;
    const key = anchor.getTime();
    const list = map.get(key) ?? [];
    list.push(task);
    map.set(key, list);
  }

  return [...map.entries()].sort(([a], [b]) => a - b);
}

function buildChapters(groups: Map<DateBucket, Task[]>): DateChapter[] {
  const chapters: DateChapter[] = [];

  for (const bucket of ["overdue", "today", "tomorrow"] as const) {
    chapters.push({
      id: bucket,
      label: BUCKET_LABELS[bucket],
      bucket,
      tasks: groups.get(bucket) ?? [],
    });
  }

  for (const bucket of ["week", "later"] as const) {
    const bucketTasks = groups.get(bucket) ?? [];
    if (bucketTasks.length === 0) {
      chapters.push({
        id: bucket,
        label: BUCKET_LABELS[bucket],
        bucket,
        tasks: [],
      });
      continue;
    }

    for (const [time, dateTasks] of groupByAnchorDate(bucketTasks)) {
      chapters.push({
        id: `${bucket}-${time}`,
        label: formatChapterDate(new Date(time)),
        hint: BUCKET_LABELS[bucket],
        bucket,
        tasks: dateTasks,
      });
    }
  }

  chapters.push({
    id: "none",
    label: BUCKET_LABELS.none,
    bucket: "none",
    tasks: groups.get("none") ?? [],
  });

  return chapters;
}

function buildFlowSegments(
  chapters: DateChapter[],
  groups: Map<DateBucket, Task[]>,
): FlowSegment[] {
  return BUCKET_ORDER.map((bucket) => {
    const count = groups.get(bucket)?.length ?? 0;

    let chapterId: string = bucket;
    if (bucket === "week" || bucket === "later") {
      chapterId = chapters.find((c) => c.bucket === bucket)?.id ?? bucket;
    }

    return {
      chapterId,
      bucket,
      label: BUCKET_LABELS[bucket],
      count,
    };
  });
}

function formatTaskCount(total: number) {
  if (total === 1) return "задача";
  if (total > 1 && total < 5) return "задачи";
  return "задач";
}

function FlowSegmentCell({
  segment,
  isActive,
  onJump,
}: {
  segment: FlowSegment;
  isActive: boolean;
  onJump: (chapterId: string) => void;
}) {
  const isEmpty = segment.count === 0;

  return (
    <button
      type="button"
      onClick={() => onJump(segment.chapterId)}
      className={cn(
        "timeline-flow-segment flex min-w-[5rem] flex-1 flex-col gap-1 px-3 py-2.5 text-left transition-colors",
        isEmpty && "timeline-flow-segment--empty",
        isActive && "timeline-flow-segment--active",
      )}
    >
      <span className="truncate text-[10px] text-muted-foreground">
        {BUCKET_SHORT[segment.bucket]}
      </span>
      <span
        className={cn(
          "text-xl font-normal leading-none tracking-tight tabular-nums",
          isEmpty ? "text-muted-foreground/25" : "text-foreground",
        )}
      >
        {isEmpty ? "—" : segment.count}
      </span>
    </button>
  );
}

function FlowMap({
  segments,
  activeId,
  onJump,
}: {
  segments: FlowSegment[];
  activeId: string | null;
  onJump: (chapterId: string) => void;
}) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="timeline-flow-map shrink-0 border-b border-border/50 px-4 py-3">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <p className="text-xs text-muted-foreground">Обзор по срокам</p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {total} {formatTaskCount(total)}
        </p>
      </div>

      <div className="timeline-flow-panel session-panel-scroll overflow-x-auto">
        <div className="timeline-flow-grid min-w-full">
          {segments.map((segment) => (
            <FlowSegmentCell
              key={segment.bucket}
              segment={segment}
              isActive={activeId === segment.chapterId}
              onJump={onJump}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyChapterSlot({ bucket }: { bucket: DateBucket }) {
  return (
    <p className="py-1 text-xs text-muted-foreground/55">{EMPTY_HINTS[bucket]}</p>
  );
}

function DateTaskCard({
  task,
  checked,
  onOpen,
}: {
  task: Task;
  checked: boolean;
  onOpen: (id: string) => void;
}) {
  const status = getTaskStatus(task);
  const priority = normalizeTaskPriority(task.tags);
  const dateLabel = formatDateRange(task);
  const isDone = status === "DONE";

  return (
    <button
      type="button"
      onClick={() => onOpen(task.id)}
      className={cn(
        "flex w-full flex-col gap-1 rounded-2xl bg-muted/40 p-2.5 text-left ring-1 ring-border/30",
        isDone && "bg-muted/40",
        checked && "opacity-65",
      )}
    >
      <div className="flex items-center gap-1.5">
        <TaskStatusIcon status={status} className="size-3.5 shrink-0" />
        <span className="font-mono text-[10px] text-muted-foreground">
          {formatTaskKey(task.id)}
        </span>
        {priority ? (
          <TaskPriorityIcon priority={priority} className="ml-auto size-3.5 shrink-0" />
        ) : null}
      </div>
      <span
        className={cn(
          "line-clamp-2 text-[13px] font-medium leading-snug text-foreground",
          checked && "line-through",
        )}
      >
        {task.title}
      </span>
      {dateLabel ? (
        <span className="text-[11px] text-muted-foreground">{dateLabel}</span>
      ) : null}
    </button>
  );
}

function buildDefaultExpanded(chapters: DateChapter[]) {
  const expanded = new Set<string>();
  for (const chapter of chapters) {
    if (chapter.tasks.length > 0) {
      expanded.add(chapter.id);
    }
  }
  return expanded;
}

function TaskTimeline({ tasks, isTaskChecked, onOpenTask }: TaskTimelineProps) {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const groups = useMemo(() => groupTasksByDate(tasks, today), [tasks, today]);
  const chapters = useMemo(() => buildChapters(groups), [groups]);
  const segments = useMemo(() => buildFlowSegments(chapters, groups), [chapters, groups]);
  const defaultExpanded = useMemo(() => buildDefaultExpanded(chapters), [chapters]);
  const chapterRefs = useRef(new Map<string, HTMLElement>());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedOverrides, setExpandedOverrides] = useState<Record<string, boolean>>({});

  const isChapterExpanded = useCallback(
    (chapterId: string) => {
      if (chapterId in expandedOverrides) {
        return expandedOverrides[chapterId];
      }
      return defaultExpanded.has(chapterId);
    },
    [defaultExpanded, expandedOverrides],
  );

  const toggleChapter = useCallback(
    (chapterId: string) => {
      setExpandedOverrides((prev) => ({
        ...prev,
        [chapterId]: !isChapterExpanded(chapterId),
      }));
    },
    [isChapterExpanded],
  );

  const jumpToChapter = useCallback((chapterId: string) => {
    setActiveId(chapterId);
    setExpandedOverrides((prev) => ({ ...prev, [chapterId]: true }));
    const node = chapterRefs.current.get(chapterId);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const setChapterRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      chapterRefs.current.set(id, node);
    } else {
      chapterRefs.current.delete(id);
    }
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">Нет задач</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Добавьте задачу с дедлайном — она появится в обзоре по срокам.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <FlowMap segments={segments} activeId={activeId} onJump={jumpToChapter} />

      <div className="session-panel-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex list-none flex-col gap-1 p-0">
          {chapters.map((chapter) => {
            const isEmpty = chapter.tasks.length === 0;
            const expanded = isChapterExpanded(chapter.id);

            return (
              <li
                key={chapter.id}
                ref={(node) => setChapterRef(chapter.id, node)}
                id={`chapter-${chapter.id}`}
                className="min-w-0 scroll-mt-28"
              >
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-1.5 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-muted/35"
                >
                  <ChevronRight
                    className={cn(
                      "size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200",
                      expanded && "rotate-90",
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    {chapter.hint ? (
                      <span className="text-[11px] text-muted-foreground">
                        {chapter.hint}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "text-[13px] font-medium capitalize tracking-tight",
                        isEmpty ? "text-muted-foreground/65" : "text-foreground",
                      )}
                    >
                      {chapter.label}
                    </span>
                    <span
                      className={cn(
                        "ml-auto text-xs tabular-nums",
                        isEmpty ? "text-muted-foreground/35" : "text-muted-foreground",
                      )}
                    >
                      {isEmpty ? "—" : chapter.tasks.length}
                    </span>
                  </span>
                </button>

                {expanded ? (
                  <div className="pb-4 pl-5">
                    {isEmpty ? (
                      <EmptyChapterSlot bucket={chapter.bucket} />
                    ) : (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {chapter.tasks.map((task) => (
                          <DateTaskCard
                            key={task.id}
                            task={task}
                            checked={isTaskChecked(task)}
                            onOpen={onOpenTask}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TaskTimeline;
