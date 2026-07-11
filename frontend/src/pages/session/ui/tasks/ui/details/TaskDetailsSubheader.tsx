import { memo, useState, type ComponentType } from "react";
import {
  Box,
  Check,
  Settings2,
  UserPlus,
} from "lucide-react";

import {
  getTaskStatus,
  type Task,
} from "@/entities/task/model/types";
import { useSaveTaskPatch } from "@/entities/task/model/use-save-task-patch";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import { useWorkspaceMembersQuery } from "@/entities/workspace/model/use-workspace-members-query";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";
import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";
import {
  getStatusLabel,
  TASK_STATUSES,
} from "@/shared/constants/task-statuses";
import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  TASK_PRIORITY_OPTIONS,
  TaskPriorityIcon,
  normalizeTaskPriority,
} from "../shared/task-priority-icons";
import { TaskStatusIcon } from "../shared/task-status-icons";
import { TaskDueDateIcon, TaskStartDateIcon } from "../shared/task-date-icons";
import { TaskDatePicker } from "../shared/task-date-picker";
import { formatDate } from "../../lib/format-activity-date";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { ToolbarIsland } from "../../../layout/ToolbarIsland";
import { toolbarIslandIconButtonClass } from "../../../layout/toolbar-island-styles";
import { SessionTooltip } from "../../../layout/SessionTooltip";

type TaskDetailsPropertiesButtonProps = {
  task: Task;
  workspaceName?: string;
};

function PropertyOptionRow({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {icon ? (
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{label}</span>
      {active ? (
        <Check className="size-3.5 shrink-0 opacity-70" aria-hidden />
      ) : null}
    </button>
  );
}

function PropertySection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
        {title}
      </p>
      {children}
    </div>
  );
}

export const TaskDetailsPropertiesButton = memo(function TaskDetailsPropertiesButton({
  task,
  workspaceName,
}: TaskDetailsPropertiesButtonProps) {
  const openCollaboration = useCollaborationModalStore(
    (s) => s.openCollaboration,
  );

  const { data: workspaces = [] } = useWorkspaceQuery();
  const workspace = workspaces.find((w) => w.id === task.workspaceId);
  const { data: membersData, isLoading: membersLoading } =
    useWorkspaceMembersQuery(task.workspaceId);

  const members = membersData?.members ?? [];
  const participants = members.filter((member) => !member.isOwner);
  const canManageMembers = canPerformWorkspaceAction(
    workspace?.myRole,
    "manage_members",
  );

  const status = getTaskStatus(task);
  const priority = normalizeTaskPriority(task.tags);
  const savePatch = useSaveTaskPatch(task.id, task.workspaceId);

  const projectLabel =
    workspaceName?.trim() || workspace?.title?.trim() || "Без проекта";

  return (
    <ToolbarIsland aria-label="Свойства задачи">
      <Popover>
          <SessionTooltip label="Свойства">
            <PopoverTrigger
              className={toolbarIslandIconButtonClass}
              aria-label="Свойства задачи"
            >
              <Settings2 className="size-3.5" aria-hidden />
            </PopoverTrigger>
          </SessionTooltip>

          <PopoverContent align="end" className="w-80 p-3">
            <div className="space-y-4">
              <PropertySection title="Статус">
                <div className="flex flex-col gap-0.5">
                  {TASK_STATUSES.map((option) => (
                    <PropertyOptionRow
                      key={option}
                      label={getStatusLabel(option)}
                      active={status === option}
                      icon={<TaskStatusIcon status={option} className="size-3.5" />}
                      onClick={() => void savePatch({ status: option })}
                    />
                  ))}
                </div>
              </PropertySection>

              <PropertySection title="Приоритет">
                <div className="flex flex-col gap-0.5">
                  {TASK_PRIORITY_OPTIONS.map((option) => {
                    const selected =
                      (priority ?? null) === option.value ||
                      (!priority && option.value === null);

                    return (
                      <PropertyOptionRow
                        key={option.label}
                        label={option.label}
                        active={selected}
                        icon={
                          <TaskPriorityIcon
                            priority={option.value}
                            className="size-3.5"
                          />
                        }
                        onClick={() =>
                          void savePatch({ tags: option.value ?? "" })
                        }
                      />
                    );
                  })}
                </div>
              </PropertySection>

              <PropertySection title="Даты">
                <DatesSection task={task} onSave={savePatch} />
              </PropertySection>

              <PropertySection title="Участники" icon={UserPlus}>
                <PeopleSection
                  task={task}
                  participants={participants}
                  membersLoading={membersLoading}
                  canManageMembers={canManageMembers}
                  onOpenCollaboration={() =>
                    openCollaboration({
                      workspaceId: task.workspaceId,
                      workspaceTitle: workspaceName ?? workspace?.title,
                    })
                  }
                />
              </PropertySection>

              <div className="space-y-2 border-t border-border/30 pt-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Box className="size-3.5" aria-hidden />
                  Проект
                </p>
                <p className="rounded-lg bg-muted/30 px-2 py-1.5 text-sm text-foreground">
                  {projectLabel}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
    </ToolbarIsland>
  );
});

function DatesSection({
  task,
  onSave,
}: {
  task: Task;
  onSave: ReturnType<typeof useSaveTaskPatch>;
}) {
  const [startOpen, setStartOpen] = useState(false);
  const [dueOpen, setDueOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() => {
          setStartOpen((v) => !v);
          setDueOpen(false);
        }}
      >
        <TaskStartDateIcon className="size-3.5 shrink-0" />
        <span className="flex-1 tabular-nums">
          {task.startDate ? formatDate(task.startDate) : "Старт не задан"}
        </span>
      </button>
      {startOpen ? (
        <TaskDatePicker
          value={task.startDate}
          onChange={(iso) => {
            void onSave({ startDate: iso });
            setStartOpen(false);
          }}
        />
      ) : null}

      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() => {
          setDueOpen((v) => !v);
          setStartOpen(false);
        }}
      >
        <TaskDueDateIcon className="size-3.5 shrink-0" />
        <span className="flex-1 tabular-nums">
          {task.dueDate ? formatDate(task.dueDate) : "Дедлайн не задан"}
        </span>
      </button>
      {dueOpen ? (
        <TaskDatePicker
          value={task.dueDate}
          onChange={(iso) => {
            void onSave({ dueDate: iso });
            setDueOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function PeopleSection({
  task,
  participants,
  membersLoading,
  canManageMembers,
  onOpenCollaboration,
}: {
  task: Task;
  participants: { userId: number; name: string }[];
  membersLoading: boolean;
  canManageMembers: boolean;
  onOpenCollaboration: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-2 py-1.5">
        {task.creator?.trim() ? (
          <>
            <UserAvatar label={task.creator.trim()} size={20} />
            <span className="min-w-0 truncate text-xs">{task.creator.trim()}</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Владелец не задан</span>
        )}
      </div>

      {membersLoading ? (
        <p className="text-xs text-muted-foreground">Загрузка…</p>
      ) : participants.length > 0 ? (
        <ul className="flex max-h-28 flex-col gap-0.5 overflow-y-auto">
          {participants.map((m) => (
            <li
              key={m.userId}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs"
            >
              <UserAvatar label={m.name} size={20} />
              <span className="truncate">{m.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Участники не назначены</p>
      )}

      {canManageMembers ? (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted/40 px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
          onClick={onOpenCollaboration}
        >
          <UserPlus className="size-3.5" />
          Управление участниками
        </button>
      ) : null}
    </div>
  );
}
