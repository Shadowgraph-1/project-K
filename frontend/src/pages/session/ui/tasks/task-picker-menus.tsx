import type { ReactElement, ReactNode } from "react";
import { Check } from "lucide-react";
import {
  ContextMenuSub,
  ContextMenuSubContent,
} from "@/shared/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import type { TaskPriority } from "@/entities/task/model/types";
import {
  ContextMenuFieldSubTrigger,
  ContextMenuPickItem,
  linearContextMenuContentClass,
} from "./task-context-menu";
import {
  TASK_PRIORITY_OPTIONS,
  TaskPriorityFieldIcon,
  TaskPriorityIcon,
} from "./task-priority-icons";
import { TaskStatusFieldIcon, TaskStatusIcon } from "./task-status-icons";
import { SessionTooltip } from "../layout/SessionTooltip";

const dropdownItemClass = "cursor-pointer gap-2 px-2 py-1.5";

type TaskStatusPickerMenuProps = {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  trigger: ReactNode;
  tooltipLabel?: string;
  align?: "start" | "center" | "end";
  contentClassName?: string;
};

function PickerMenuTrigger({
  tooltipLabel,
  trigger,
}: {
  tooltipLabel?: string;
  trigger: ReactNode;
}) {
  if (!tooltipLabel) {
    return <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>;
  }

  return (
    <SessionTooltip label={tooltipLabel}>
      <DropdownMenuTrigger asChild>{trigger as ReactElement}</DropdownMenuTrigger>
    </SessionTooltip>
  );
}

export function TaskStatusPickerMenu({
  status,
  onStatusChange,
  trigger,
  tooltipLabel,
  align = "start",
  contentClassName = "min-w-44 p-1",
}: TaskStatusPickerMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <PickerMenuTrigger tooltipLabel={tooltipLabel} trigger={trigger} />
      <DropdownMenuContent align={align} className={contentClassName}>
        {TASK_STATUSES.map((option) => (
          <DropdownMenuItem
            key={option}
            className={dropdownItemClass}
            onSelect={() => onStatusChange(option)}
          >
            <TaskStatusIcon status={option} className="size-3.5" />
            <span className="flex-1 text-sm">{TASK_STATUS_LABELS[option]}</span>
            {status === option ? (
              <Check className="size-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type TaskPriorityPickerMenuProps = {
  priority: TaskPriority | null;
  onPriorityChange: (priority: TaskPriority | null) => void;
  trigger: ReactNode;
  tooltipLabel?: string;
  align?: "start" | "center" | "end";
  contentClassName?: string;
};

export function TaskPriorityPickerMenu({
  priority,
  onPriorityChange,
  trigger,
  tooltipLabel,
  align = "start",
  contentClassName = "min-w-[180px] p-1",
}: TaskPriorityPickerMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <PickerMenuTrigger tooltipLabel={tooltipLabel} trigger={trigger} />
      <DropdownMenuContent align={align} className={contentClassName}>
        {TASK_PRIORITY_OPTIONS.map((option) => {
          const selected =
            (priority ?? null) === option.value ||
            (!priority && option.value === null);

          return (
            <DropdownMenuItem
              key={option.label}
              className={dropdownItemClass}
              onSelect={() => onPriorityChange(option.value)}
            >
              <TaskPriorityIcon priority={option.value} className="size-3.5" />
              <span className="flex-1 text-sm">{option.label}</span>
              {selected ? (
                <Check className="size-3.5 shrink-0 text-muted-foreground" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type TaskStatusContextMenuSubProps = {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
};

export function TaskStatusContextMenuSub({
  status,
  onStatusChange,
}: TaskStatusContextMenuSubProps) {
  return (
    <ContextMenuSub>
      <ContextMenuFieldSubTrigger
        icon={<TaskStatusFieldIcon className="size-4" />}
        label="Статус"
      />
      <ContextMenuSubContent className={linearContextMenuContentClass}>
        {TASK_STATUSES.map((option) => (
          <ContextMenuPickItem
            key={option}
            icon={<TaskStatusIcon status={option} className="size-3.5" />}
            label={TASK_STATUS_LABELS[option]}
            selected={status === option}
            onSelect={() => onStatusChange(option)}
          />
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}

type TaskPriorityContextMenuSubProps = {
  priority: TaskPriority | null;
  onPriorityChange: (priority: TaskPriority | null) => void;
};

export function TaskPriorityContextMenuSub({
  priority,
  onPriorityChange,
}: TaskPriorityContextMenuSubProps) {
  return (
    <ContextMenuSub>
      <ContextMenuFieldSubTrigger
        icon={<TaskPriorityFieldIcon className="size-4" />}
        label="Приоритет"
      />
      <ContextMenuSubContent className={linearContextMenuContentClass}>
        {TASK_PRIORITY_OPTIONS.map((option) => {
          const selected =
            (priority ?? null) === option.value ||
            (!priority && option.value === null);

          return (
            <ContextMenuPickItem
              key={option.label}
              icon={
                <TaskPriorityIcon priority={option.value} className="size-3.5" />
              }
              label={option.label}
              selected={selected}
              onSelect={() => onPriorityChange(option.value)}
            />
          );
        })}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
