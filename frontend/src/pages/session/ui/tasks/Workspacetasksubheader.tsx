import { type ReactNode } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  Filter,
  List,
  Plus,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import type { TasksView } from "./sessionWorkspaceTypes";
import { CollaborationButton } from "../workspace/CollaborationButton";
import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";
import { ToolbarIsland } from "../layout/ToolbarIsland";

export type WorkspaceTaskSubheaderProps = {
  totalCount: number;
  onCreate?: () => void;
  trailingActions?: ReactNode;
  className?: string;
  view?: TasksView;
  onViewChange?: (variant: TasksView) => void;
  onRemoveAll?: () => void | Promise<void>;
  collaboration?: {
    workspaceId?: string;
    workspaceTitle?: string;
    myRole?: WorkspaceRole;
  };
};

const VIEW_OPTIONS = [
  { value: "line", label: "Список", icon: List },
  { value: "timeline", label: "Даты", icon: CalendarDays },
] satisfies { value: TasksView; label: string; icon: typeof List }[];

function WorkspaceTaskSubheader({
  totalCount,
  onCreate,
  className,
  view,
  onViewChange,
  onRemoveAll,
  collaboration,
}: WorkspaceTaskSubheaderProps) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border/50 pb-2",
        className,
      )}
    >
      <ToolbarIsland aria-label="Вид задач">
        <div role="tablist" className="flex items-center">
        {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = (view || "line") === value;
          return (
            <Button
              key={value}
              type="button"
              role="tab"
              variant="ghost"
              size="sm"
              aria-selected={active}
              className={cn(
                "h-7 min-w-0 rounded-none px-2.5 text-xs font-medium",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground",
              )}
              onClick={() => onViewChange?.(value)}
            >
              <Icon className="size-3.5" aria-hidden />
              <span>{label}</span>
            </Button>
          );
        })}
        </div>
      </ToolbarIsland>

      <div className="flex shrink-0 items-center gap-2">
        {collaboration ? (
          <ToolbarIsland aria-label="Участники проекта">
            <CollaborationButton
              variant="island"
              workspaceId={collaboration.workspaceId}
              workspaceTitle={collaboration.workspaceTitle}
              myRole={collaboration.myRole}
            />
          </ToolbarIsland>
        ) : null}

        <ToolbarIsland aria-label="Действия с задачами" className="gap-0">
        {onCreate ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="size-7 rounded-none text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Добавить задачу"
            title="Добавить задачу"
            onClick={onCreate}
          >
            <Plus className="size-3.5" />
          </Button>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "size-7 rounded-none text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            aria-label="Фильтр"
            title="Фильтр"
          >
            <Filter className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Фильтрация
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">Все задачи</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              Только активные
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              Только выполненные
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "size-7 rounded-none text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            aria-label="Сортировка"
            title="Сортировка"
          >
            <ArrowUpDown className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Сортировка
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">
              По дате добавления
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">По названию</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              Сначала активные
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="size-7 rounded-none text-muted-foreground hover:bg-accent hover:text-destructive"
          aria-label="Удалить все задачи"
          title="Удалить все задачи"
          disabled={!onRemoveAll || totalCount === 0}
          onClick={async () => {
            if (!onRemoveAll) return;
            const confirmed = await notifyConfirm({
              title: "Удалить все задачи?",
              description: `Будет удалено: ${totalCount}`,
              confirmLabel: "Удалить",
              cancelLabel: "Отмена",
            });
            if (!confirmed) return;
            await onRemoveAll();
          }}
        >
          <Trash2 className="size-3.5" />
        </Button>
        </ToolbarIsland>
      </div>
    </div>
  );
}

export default WorkspaceTaskSubheader;
