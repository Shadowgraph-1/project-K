import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type Ref,
} from "react";
import { Check, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu";
import { cn } from "@/shared/lib/utils";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { useSaveTaskPatch } from "@/entities/task/model/use-save-task-patch";
import { normalizeTaskPriority, TaskPriorityIcon, getTaskPriorityLabel } from "./task-priority-icons";
import { TaskStatusIcon } from "./task-status-icons";
import {
  TaskDateContextMenuFields,
  type TaskDateField,
} from "./task-date-picker";
import {
  ContextMenuActionItem,
  linearContextMenuContentClass,
  TaskDeleteFieldIcon,
} from "./task-context-menu";
import type { Task, TaskPriority } from "@/entities/task/model/types";
import { getTaskStatus } from "@/entities/task/model/types";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { TASK_STATUS_LABELS } from "@/shared/constants/task-statuses";
import { TASK_ROW_GRID_COLUMNS } from "./sessionWorkspaceTypes";
import { formatDate, formatShortDate } from "./task-feed/format-activity-date";
import { Button } from "@/shared/ui/button";
import {
  TaskPriorityContextMenuSub,
  TaskPriorityPickerMenu,
  TaskStatusContextMenuSub,
  TaskStatusPickerMenu,
} from "./task-picker-menus";
import { SessionTooltip } from "../layout/SessionTooltip";

function taskKey(id: string) {
  const compact = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `K-${compact}`;
}

function stopRowActivation(event: MouseEvent | PointerEvent) {
  event.stopPropagation();
}

function handleRowOpenKeyDown(
  event: KeyboardEvent<HTMLLIElement>,
  onOpen: () => void,
) {
  if (event.target !== event.currentTarget) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onOpen();
}

export type TaskRowProps = {
  task: Task;
  isChecked: boolean;
  subtaskCount?: number;
  onToggleChecked: (id: string) => void;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
};

function TaskRowMenuItems({
  taskId,
  workspaceId,
  currentStatus,
  currentPriority,
  startDate,
  dueDate,
  onRemove,
}: {
  taskId: string;
  workspaceId: string;
  currentStatus: ReturnType<typeof getTaskStatus>;
  currentPriority: TaskPriority | null;
  startDate?: string;
  dueDate?: string;
  onRemove: (id: string) => void;
}) {
  const savePatch = useSaveTaskPatch(taskId, workspaceId);

  const handleStatusChange = (status: TaskStatus) =>
    void savePatch(
      { status },
      { description: "Статус не изменён, попробуйте ещё раз" },
    );

  const handlePriorityChange = (value: TaskPriority | null) =>
    void savePatch(
      { tags: value ?? "" },
      { description: "Приоритет не изменён, попробуйте ещё раз" },
    );

  const handleDateChange = (field: TaskDateField, iso: string) =>
    void savePatch(
      { [field]: iso },
      { description: "Дата не изменена, попробуйте ещё раз" },
    );

  return (
    <>
      <TaskStatusContextMenuSub
        status={currentStatus}
        onStatusChange={handleStatusChange}
      />
      <TaskPriorityContextMenuSub
        priority={currentPriority}
        onPriorityChange={handlePriorityChange}
      />
      <TaskDateContextMenuFields
        startDate={startDate}
        dueDate={dueDate}
        onDateChange={handleDateChange}
      />
      <ContextMenuSeparator className="my-1" />
      <ContextMenuActionItem
        variant="destructive"
        icon={<TaskDeleteFieldIcon className="size-4" />}
        label="Удалить"
        onSelect={() => onRemove(taskId)}
      />
    </>
  );
}

function TaskRowCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={checked ? "Снять выделение" : "Выделить задачу"}
      aria-pressed={checked}
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-[opacity,colors]",
        checked
          ? "border-primary bg-primary text-primary-foreground opacity-100"
          : [
              "border-border/80 bg-background hover:border-muted-foreground/50",
              "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
              "focus-visible:pointer-events-auto focus-visible:opacity-100",
            ],
      )}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      {checked ? <Check className="size-3" strokeWidth={2.5} /> : null}
    </button>
  );
}

