import { ClipboardList, Plus } from "lucide-react";
import {
  getTaskFilterEmptyCopy,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import EmptySession from "../../placeholders/EmptySession";

function WorkspaceEmptyState({ onOpenCreate }: { onOpenCreate?: () => void }) {
  if (!onOpenCreate) {
    return (
      <EmptySession
        titleName="Список задач пуст"
        descriptionName="В этом проекте пока нет задач"
      />
    );
  }

  return (
    <EmptySession
      titleName="Добавьте задачи"
      descriptionName="Создайте первую или начните с нуля"
      suggestions={[
        {
          title: "Новая задача",
          description: "Статус, сроки и приоритет в одной карточке",
          icon: <ClipboardList />,
          iconClassName:
            "bg-[#E6F0FC] text-[#296BD6] dark:bg-blue-500/15 dark:text-blue-400",
          onClick: onOpenCreate,
        },
      ]}
      footerAction={{
        label: "Создать с нуля",
        onClick: onOpenCreate,
        icon: <Plus className="size-4" />,
      }}
    />
  );
}

function FilteredTasksEmptyState({
  statusFilter,
  onClearStatusFilter,
}: {
  statusFilter: TaskStatus;
  onClearStatusFilter?: () => void;
}) {
  const { title, description } = getTaskFilterEmptyCopy(statusFilter);

  return (
    <EmptySession
      titleName={title}
      descriptionName={description}
      footerAction={
        onClearStatusFilter
          ? { label: "Показать все задачи", onClick: onClearStatusFilter }
          : undefined
      }
    />
  );
}

export function WorkspaceTasksEmptyState({
  statusFilter,
  onClearStatusFilter,
  onOpenCreate,
}: {
  statusFilter?: TaskStatus | null;
  onClearStatusFilter?: () => void;
  onOpenCreate?: () => void;
}) {
  if (statusFilter) {
    return (
      <FilteredTasksEmptyState
        statusFilter={statusFilter}
        onClearStatusFilter={onClearStatusFilter}
      />
    );
  }

  return <WorkspaceEmptyState onOpenCreate={onOpenCreate} />;
}
