import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  LayoutGrid,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

import type { Task, TaskPriority } from "@/entities/task/model/types";
import { getTaskStatus } from "@/entities/task/model/types";
import { useSaveTaskPatch } from "@/entities/task/model/use-save-task-patch";
import type { Workspace } from "@/entities/workspace/model/workspace";
import type { TaskStatus } from "@/shared/constants/task-statuses";
import { ContextMenuSeparator } from "@/shared/ui/context-menu";
import {
  TaskDateContextMenuFields,
  type TaskDateField,
} from "@/pages/session/ui/tasks/task-date-picker";
import {
  ContextMenuActionItem,
  TaskDeleteFieldIcon,
} from "@/pages/session/ui/tasks/task-context-menu";
import {
  TaskPriorityContextMenuSub,
  TaskStatusContextMenuSub,
} from "@/pages/session/ui/tasks/task-picker-menus";
import { normalizeTaskPriority } from "@/pages/session/ui/tasks/task-priority-icons";
import { canPerformWorkspaceAction } from "@/shared/lib/workspace-permissions";

type SidebarTaskContextMenuItemsProps = {
  task: Task;
  workspace: Workspace;
  onOpen: () => void;
  onDelete: () => void;
};

export function SidebarTaskContextMenuItems({
  task,
  workspace,
  onOpen,
  onDelete,
}: SidebarTaskContextMenuItemsProps) {
  const savePatch = useSaveTaskPatch(task.id, workspace.id);
  const status = getTaskStatus(task);
  const priority = normalizeTaskPriority(task.tags);
  const canEdit = canPerformWorkspaceAction(workspace.myRole, "edit_task");
  const canDelete = canPerformWorkspaceAction(workspace.myRole, "delete_task");

  const handleStatusChange = (next: TaskStatus) =>
    void savePatch(
      { status: next },
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
      <ContextMenuActionItem
        icon={<FolderOpen className="size-4" />}
        label="Открыть"
        onSelect={onOpen}
      />
      {canEdit ? (
        <>
          <TaskStatusContextMenuSub
            status={status}
            onStatusChange={handleStatusChange}
          />
          <TaskPriorityContextMenuSub
            priority={priority}
            onPriorityChange={handlePriorityChange}
          />
          <TaskDateContextMenuFields
            startDate={task.startDate}
            dueDate={task.dueDate}
            onDateChange={handleDateChange}
          />
        </>
      ) : null}
      {canDelete ? (
        <>
          <ContextMenuSeparator className="my-1" />
          <ContextMenuActionItem
            variant="destructive"
            icon={<TaskDeleteFieldIcon className="size-4" />}
            label="Удалить"
            onSelect={onDelete}
          />
        </>
      ) : null}
    </>
  );
}

type SidebarWorkspaceContextMenuItemsProps = {
  workspace: Workspace;
  taskCount: number;
  expanded: boolean;
  onOpen: () => void;
  onToggleTasks: () => void;
  onOpenMembers: () => void;
  onDelete: () => void;
};

export function SidebarWorkspaceContextMenuItems({
  workspace,
  taskCount,
  expanded,
  onOpen,
  onToggleTasks,
  onOpenMembers,
  onDelete,
}: SidebarWorkspaceContextMenuItemsProps) {
  const hasTasks = taskCount > 0;
  const canDelete =
    workspace.kind === "owned" && workspace.myRole === "OWNER";
  const canManageMembers = canPerformWorkspaceAction(
    workspace.myRole,
    "manage_members",
  );

  return (
    <>
      <ContextMenuActionItem
        icon={<FolderOpen className="size-4" />}
        label="Открыть"
        onSelect={onOpen}
      />
      {hasTasks ? (
        <ContextMenuActionItem
          icon={
            expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )
          }
          label={expanded ? "Свернуть задачи" : "Развернуть задачи"}
          onSelect={onToggleTasks}
        />
      ) : null}
      {canManageMembers ? (
        <ContextMenuActionItem
          icon={<Users className="size-4" />}
          label="Участники"
          onSelect={onOpenMembers}
        />
      ) : null}
      {canDelete ? (
        <>
          <ContextMenuSeparator className="my-1" />
          <ContextMenuActionItem
            variant="destructive"
            icon={<TaskDeleteFieldIcon className="size-4" />}
            label="Удалить проект"
            onSelect={onDelete}
          />
        </>
      ) : null}
    </>
  );
}

type SidebarLlmKeysNavContextMenuItemsProps = {
  onOpen: () => void;
  onCreate: () => void;
  onDeleteAll: () => void;
  canDeleteAll: boolean;
};

export function SidebarLlmKeysNavContextMenuItems({
  onOpen,
  onCreate,
  onDeleteAll,
  canDeleteAll,
}: SidebarLlmKeysNavContextMenuItemsProps) {
  return (
    <>
      <ContextMenuActionItem
        icon={<FolderOpen className="size-4" />}
        label="Открыть"
        onSelect={onOpen}
      />
      <ContextMenuActionItem
        icon={<Plus className="size-4" />}
        label="Создать ключ"
        onSelect={onCreate}
      />
      {canDeleteAll ? (
        <>
          <ContextMenuSeparator className="my-1" />
          <ContextMenuActionItem
            variant="destructive"
            icon={<TaskDeleteFieldIcon className="size-4" />}
            label="Удалить все ключи"
            onSelect={onDeleteAll}
          />
        </>
      ) : null}
    </>
  );
}

type SidebarMembersNavContextMenuItemsProps = {
  onOpen: () => void;
  onOpenProjects: () => void;
  onInvite?: () => void;
};

export function SidebarMembersNavContextMenuItems({
  onOpen,
  onOpenProjects,
  onInvite,
}: SidebarMembersNavContextMenuItemsProps) {
  return (
    <>
      <ContextMenuActionItem
        icon={<Users className="size-4" />}
        label="Открыть участников"
        onSelect={onOpen}
      />
      <ContextMenuActionItem
        icon={<LayoutGrid className="size-4" />}
        label="К проектам"
        onSelect={onOpenProjects}
      />
      {onInvite ? (
        <ContextMenuActionItem
          icon={<UserPlus className="size-4" />}
          label="Пригласить"
          onSelect={onInvite}
        />
      ) : null}
    </>
  );
}
