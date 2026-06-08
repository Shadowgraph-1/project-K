import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleAlert,
  PauseCircle,
  Square,
  SquareCheck,
  Trash2,
} from "lucide-react";
import {
  getTaskStatus,
  TASK_STATUSES,
  useSessionTasks,
  type Tasks,
  type TaskStatus,
} from "@/entities/task/model/useSessionTasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { updateTaskOnAPI } from "@/api/tasks";
import { queryKeys } from "@/shared/api/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { notify } from "../widgets/SonnerWidget";
import {
  getTaskPriorityLabel,
  normalizeTaskPriority,
  TaskPriorityIcon,
} from "./task-priority-icons";

function TaskCreatorAvatar({ name }: { name: string }) {
  return (
    <UserAvatar
      name={name}
      className="size-5 ring-1 ring-border/30"
      fallbackClassName="text-[9px]"
    />
  );
}

function taskKey(id: string) {
  const compact = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `K-${compact}`;
}

function taskStatusIconClass(status: TaskStatus) {
  switch (status) {
    case "Выполнено":
      return "text-emerald-500";
    case "Отложено":
      return "text-amber-500";
    case "Issues":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

function TaskStatusIcon({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const iconClassName = cn("shrink-0", taskStatusIconClass(status), className);

  switch (status) {
    case "Выполнено":
      return <CheckCircle2 className={iconClassName} aria-hidden />;
    case "Отложено":
      return <PauseCircle className={iconClassName} aria-hidden />;
    case "Issues":
      return <CircleAlert className={iconClassName} aria-hidden />;
    case "В очереди":
    default:
      return <Circle className={iconClassName} aria-hidden />;
  }
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type TaskRowProps = {
  task: Tasks;
  isChecked: boolean;
  onToggleChecked: (id: string) => void;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
  workspaceName?: string;
};

function TaskRowMenuItems({
  taskId,
  workspaceId,
  currentStatus,
  onRemove,
}: {
  taskId: string;
  workspaceId: string;
  currentStatus: ReturnType<typeof getTaskStatus>;
  onRemove: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const updateTask = useSessionTasks((s) => s.updateTask);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      const updated = await updateTaskOnAPI(taskId, { status });
      updateTask(taskId, updated);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.byWorkspace(workspaceId),
      });
    } catch {
      notify({
        title: "Ошибка запроса",
        description: "Статус не изменён, попробуйте ещё раз",
        variant: "error",
      });
    }
  };

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer text-xs">
          Статус
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="min-w-36">
          {TASK_STATUSES.map((status) => (
            <DropdownMenuItem
              key={status}
              className="cursor-pointer text-xs"
              onSelect={() => void handleStatusChange(status)}
            >
              <TaskStatusIcon status={status} className="size-3.5" />
              {status}
              {currentStatus === status ? (
                <Check className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        className="cursor-pointer text-xs"
        onSelect={() => onRemove(taskId)}
      >
        <Trash2 className="size-3" />
        Удалить
      </DropdownMenuItem>
    </>
  );
}

type TaskRowContextShellProps = {
  taskId: string;
  workspaceId: string;
  status: TaskStatus;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
  className?: string;
  title?: string;
  children: ReactNode;
};

function TaskRowContextShell({
  taskId,
  workspaceId,
  status,
  onRemove,
  onOpen,
  className,
  title,
  children,
}: TaskRowContextShellProps) {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const closeAll = () => setPointer(null);
    window.addEventListener("task-row-menu-close", closeAll);
    return () => window.removeEventListener("task-row-menu-close", closeAll);
  }, []);

  const handleContextMenu = useCallback(
    (e: MouseEvent<HTMLLIElement>) => {
      e.preventDefault();
      window.dispatchEvent(new Event("task-row-menu-close"));
      setPointer({ x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) setPointer(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLLIElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onOpen(taskId);
    },
    [onOpen, taskId],
  );

  return (
    <>
      <li
        title={title}
        role="button"
        tabIndex={0}
        className={className}
        onClick={() => onOpen(taskId)}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
      >
        {children}
      </li>

      {pointer ? (
        <DropdownMenu
          key={`${pointer.x}-${pointer.y}`}
          open
          onOpenChange={handleOpenChange}
        >
          <DropdownMenuTrigger asChild>
            <span
              aria-hidden
              className="pointer-events-none fixed block size-px"
              style={{ left: pointer.x, top: pointer.y }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={4}
            className="min-w-36"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <TaskRowMenuItems
              taskId={taskId}
              workspaceId={workspaceId}
              currentStatus={status}
              onRemove={onRemove}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
}

export function TaskRow({
  task,
  isChecked,
  onToggleChecked,
  onRemove,
  onOpen,
  workspaceName,
}: TaskRowProps) {
  const status = getTaskStatus(task);
  const dateLabel = task.dueDate ?? task.startDate;

  return (
    <TaskRowContextShell
      taskId={task.id}
      workspaceId={task.workspaceId}
      status={status}
      onRemove={onRemove}
      onOpen={onOpen}
      title={task.description || undefined}
      className={cn(
        "group flex items-center gap-2 rounded-md border border-transparent",
        "bg-muted/30 px-2 py-2 transition-colors hover:bg-muted/50",
        isChecked &&
          "border-violet-400/35 bg-violet-500/8 ring-1 ring-violet-400/20 hover:bg-violet-500/10",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 shrink-0 p-0 hover:bg-transparent hover:opacity-60"
        onClick={(event) => {
          event.stopPropagation();
          onToggleChecked(task.id);
        }}
      >
        {isChecked ? (
          <SquareCheck size={16} className="text-violet-500" />
        ) : (
          <Square
            size={16}
            className="text-muted-foreground/40"
            strokeWidth={1.75}
          />
        )}
      </Button>

      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {taskKey(task.id)}
      </span>

      <TaskStatusIcon status={status} className="size-3.5" />

      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <span
          className={cn(
            "truncate text-sm font-semibold text-foreground",
            isChecked && "text-foreground",
          )}
        >
          {task.title}
        </span>
        {workspaceName ? (
          <>
            <ChevronRight
              className="size-3.5 shrink-0 text-muted-foreground/50"
              aria-hidden
            />
            <span className="truncate text-xs text-muted-foreground">
              {workspaceName}
            </span>
          </>
        ) : null}
      </div>

      <div className="ml-1 flex shrink-0 items-center gap-2">
        {task.tags ? (
          <span className="flex max-w-32 items-center gap-1 truncate rounded-full border border-border/60 bg-background px-2 py-0.5 text-xs text-muted-foreground">
            <TaskPriorityIcon
              priority={normalizeTaskPriority(task.tags)}
              className="size-3"
            />
            {getTaskPriorityLabel(normalizeTaskPriority(task.tags))}
          </span>
        ) : null}
        {task.creator ? <TaskCreatorAvatar name={task.creator} /> : null}
        {dateLabel ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatShortDate(dateLabel)}
          </span>
        ) : null}
      </div>
    </TaskRowContextShell>
  );
}
