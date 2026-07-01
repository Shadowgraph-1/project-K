import { memo, type ComponentType } from "react";
import {
  ArrowUpDown,
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
import type { TasksView } from "./sessionWorkspaceTypes";
import { SessionTooltip } from "../layout/SessionTooltip";
import { ToolbarIsland, toolbarIslandIconButtonClass } from "../layout/ToolbarIsland";
import type { TaskStatus } from "@/shared/constants/task-statuses";

export type WorkspaceTaskSettingsButtonProps = {
  totalCount: number;
  onCreate?: () => void;
  view?: TasksView;
  onViewChange?: (variant: TasksView) => void;
  onRemoveAll?: () => void | Promise<void>;
  statusFilter?: TaskStatus | null;
  onStatusFilterChange: (status: TaskStatus | null) => void;
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
  { value: "TODO", label: "Только активные" },
  { value: "DONE", label: "Только выполненные" },
];

const SORT_OPTIONS = [
  "По дате добавления",
  "По названию",
  "Сначала активные",
] as const;

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

export const WorkspaceTaskSettingsButton = memo(function WorkspaceTaskSettingsButton({
  totalCount,
  onCreate,
  view,
  onViewChange,
  onRemoveAll,
  statusFilter,
  onStatusFilterChange,
}: WorkspaceTaskSettingsButtonProps) {
  const currentView = view ?? "line";
  const currentOption =
    VIEW_OPTIONS.find((option) => option.value === currentView) ??
    VIEW_OPTIONS[0];
  const hasActiveFilter = statusFilter !== null && statusFilter !== undefined;

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
    <ToolbarIsland aria-label="Настройки задач">
      <Popover>
          <SessionTooltip
            label={"Настройки"
            }
          >
            <PopoverTrigger
              className={toolbarIslandIconButtonClass}
              aria-label={`Настройки: ${currentOption.label}`}
            >
              <Settings2 className="size-3.5" aria-hidden />
              {hasActiveFilter ? (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
              ) : null}
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

              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Filter className="size-3.5" aria-hidden />
                  Фильтрация
                </p>
                <div className="flex flex-col gap-0.5">
                  {FILTER_OPTIONS.map((option) => (
                    <SettingsOptionRow
                      key={option.label}
                      label={option.label}
                      active={statusFilter === option.value}
                      onClick={() => onStatusFilterChange(option.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ArrowUpDown className="size-3.5" aria-hidden />
                  Сортировка
                </p>
                <div className="flex flex-col gap-0.5">
                  {SORT_OPTIONS.map((label, index) => (
                    <SettingsOptionRow
                      key={label}
                      label={label}
                      active={index === 0}
                      onClick={() => {}}
                    />
                  ))}
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
  );
});
