import { useState, useEffect, type ReactNode } from "react";
import {
  ArrowUp,
  Box,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Mail,
  Plus,
  Reply,
  Trash2,
  UserRound,
  UserPlus,
  CornerDownRight,
} from "lucide-react";
import { memo } from "react";

import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Calendar } from "@/shared/ui/calendar";
import {
  getTaskStatus,
  TASK_STATUSES,
  useSessionTasks,
  type Tasks,
} from "@/entities/task/model/useSessionTasks";
import { updateTaskOnAPI, type TaskPatch } from "@/api/tasks";

import {
  createSubtaskOnApi,
  deleteSubtaskOnApi,
  getSubtasksOnApi,
  updateSubtaskOnApi,
  type Subtask,
  type SubtaskStatus,
} from "@/api/subtasks";

import {
  getTaskActivityOnApi,
  clearTaskActivityOnApi,
  type TaskActivity,
  createTaskActivityOnApi,
} from "@/api/task-activity";

import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { avatarColorClass } from "@/shared/lib/avatar-colors";
import { cn } from "@/shared/lib/utils";
import DialogUpdateTask from "./DialogUpdateTask";
import { DialogReplyActivity } from "./DialogReplyActivity";
import { SubtaskStatusIcon, TaskStatusIcon } from "./task-status-icons";
import { SubtaskStatusDropdown } from "./SubtaskStatusDropdown";
import {
  getTaskPriorityLabel,
  normalizeTaskPriority,
  TASK_PRIORITY_OPTIONS,
  TaskPriorityIcon,
} from "./task-priority-icons";
import {
  ActivityActionIcon,
  formatActivityActionText,
  getActivityMetadata,
  isActivityReply,
  isSubtaskStatus,
} from "./activity-action-icons";

import { useAuthStore } from "@/entities/user/model/useAuthStore";

import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import {
  useWorkspaceMembersQuery,
} from "@/entities/workspace/model/useWorkspaceMembersQuery";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";

import { notify } from "@/shared/lib/notify";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { KonoLoader } from "@/shared/ui/kono-loader";
import { Spinner } from "@/shared/ui/spinner";

type TaskDetailsPageProps = {
  task: Tasks;
  workspaceName?: string;
};

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatActivityDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} мин назад`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} ч назад`;
  const diffDay = Math.floor(diffH / 24);
  if (diffDay < 7) return `${diffDay} дн назад`;
  const diffW = Math.floor(diffDay / 7);
  if (diffW < 8) return `${diffW} нед назад`;
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function resolveActivityAuthor(item: TaskActivity) {
  if (item.authorName?.trim()) return item.authorName.trim();
  if (item.userId != null) return "Пользователь";
  return "Система";
}

function isCardActivity(item: TaskActivity) {
  const body = item.body?.trim();
  if (!body) return false;
  return item.type === "update.created" || item.type === "subtask.created";
}

function buildActivityFeed(items: TaskActivity[]) {
  const repliesByParent = new Map<string, TaskActivity[]>();
  const roots: TaskActivity[] = [];
  const itemIds = new Set(items.map((i) => i.id));

  for (const item of items) {
    const parentId = getActivityMetadata(item).parentActivityId;
    if (parentId && itemIds.has(parentId)) {
      const list = repliesByParent.get(parentId) ?? [];
      list.push(item);
      repliesByParent.set(parentId, list);
    } else {
      roots.push(item);
    }
  }

  for (const replies of repliesByParent.values()) {
    replies.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  return { roots, repliesByParent };
}

const ACTIVITY_RAIL_WIDTH = "w-5";

function ActivityTimelineLine({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-px bg-border/50 transition-colors duration-150",
        className,
      )}
    />
  );
}

function ActivityTimelineConnector({ active = true }: { active?: boolean }) {
  return (
    <div className="flex h-2 flex-row">
      <div className={cn(ACTIVITY_RAIL_WIDTH, "flex shrink-0 justify-center")}>
        <ActivityTimelineLine
          className={cn("h-full", !active && "bg-transparent")}
        />
      </div>
    </div>
  );
}

