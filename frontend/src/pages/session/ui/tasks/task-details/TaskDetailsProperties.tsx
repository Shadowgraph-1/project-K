import {
  useState,
  memo,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Box,
  ChevronDown,
  Mail,
  Plus,
  UserPlus,
  UserRound,
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
import { getStatusLabel } from "@/shared/constants/task-statuses";
import { cn } from "@/shared/lib/utils";
import {
  getTaskPriorityLabel,
  normalizeTaskPriority,
  TaskPriorityIcon,
} from "../task-priority-icons";
import { TaskStatusIcon } from "../task-status-icons";
import { TaskDueDateIcon, TaskStartDateIcon } from "../task-date-icons";
import { TaskDatePicker } from "../task-date-picker";
import {
  TaskPriorityPickerMenu,
  TaskStatusPickerMenu,
} from "../task-picker-menus";
import { formatDate } from "../task-feed";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";

type TaskDetailsPropertiesProps = {
  task: Task;
  workspaceName?: string;
};

function PropEmpty({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function PropSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border/30">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/30"
      >
        <span className="min-w-0 truncate">{title}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            !open && "-rotate-90",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="flex w-full min-w-0 flex-col gap-0.5 border-t border-border/40 px-1.5 pb-1.5 pt-0.5">
          {children}
        </div>
      ) : null}
    </section>
  );
}

const PropAction = forwardRef<
  HTMLButtonElement,
  {
    icon: ReactNode;
    children: ReactNode;
    interactive?: boolean;
    className?: string;
  } & Omit<ComponentPropsWithoutRef<"button">, "children">
>(function PropAction(
  { icon, children, interactive, className, type = "button", ...props },
  ref,
) {
  const isInteractive = interactive ?? Boolean(props.onClick);

  return (
    <button
      ref={ref}
      type={type}
      {...props}
      className={cn(
        "flex w-full min-h-8 items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-[13px] font-normal text-foreground",
        isInteractive && "cursor-pointer hover:bg-muted/60 active:bg-muted/80",
        !isInteractive && "cursor-default",
        className,
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
});

export const TaskDetailsProperties = memo(function TaskDetailsProperties({
  task,
  workspaceName,
}: TaskDetailsPropertiesProps) {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [dueCalendarOpen, setDueCalendarOpen] = useState(false);
  const openCollaboration = useCollaborationModalStore(
    (s) => s.openCollaboration,
  );

  const { data: workspaces = [] } = useWorkspaceQuery();
  const workspace = workspaces.find((w) => w.id === task.workspaceId);
  const { data: membersData, isLoading: membersLoading } =
    useWorkspaceMembersQuery(task.workspaceId);

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

  const savePatch = useSaveTaskPatch(task.id, task.workspaceId);

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <PropSection title="Свойства">
        <TaskStatusPickerMenu
          status={status}
          onStatusChange={(option) => void savePatch({ status: option })}
          trigger={
            <PropAction
              interactive
              icon={<TaskStatusIcon status={status} className="size-3.5" />}
            >
              {getStatusLabel(status)}
            </PropAction>
          }
        />

        <TaskPriorityPickerMenu
          priority={priority}
          onPriorityChange={(value) =>
            void savePatch({ tags: value ?? "" })
          }
          trigger={
            <PropAction
              interactive
              icon={
                <TaskPriorityIcon priority={priority} className="size-3.5" />
              }
            >
              {priority ? priorityLabel : <PropEmpty>Не задан</PropEmpty>}
            </PropAction>
          }
        />
      </PropSection>

      <PropSection title="Даты">
        <PropAction
          interactive
          icon={<TaskStartDateIcon className="size-3.5" />}
          onClick={() => {
            setStartCalendarOpen((v) => !v);
            setDueCalendarOpen(false);
          }}
        >
          <span className="tabular-nums">
            {task.startDate ? (
              formatDate(task.startDate)
            ) : (
              <PropEmpty>Старт не задан</PropEmpty>
            )}
          </span>
        </PropAction>
        {startCalendarOpen ? (
          <div className="px-1 pb-1 pt-0.5">
            <TaskDatePicker
              value={task.startDate}
              onChange={(iso) => {
                void savePatch({ startDate: iso });
                setStartCalendarOpen(false);
              }}
            />
          </div>
        ) : null}

        <PropAction
          interactive
          icon={<TaskDueDateIcon className="size-3.5" />}
          onClick={() => {
            setDueCalendarOpen((v) => !v);
            setStartCalendarOpen(false);
          }}
        >
          <span className="tabular-nums">
            {task.dueDate ? (
              formatDate(task.dueDate)
            ) : (
              <PropEmpty>Дедлайн не задан</PropEmpty>
            )}
          </span>
        </PropAction>
        {dueCalendarOpen ? (
          <div className="px-1 pb-1 pt-0.5">
            <TaskDatePicker
              value={task.dueDate}
              onChange={(iso) => {
                void savePatch({ dueDate: iso });
                setDueCalendarOpen(false);
              }}
            />
          </div>
        ) : null}
      </PropSection>

      <PropSection title="Люди">
        <PropAction icon={<UserRound className="size-3.5" />}>
          {task.creator?.trim() ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <UserAvatar label={task.creator.trim()} size={16} />
              <span className="truncate">{task.creator.trim()}</span>
            </span>
          ) : (
            <PropEmpty>Владелец не задан</PropEmpty>
          )}
        </PropAction>

        {task.workspaceId ? (
          <>
            <PropAction
              interactive
              icon={<UserPlus className="size-3.5" />}
              onClick={() =>
                openCollaboration({
                  workspaceId: task.workspaceId,
                  workspaceTitle: workspaceName ?? workspace?.title,
                })
              }
            >
              {membersLoading ? (
                <PropEmpty>…</PropEmpty>
              ) : participants.length === 0 ? (
                <PropEmpty>Назначить участников</PropEmpty>
              ) : (
                <span className="flex min-w-0 items-center gap-1.5">
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
                  </span>
                  {participants.length > 4 ? (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      +{participants.length - 4}
                    </span>
                  ) : null}
                </span>
              )}
            </PropAction>

            {pendingInvites.length > 0 ? (
              <PropAction icon={<Mail className="size-3.5" />}>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {pendingInvites.length} приглашений ожидают
                </span>
              </PropAction>
            ) : null}

            {canManageMembers ? (
              <PropAction
                interactive
                icon={<Plus className="size-3" />}
                onClick={() =>
                  openCollaboration({
                    workspaceId: task.workspaceId,
                    workspaceTitle: workspaceName ?? workspace?.title,
                  })
                }
                className="text-muted-foreground"
              >
                Управление участниками
              </PropAction>
            ) : null}
          </>
        ) : null}
      </PropSection>

      <PropSection title="Проект">
        <PropAction icon={<Box className="size-3.5" />}>
          {workspaceName?.trim() ? (
            workspaceName.trim()
          ) : (
            <PropEmpty>Без проекта</PropEmpty>
          )}
        </PropAction>
      </PropSection>
    </div>
  );
});
