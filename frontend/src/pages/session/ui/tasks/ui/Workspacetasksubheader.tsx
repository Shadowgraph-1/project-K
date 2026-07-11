import { memo, type ComponentType } from "react";
import {
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUpDown,
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarDays,
  Check,
  Filter,
  Kanban,
  List,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import type {
  TaskSort,
  TaskSortDirection,
  TasksView,
} from "../model/sessionWorkspaceTypes";
import { SessionTooltip } from "../../layout/SessionTooltip";
import { ToolbarIsland } from "../../layout/ToolbarIsland";
import { toolbarIslandIconButtonClass } from "../../layout/toolbar-island-styles";
import {
  TASK_STATUSES,
  TASK_STATUS_FILTER_LABELS,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import { TaskStatusIcon } from "./shared/task-status-icons";

export type WorkspaceTaskSettingsButtonProps = {
  totalCount: number;
  onCreate?: () => void;
  view?: TasksView;
  onViewChange?: (variant: TasksView) => void;
  onRemoveAll?: () => void | Promise<void>;
  statusFilter?: TaskStatus | null;
  onStatusFilterChange: (status: TaskStatus | null) => void;
  sortBy: TaskSort;
  onSortChange: (sort: TaskSort) => void;
  sortDirection: TaskSortDirection;
  onSortDirectionChange: (direction: TaskSortDirection) => void;
};

const VIEW_OPTIONS = [
  { value: "line", label: "Список", icon: List },
  { value: "timeline", label: "Даты", icon: CalendarDays },
  { value: "kanban", label: "Канбан", icon: Kanban },
] satisfies {
  value: TasksView;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[];

const FILTER_OPTIONS: {
  value: TaskStatus | null;
  label: string;
}[] = [
  { value: null, label: "Все задачи" },
  ...TASK_STATUSES.map((status) => ({
    value: status,
    label:
      TASK_STATUS_FILTER_LABELS[status] ??
      `Только ${TASK_STATUS_LABELS[status].toLowerCase()}`,
  })),
];

const SORT_OPTIONS: { value: TaskSort; label: string }[] = [
  { value: "created", label: "По дате добавления" },
  { value: "title", label: "По названию" },
];

const SORT_DIRECTION_OPTIONS: Record<
  TaskSort,
  { value: TaskSortDirection; icon: ComponentType<{ className?: string }>; label: string }[]
> = {
  created: [
    { value: "desc", icon: CalendarArrowDown, label: "Сначала новые" },
    { value: "asc", icon: CalendarArrowUp, label: "Сначала старые" },
  ],
  title: [
    { value: "asc", icon: ArrowDownAZ, label: "А — Я" },
    { value: "desc", icon: ArrowDownZA, label: "Я — А" },
  ],
};

const SORT_DEFAULT_DIRECTION: Record<TaskSort, TaskSortDirection> = {
  created: "desc",
  title: "asc",
};

function isDefaultSort(sortBy: TaskSort, sortDirection: TaskSortDirection) {
  return (
    sortBy === "created" &&
    sortDirection === SORT_DEFAULT_DIRECTION.created
  );
}

function SortTriggerIconDisplay({
  sortBy,
  sortDirection,
}: {
  sortBy: TaskSort;
  sortDirection: TaskSortDirection;
}) {
  const className = "size-3.5";

  if (sortBy === "title") {
    return sortDirection === "asc" ? (
      <ArrowDownAZ className={className} aria-hidden />
    ) : (
      <ArrowDownZA className={className} aria-hidden />
    );
  }

  return sortDirection === "desc" ? (
    <CalendarArrowDown className={className} aria-hidden />
  ) : (
    <CalendarArrowUp className={className} aria-hidden />
  );
}

function SettingsOptionRow({
  label,
  active,
  onClick,
  icon: Icon,
  destructive,
  disabled,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        destructive && !active && "hover:bg-destructive/10 hover:text-destructive",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      <span className="flex-1">{label}</span>
      {active ? (
        <Check className="size-3.5 shrink-0 opacity-70" aria-hidden />
      ) : null}
    </button>
  );
}

function SortDirectionToggle({
  sortBy,
  sortDirection,
  onSortDirectionChange,
}: {
  sortBy: TaskSort;
  sortDirection: TaskSortDirection;
  onSortDirectionChange: (direction: TaskSortDirection) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-muted/40 p-0.5 ring-1 ring-border/30">
      {SORT_DIRECTION_OPTIONS[sortBy].map(({ value, icon: Icon, label }) => {
        const active = sortDirection === value;
        return (
          <SessionTooltip key={value} label={label}>
            <button
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => onSortDirectionChange(value)}
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-sm transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
            </button>
          </SessionTooltip>
        );
      })}
    </div>
  );
}

export const WorkspaceTaskSettingsButton = memo(function WorkspaceTaskSettingsButton({
  totalCount,
  onCreate,
  view,
  onViewChange,
  onRemoveAll,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
}: WorkspaceTaskSettingsButtonProps) {
  const currentView = view ?? "line";
  const currentOption =
    VIEW_OPTIONS.find((option) => option.value === currentView) ??
    VIEW_OPTIONS[0];
  const hasActiveFilter = statusFilter != null;
  const hasCustomSort = !isDefaultSort(sortBy, sortDirection);

  function handleSortChange(next: TaskSort) {
    onSortChange(next);
    onSortDirectionChange(SORT_DEFAULT_DIRECTION[next]);
  }

  async function handleRemoveAll() {
    if (!onRemoveAll) return;
    const confirmed = await notifyConfirm({
      title: "Удалить все задачи?",
      description: `Будет удалено: ${totalCount}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;
    await onRemoveAll();
  }

  return (
    <div className="flex items-center gap-1.5">
      <ToolbarIsland aria-label="Фильтрация задач">
        <Popover>
          <SessionTooltip label="Фильтрация">
            <PopoverTrigger
              className={cn(
                toolbarIslandIconButtonClass,
                hasActiveFilter && "bg-accent text-accent-foreground",
              )}
              aria-label="Фильтрация задач"
            >
              <Filter className="size-3.5" aria-hidden />
            </PopoverTrigger>
          </SessionTooltip>

          <PopoverContent align="end" className="w-72 p-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Фильтрация</p>
              <div className="flex flex-col gap-0.5">
                {FILTER_OPTIONS.map((option) => (
                  <SettingsOptionRow
                    key={option.value ?? "all"}
                    label={option.label}
                    active={statusFilter === option.value}
                    onClick={() => onStatusFilterChange(option.value)}
                    icon={
                      option.value
                        ? ({ className }) => (
                            <TaskStatusIcon
                              status={option.value as TaskStatus}
                              className={className}
                            />
                          )
                        : Filter
                    }
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarIsland>

      <ToolbarIsland aria-label="Сортировка задач">
        <Popover>
          <SessionTooltip label="Сортировка">
            <PopoverTrigger
              className={cn(
                toolbarIslandIconButtonClass,
                hasCustomSort && "bg-accent text-accent-foreground",
              )}
              aria-label="Сортировка задач"
            >
              <SortTriggerIconDisplay sortBy={sortBy} sortDirection={sortDirection} />
            </PopoverTrigger>
          </SessionTooltip>

          <PopoverContent align="end" className="w-80 p-3">
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ArrowUpDown className="size-3.5" aria-hidden />
                Сортировка
              </p>
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((option) => {
                  const active = sortBy === option.value;
                  return (
                    <div key={option.value} className="flex items-center gap-1.5">
                      <div className="min-w-0 flex-1">
                        <SettingsOptionRow
                          label={option.label}
                          active={active}
                          onClick={() => handleSortChange(option.value)}
                        />
                      </div>
                      {active ? (
                        <SortDirectionToggle
                          sortBy={option.value}
                          sortDirection={sortDirection}
                          onSortDirectionChange={onSortDirectionChange}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarIsland>

      <ToolbarIsland aria-label="Настройки задач">
        <Popover>
          <SessionTooltip label="Настройки">
            <PopoverTrigger
              className={toolbarIslandIconButtonClass}
              aria-label={`Настройки: ${currentOption.label}`}
            >
              <Settings2 className="size-3.5" aria-hidden />
            </PopoverTrigger>
          </SessionTooltip>

          <PopoverContent align="end" className="w-80 p-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Вид</p>
                <div
                  role="tablist"
                  aria-label="Вид задач"
                  className="flex items-center gap-0.5 rounded-lg bg-muted/40 p-0.5 ring-1 ring-border/30"
                >
                  {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => {
                    const active = currentView === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={cn(
                          "flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                          active
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => onViewChange?.(value)}
                      >
                        <Icon className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 border-t border-border/30 pt-3">
                {onCreate ? (
                  <SettingsOptionRow
                    label="Добавить задачу"
                    icon={Plus}
                    onClick={onCreate}
                  />
                ) : null}
                {onRemoveAll ? (
                  <SettingsOptionRow
                    label="Удалить все задачи"
                    icon={Trash2}
                    destructive
                    disabled={totalCount === 0}
                    onClick={() => void handleRemoveAll()}
                  />
                ) : null}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarIsland>
    </div>
  );
});