function ActivityTimelineRail({
  icon,
  lineBelow = false,
}: {
  icon: ReactNode;
  lineBelow?: boolean;
}) {
  return (
    <div
      className={cn(
        ACTIVITY_RAIL_WIDTH,
        "flex shrink-0 flex-col items-center text-muted-foreground",
        lineBelow && "self-stretch",
      )}
    >
      <div className="flex h-8 w-full items-center justify-center">
        <div className="flex size-4 items-center justify-center [&_svg]:size-4">
          {icon}
        </div>
      </div>
      {lineBelow ? <ActivityTimelineLine className="min-h-2 flex-1" /> : null}
    </div>
  );
}

function renderInlineText(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[13px] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function TaskDescription({ text }: { text: string }) {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const looksLikeList = lines.length > 1 || /^[-•*]\s/.test(text) || /^\d+\.\s/.test(text);

  if (!looksLikeList) {
    return (
      <div className="mt-2 text-[15px] leading-relaxed text-foreground/70">
        {renderInlineText(text)}
      </div>
    );
  }

  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/70 marker:text-muted-foreground/40">
      {lines.map((line, i) => (
        <li key={i}>
          {renderInlineText(line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, ""))}
        </li>
      ))}
    </ul>
  );
}

function UserAvatar({ label, size = 16 }: { label: string; size?: 16 | 20 | 24 }) {
  const sz = size === 24 ? "size-6" : size === 20 ? "size-5" : "size-4";
  const txt = size === 24 ? "text-[10px]" : size === 20 ? "text-[9px]" : "text-[8px]";
  return (
    <Avatar className={cn(sz, "shrink-0")}>
      <AvatarFallback className={cn(txt, "font-semibold", avatarColorClass(label))}>
        {label.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

function ActivityHistoryRow({
  item,
  onReply,
  showLeadingIcon = true,
}: {
  item: TaskActivity;
  onReply: (item: TaskActivity) => void;
  showLeadingIcon?: boolean;
}) {
  const author = resolveActivityAuthor(item);
  const meta = getActivityMetadata(item);

  const isStatusChange =
    item.type === "subtask.status_changed" &&
    Boolean(meta.from && meta.to && isSubtaskStatus(meta.from) && isSubtaskStatus(meta.to));

  const content = (
    <>
      <div className="min-w-0 flex-1 text-[13px] leading-snug text-muted-foreground/80">
        <span className="font-medium text-foreground">{author}</span>
        {isStatusChange ? (
          <>
            {" "}изменил статус с{" "}
            <span className="font-medium text-foreground/80">{meta.from}</span>
            {" → "}
            <span className="font-medium text-foreground/80">{meta.to}</span>
          </>
        ) : (
          <> {formatActivityActionText(item)}</>
        )}
        <span className="mx-1.5 text-muted-foreground/40">·</span>
        <time className="tabular-nums text-muted-foreground/60">
          {formatActivityDate(item.createdAt)}
        </time>
      </div>
      {item.type !== "task.created" ? (
        <Button type="button" variant="ghost" size="xs" className="shrink-0" onClick={() => onReply(item)}>
          <Reply className="size-3" />
          Ответить
        </Button>
      ) : null}
    </>
  );

  if (!showLeadingIcon) {
    return <div className="group flex min-w-0 w-full items-center gap-2">{content}</div>;
  }

  return (
    <div className="group flex min-w-0 items-center gap-2">
      <div className="flex size-4 shrink-0 items-center justify-center">
        <ActivityActionIcon item={item} className="size-3.5" />
      </div>
      {content}
    </div>
  );
}

function ActivityCommentCard({
  item,
  onReply,
  depth = 0,
}: {
  item: TaskActivity;
  onReply: (item: TaskActivity) => void;
  depth?: number;
}) {
  const author = resolveActivityAuthor(item);
  const body = item.body?.trim() ?? "";
  const isReply = isActivityReply(item);

  return (
    <article className={cn(
      "group relative rounded-lg border bg-card",
      depth === 0 ? "border-border/60 shadow-sm" : "border-border/40 shadow-none",
    )}>
      <div className="flex items-center gap-2 px-3.5 pt-3">
        <UserAvatar label={author} size={20} />
        <span className="text-[13px] font-medium text-foreground">{author}</span>
        {isReply && (
          <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground/50">
            <CornerDownRight className="size-3" />
            ответ
          </span>
        )}
        <time className="ml-auto text-[11px] tabular-nums text-muted-foreground/60">
          {formatActivityDate(item.createdAt)}
        </time>
      </div>
      <div className="px-3.5 pb-2 pt-1.5 text-[14px] leading-relaxed text-foreground/90">
        {body}
      </div>
      <div className="flex items-center justify-end px-3 pb-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button type="button" variant="ghost" size="xs" onClick={() => onReply(item)}>
          <Reply className="size-3" />
          Ответить
        </Button>
      </div>
    </article>
  );
}

function ActivityReplyThread({
  parentId,
  repliesByParent,
  onReply,
  depth = 0,
}: {
  parentId: string;
  repliesByParent: Map<string, TaskActivity[]>;
  onReply: (item: TaskActivity) => void;
  depth?: number;
}) {
  const replies = repliesByParent.get(parentId) ?? [];
  if (replies.length === 0) return null;

  return (
    <ul className="mt-1 mb-2 flex list-none flex-col gap-2 pl-2.5">
      {replies.map((reply) => (
        <li key={reply.id}>
          {isCardActivity(reply) ? (
            <ActivityCommentCard item={reply} onReply={onReply} depth={depth + 1} />
          ) : (
            <ActivityHistoryRow item={reply} onReply={onReply} />
          )}
          {depth < 4 && (
            <ActivityReplyThread
              parentId={reply.id}
              repliesByParent={repliesByParent}
              onReply={onReply}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function ActivityTimeline({ items, onReply }: { items: TaskActivity[]; onReply: (item: TaskActivity) => void }) {
  const timelineItems = items.filter((i) => i.type !== "task.created");
  const { roots, repliesByParent } = buildActivityFeed(timelineItems);
  if (roots.length === 0) return null;

  return (
    <ul className="flex list-none flex-col p-0">
      {roots.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === roots.length - 1;
        const hasReplies = (repliesByParent.get(item.id) ?? []).length > 0;
        const isCard = isCardActivity(item);

        return (
          <li key={item.id} className="flex min-w-0 flex-col">
            {!isFirst ? <ActivityTimelineConnector /> : null}

            <div className="flex min-w-0 flex-row gap-2">
              <ActivityTimelineRail
                icon={<ActivityActionIcon item={item} />}
                lineBelow={hasReplies}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div
                  className={cn(
                    "min-w-0",
                    isCard ? "pt-0.5" : "flex min-h-8 items-center",
                  )}
                >
                  {isCard ? (
                    <ActivityCommentCard item={item} onReply={onReply} depth={0} />
                  ) : (
                    <ActivityHistoryRow
                      item={item}
                      onReply={onReply}
                      showLeadingIcon={false}
                    />
                  )}
                </div>
                {hasReplies ? (
                  <ActivityReplyThread
                    parentId={item.id}
                    repliesByParent={repliesByParent}
                    onReply={onReply}
                    depth={0}
                  />
                ) : null}
              </div>
            </div>

            {!isLast ? <ActivityTimelineConnector /> : null}
          </li>
        );
      })}
    </ul>
  );
}

function ActivityCommentComposer({
  authorLabel,
  commentText,
  onCommentTextChange,
  onSubmit,
  sending,
}: {
  authorLabel: string;
  commentText: string;
  onCommentTextChange: (value: string) => void;
  onSubmit: () => void;
  sending: boolean;
}) {
  const canSubmit = Boolean(commentText.trim()) && !sending;

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">
        <UserAvatar label={authorLabel} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn(
          "overflow-hidden rounded-lg border bg-background transition-[border-color,box-shadow]",
          "border-border/50 focus-within:border-border focus-within:shadow-sm focus-within:ring-1 focus-within:ring-ring/20",
        )}>
          <Textarea
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            placeholder="Оставить комментарий…"
            rows={3}
            disabled={sending}
            className="max-h-40 min-h-[72px] resize-none border-0 bg-transparent px-3.5 py-2.5 text-sm shadow-none focus-visible:ring-0 disabled:opacity-60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <span className="text-[11px] text-muted-foreground/50">
              Enter — отправить · Shift+Enter — перенос
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!canSubmit}
              aria-label="Отправить комментарий"
              onClick={onSubmit}
            >
              {sending ? (
                <Spinner className="size-3.5" />
              ) : (
                <ArrowUp className="size-3.5" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
        {label}
      </span>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function PropRow({
  icon,
  label,
  children,
  onClick,
  interactive = false,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "group flex min-h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px]",
        (onClick || interactive) &&
          "cursor-pointer hover:bg-muted/80 active:bg-muted",
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
        {icon}
      </span>
      <span className="w-[76px] shrink-0 text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1 truncate text-right text-foreground">{children}</div>
    </div>
  );
}

function PropEmpty({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function PropDivider() {
  return <div className="my-3 h-px bg-border" />;
}

const TaskDetailsMain = memo(function TaskDetailsMain({ task }: { task: Tasks }) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [activity, setActivity] = useState<TaskActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingSubtask, setCreatingSubtask] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [replyTarget, setReplyTarget] = useState<TaskActivity | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const commentAuthorLabel = user?.name?.trim() || user?.email?.trim() || "Вы";

  async function refreshActivity() {
    setActivity(await getTaskActivityOnApi(task.id));
  }

  async function handleStatusChange(id: string, status: SubtaskStatus) {
    const updated = await updateSubtaskOnApi(id, { status });
    setSubtasks((p) => p.map((s) => (s.id === id ? updated : s)));
    await refreshActivity();
  }

  async function handleDeleteSubtask(id: string) {
    const subtask = subtasks.find((s) => s.id === id);
    const label = subtask?.title?.trim() || "подзадачу";
    const confirmed = await notifyConfirm({
      title: "Удалить подзадачу?",
      description: `«${label}» будет удалена`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await deleteSubtaskOnApi(id);
      setSubtasks((p) => p.filter((s) => s.id !== id));
      await refreshActivity();
    } catch {
      notify({ title: "Не удалось удалить подзадачу", variant: "error" });
    }
  }

  async function handleCreateSubtask(title: string) {
    const trimmed = title.trim();
    if (!trimmed || creatingSubtask) return;
    setCreatingSubtask(true);
    try {
      const created = await createSubtaskOnApi({ taskId: task.id, title: trimmed });
      setSubtasks((p) => [...p, created]);
      await refreshActivity();
    } finally {
      setCreatingSubtask(false);
    }
  }

  async function handleClearActivity() {
    const confirmed = await notifyConfirm({
      title: "Очистить активность?",
      description: "Вся история активности по задаче будет удалена.",
      confirmLabel: "Очистить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;

    try {
      await clearTaskActivityOnApi(task.id);
      setActivity([]);
    } catch {
      notify({ title: "Не удалось очистить активность", variant: "error" });
    }
  }

  async function handleSubmitComment() {
    const text = commentText.trim();
    if (!text || sendingComment) return;
    setSendingComment(true);
    try {
      const created = await createTaskActivityOnApi({ taskId: task.id, body: text });
      setActivity((prev) => [created, ...prev]);
      setCommentText("");
    } catch {
      notify({ title: "Не удалось отправить комментарий", variant: "error" });
    } finally {
      setSendingComment(false);
    }
  }

  async function handleSubmitReply(body: string, parentActivityId: string) {
    try {
      const created = await createTaskActivityOnApi({ taskId: task.id, body, parentActivityId });
      setActivity((prev) => [created, ...prev]);
    } catch {
      notify({ title: "Не удалось отправить ответ", variant: "error" });
      throw new Error("reply failed");
    }
  }

  function openReplyDialog(item: TaskActivity) {
    setReplyTarget(item);
    setReplyDialogOpen(true);
  }

  function handleReplyDialogOpenChange(open: boolean) {
    setReplyDialogOpen(open);
    if (!open) setReplyTarget(null);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [s, a] = await Promise.all([
          getSubtasksOnApi(task.id),
          getTaskActivityOnApi(task.id),
        ]);
        if (cancelled) return;
        setSubtasks(s);
        setActivity(a);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [task.id]);

  const addSubtaskTrigger = (
    <Button type="button" variant="ghost" size="sm">
      <Plus className="size-3.5" aria-hidden />
      Добавить подзадачу
    </Button>
  );

  const activityForTimeline = activity.filter((i) => i.type !== "task.created");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">
          {task.title}
        </h1>
        {task.description ? <TaskDescription text={task.description} /> : null}
      </header>

      <section className="flex flex-col gap-1">
        {loading ? (
          <div className="py-6">
            <KonoLoader size="sm" hint="подзадачи" />
          </div>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-muted/20"
            >
              <SubtaskStatusIcon status={subtask.status as SubtaskStatus} className="size-3.5 shrink-0" />
              <span className="min-w-0 flex-1 truncate text-[14px] text-foreground/80">
                {subtask.title}
              </span>
              <SubtaskStatusDropdown
                status={subtask.status as SubtaskStatus}
                onChange={(next) => void handleStatusChange(subtask.id, next)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 opacity-0 group-hover:opacity-100"
                aria-label="Удалить подзадачу"
                onClick={() => void handleDeleteSubtask(subtask.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))
        )}
        <DialogUpdateTask trigger={addSubtaskTrigger} onSubmit={handleCreateSubtask} />
      </section>

      <section className="flex flex-col gap-5 border-t border-border/30 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-muted-foreground/60">Активность</h2>
          {activity.length > 0 && (
            <Button type="button" variant="ghost" size="xs" onClick={() => void handleClearActivity()}>
              <Trash2 className="size-3" />
              Очистить
            </Button>
          )}
        </div>

        <ActivityCommentComposer
          authorLabel={commentAuthorLabel}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onSubmit={() => void handleSubmitComment()}
          sending={sendingComment}
        />

        <DialogReplyActivity
          target={replyTarget}
          open={replyDialogOpen}
          onOpenChange={handleReplyDialogOpenChange}
          onSubmit={handleSubmitReply}
        />

        {loading && activity.length === 0 ? (
          <div className="py-4">
            <KonoLoader size="sm" hint="активность" />
          </div>
        ) : activityForTimeline.length === 0 ? (
          <p className="py-5 text-center text-[13px] text-muted-foreground/40">
            Активности пока нет
          </p>
        ) : (
          <ActivityTimeline items={activity} onReply={openReplyDialog} />
        )}
      </section>
    </div>
  );
});

const TaskDetailsProperties = memo(function TaskDetailsProperties({
  task,
  workspaceName,
}: TaskDetailsPageProps) {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [dueCalendarOpen, setDueCalendarOpen] = useState(false);
  const openCollaboration = useCollaborationModalStore((s) => s.openCollaboration);

  const { data: workspaces = [] } = useWorkspaceQuery();
  const workspace = workspaces.find((w) => w.id === task.workspaceId);
  const { data: membersData, isLoading: membersLoading } = useWorkspaceMembersQuery(task.workspaceId);

  const members = membersData?.members ?? [];
  const participants = members.filter((member) => !member.isOwner);
  const pendingInvites = membersData?.pendingInvites ?? [];

  const canManageMembers = canPerformWorkspaceAction(
    workspace?.myRole,
    "manage_members",
  );

  const status = getTaskStatus(task);
  const priority = normalizeTaskPriority(task.tags);
  const priorityLabel = getTaskPriorityLabel(priority);

  const queryClient = useQueryClient();
  const updateTaskStore = useSessionTasks((state) => state.updateTask);

  async function savePatch(patch: TaskPatch) {
    try {
      const updated = await updateTaskOnAPI(task.id, patch);
      updateTaskStore(task.id, updated);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.byWorkspace(task.workspaceId),
      });
    } catch {
      notify({ title: "Не удалось сохранить", variant: "error" });
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 py-1">
      <PropGroup label="Задача">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <PropRow
                icon={<TaskStatusIcon status={status} className="size-3.5" />}
                label="Статус"
                interactive
              >
                <span className="flex items-center justify-end gap-1 font-medium">
                  {status}
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </span>
              </PropRow>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44 p-1">
            {TASK_STATUSES.map((option) => (
              <DropdownMenuItem
                key={option}
                className="cursor-pointer gap-2 px-2 py-1.5"
                onSelect={() => void savePatch({ status: option })}
              >
                <TaskStatusIcon status={option} className="size-3.5" />
                <span className="flex-1 text-sm">{option}</span>
                {status === option && <Check className="size-3.5 shrink-0 text-muted-foreground" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <PropRow
                icon={<TaskPriorityIcon priority={priority} className="size-3.5" />}
                label="Приоритет"
                interactive
              >
                <span className="flex items-center justify-end gap-1 font-medium">
                  {priority ? priorityLabel : <PropEmpty>Не задан</PropEmpty>}
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </span>
              </PropRow>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px] p-1">
            {TASK_PRIORITY_OPTIONS.map((option) => {
              const selected = (priority ?? null) === option.value || (!priority && option.value === null);
              return (
                <DropdownMenuItem
                  key={option.label}
                  className="cursor-pointer gap-2 px-2 py-1.5"
                  onSelect={() => void savePatch({ tags: option.value ?? "" })}
                >
                  <TaskPriorityIcon priority={option.value} className="size-3.5" />
                  <span className="flex-1 text-sm">{option.label}</span>
                  {selected && <Check className="size-3.5 shrink-0 text-muted-foreground" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </PropGroup>

      <PropDivider />

      <PropGroup label="Даты">
        <PropRow
          icon={<CalendarDays className="size-3.5" />}
          label="Старт"
          onClick={() => { setStartCalendarOpen((v) => !v); setDueCalendarOpen(false); }}
        >
          <span className="font-medium tabular-nums">
            {task.startDate ? (
              formatDate(task.startDate)
            ) : (
              <PropEmpty>Не задан</PropEmpty>
            )}
          </span>
        </PropRow>
        {startCalendarOpen && (
          <div className="px-2 pb-1 pt-0.5">
            <Calendar
              mode="single"
              selected={task.startDate ? new Date(task.startDate) : undefined}
              onSelect={(date) => {
                if (!date) return;
                void savePatch({ startDate: date.toISOString() });
                setStartCalendarOpen(false);
              }}
            />
          </div>
        )}

        <PropRow
          icon={<Clock3 className="size-3.5" />}
          label="Дедлайн"
          onClick={() => { setDueCalendarOpen((v) => !v); setStartCalendarOpen(false); }}
        >
          <span className="font-medium tabular-nums">
            {task.dueDate ? (
              formatDate(task.dueDate)
            ) : (
              <PropEmpty>Не задан</PropEmpty>
            )}
          </span>
        </PropRow>
        {dueCalendarOpen && (
          <div className="px-2 pb-1 pt-0.5">
            <Calendar
              mode="single"
              selected={task.dueDate ? new Date(task.dueDate) : undefined}
              onSelect={(date) => {
                if (!date) return;
                void savePatch({ dueDate: date.toISOString() });
                setDueCalendarOpen(false);
              }}
            />
          </div>
        )}
      </PropGroup>

      <PropDivider />

      <PropGroup label="Люди">
        <PropRow icon={<UserRound className="size-3.5" />} label="Владелец">
          {task.creator?.trim() ? (
            <span className="flex items-center justify-end gap-1.5">
              <UserAvatar label={task.creator.trim()} size={16} />
              <span className="max-w-[88px] truncate font-medium">
                {task.creator.trim()}
              </span>
            </span>
          ) : (
            <PropEmpty>Не задан</PropEmpty>
          )}
        </PropRow>

        {task.workspaceId ? (
          <>
            <PropRow
              icon={<UserPlus className="size-3.5" />}
              label="Участники"
              interactive
              onClick={() =>
                openCollaboration({
                  workspaceId: task.workspaceId,
                  workspaceTitle: workspaceName ?? workspace?.title,
                })
              }
            >
              <span className="flex items-center justify-end gap-1.5">
                {membersLoading ? (
                  <PropEmpty>…</PropEmpty>
                ) : participants.length === 0 ? (
                  <PropEmpty>Никого</PropEmpty>
                ) : (
                  <span className="flex items-center">
                    {participants.slice(0, 4).map((m, i) => (
                      <span
                        key={m.userId}
                        className="rounded-full ring-1 ring-background"
                        style={{ marginLeft: i === 0 ? 0 : -6, zIndex: i }}
                      >
                        <UserAvatar label={m.name} size={16} />
                      </span>
                    ))}
                    {participants.length > 4 && (
                      <span className="ml-1 text-xs font-medium text-muted-foreground tabular-nums">
                        +{participants.length - 4}
                      </span>
                    )}
                  </span>
                )}
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              </span>
            </PropRow>

            {pendingInvites.length > 0 && (
              <PropRow icon={<Mail className="size-3.5" />} label="Приглашены">
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {pendingInvites.length} ожидают
                </span>
              </PropRow>
            )}

            {canManageMembers ? (
              <button
                type="button"
                onClick={() =>
                  openCollaboration({
                    workspaceId: task.workspaceId,
                    workspaceTitle: workspaceName ?? workspace?.title,
                  })
                }
                className="mx-2.5 mt-1 flex h-7 w-fit items-center gap-1 rounded-md px-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-3" />
                Управление участниками
              </button>
            ) : null}
          </>
        ) : null}
      </PropGroup>

      <PropDivider />

      <PropGroup label="Проект">
        <PropRow icon={<Box className="size-3.5" />} label="Проект">
          <span className="font-medium">
            {workspaceName?.trim() ? (
              workspaceName.trim()
            ) : (
              <PropEmpty>Без проекта</PropEmpty>
            )}
          </span>
        </PropRow>
      </PropGroup>
    </div>
  );
});

const CONTENT_MAX_WIDTH = 680;
const PROPERTIES_WIDTH = 260;

function TaskDetailsPage({ task, workspaceName }: TaskDetailsPageProps) {
  return (
    <article className="flex min-h-0 flex-1 overflow-hidden bg-background">
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
        <div className="flex w-full justify-center px-6 py-8 lg:px-10 lg:py-10">
          <div className="w-full" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
            <TaskDetailsMain task={task} />
          </div>
        </div>

        <div
          className="mx-auto flex w-full flex-col gap-3 border-t border-border bg-muted/20 px-6 py-8 lg:hidden"
          style={{ maxWidth: CONTENT_MAX_WIDTH }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Свойства
          </h2>
          <TaskDetailsProperties task={task} workspaceName={workspaceName} />
        </div>
      </div>

      <aside
        className="hidden min-h-0 shrink-0 flex-col border-l border-border bg-muted/25 lg:flex"
        style={{ width: PROPERTIES_WIDTH }}
      >
        <div className="flex h-11 shrink-0 items-center border-b border-border bg-background/80 px-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Свойства
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-2.5 py-3 [scrollbar-gutter:stable]">
          <TaskDetailsProperties task={task} workspaceName={workspaceName} />
        </div>
      </aside>
    </article>
  );
}

export default memo(TaskDetailsPage);