function TaskRowIconTrigger({
  ref,
  className,
  onClick,
  onPointerDown,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<typeof Button> & {
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <Button
      ref={ref}
      type={type}
      variant="ghost"
      size="icon-xs"
      className={cn("hover:bg-muted/60", className)}
      onClick={(event) => {
        stopRowActivation(event);
        onClick?.(event);
      }}
      onPointerDown={(event) => {
        stopRowActivation(event);
        onPointerDown?.(event);
      }}
      {...props}
    />
  );
}

export function TaskRow({
  task,
  isChecked,
  subtaskCount,
  onToggleChecked,
  onRemove,
  onOpen,
}: TaskRowProps) {
  const status = getTaskStatus(task);
  const priority = normalizeTaskPriority(task.tags);
  const priorityLabel = getTaskPriorityLabel(priority);
  const statusLabel = TASK_STATUS_LABELS[status];
  const createdLabel = task.createdAt ? formatShortDate(task.createdAt) : null;
  const createdTooltip = task.createdAt
    ? (formatDate(task.createdAt) ?? task.createdAt)
    : null;
  const savePatch = useSaveTaskPatch(task.id, task.workspaceId);

  const handleStatusChange = (nextStatus: TaskStatus) =>
    void savePatch(
      { status: nextStatus },
      { description: "Статус не изменён, попробуйте ещё раз" },
    );

  const handlePriorityChange = (value: TaskPriority | null) =>
    void savePatch(
      { tags: value ?? "" },
      { description: "Приоритет не изменён, попробуйте ещё раз" },
    );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <li
          className={cn(
            "task-list-row group relative grid h-11 w-full min-w-0 cursor-pointer items-center gap-x-2 rounded-sm px-1",
            "transition-colors hover:bg-muted/45 focus-within:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            isChecked && "bg-accent/70 hover:bg-accent/80",
          )}
          style={{ gridTemplateColumns: TASK_ROW_GRID_COLUMNS }}
          tabIndex={0}
          role="button"
          aria-label={`Открыть задачу ${task.title}`}
          onClick={() => onOpen(task.id)}
          onKeyDown={(event) =>
            handleRowOpenKeyDown(event, () => onOpen(task.id))
          }
        >
        <div className="relative flex items-center justify-center">
          <TaskRowCheckbox
            checked={isChecked}
            onToggle={() => onToggleChecked(task.id)}
          />
        </div>

        <div className="relative flex items-center justify-center">
          <TaskPriorityPickerMenu
            priority={priority}
            onPriorityChange={handlePriorityChange}
            tooltipLabel={`Приоритет: ${priorityLabel}`}
            trigger={
              <TaskRowIconTrigger aria-label="Изменить приоритет">
                <TaskPriorityIcon priority={priority} className="size-4" />
              </TaskRowIconTrigger>
            }
          />
        </div>

        <span className="relative truncate font-mono text-xs tabular-nums text-muted-foreground">
          {taskKey(task.id)}
        </span>

        <div className="relative flex items-center justify-center">
          <TaskStatusPickerMenu
            status={status}
            onStatusChange={handleStatusChange}
            tooltipLabel={`Статус: ${statusLabel}`}
            trigger={
              <TaskRowIconTrigger aria-label="Изменить статус">
                <TaskStatusIcon status={status} className="size-3.5" />
              </TaskRowIconTrigger>
            }
          />
        </div>

        <div className="relative flex min-w-0 items-center gap-2">
          {task.description?.trim() ? (
            <SessionTooltip label={task.description.trim()}>
              <span className="min-w-0 truncate text-[13px] leading-5 text-foreground">
                {task.title}
              </span>
            </SessionTooltip>
          ) : (
            <span className="min-w-0 truncate text-[13px] leading-5 text-foreground">
              {task.title}
            </span>
          )}
          {task.creator?.trim() ? (
            <div className="ml-auto flex shrink-0 items-center opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-70">
              <SessionTooltip label={`Создатель: ${task.creator.trim()}`} side="bottom">
                <span className="inline-flex">
                  <UserAvatar
                    name={task.creator}
                    size={16}
                    fallbackClassName="text-[8px]"
                  />
                </span>
              </SessionTooltip>
            </div>
          ) : null}
        </div>

        <div className="relative flex items-center justify-end gap-2">
          {subtaskCount !== undefined && subtaskCount > 0 ? (
            <SessionTooltip label={`Подзадач: ${subtaskCount}`}>
              <span className="min-w-5 text-center text-xs tabular-nums text-muted-foreground/70">
                {subtaskCount}
              </span>
            </SessionTooltip>
          ) : null}
          {createdLabel && createdTooltip ? (
            <SessionTooltip label={`Создана: ${createdTooltip}`}>
              <span className="text-xs tabular-nums text-muted-foreground">
                {createdLabel}
              </span>
            </SessionTooltip>
          ) : null}
        </div>

        <div className="relative flex items-center justify-center">
          <TaskRowIconTrigger
            aria-label="Удалить задачу"
            className={cn(
              "size-7 text-muted-foreground hover:text-destructive",
              "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
              "focus-visible:pointer-events-auto focus-visible:opacity-100",
            )}
            onClick={() => void onRemove(task.id)}
          >
            <Trash2 className="size-3.5" />
          </TaskRowIconTrigger>
        </div>
        </li>
      </ContextMenuTrigger>

      <ContextMenuContent className={linearContextMenuContentClass}>
        <TaskRowMenuItems
          taskId={task.id}
          workspaceId={task.workspaceId}
          currentStatus={status}
          currentPriority={priority}
          startDate={task.startDate}
          dueDate={task.dueDate}
          onRemove={onRemove}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}
