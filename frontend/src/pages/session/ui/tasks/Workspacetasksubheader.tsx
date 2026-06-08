import { type ReactNode } from "react";
import {
  ArrowUpDown,
  Download,
  Filter,
  Grid2X2Icon,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/ui/dropdown-menu";
import type { TasksView } from "./sessionWorkspaceTypes";

export type WorkspaceTaskSubheaderProps = {
  doneCount: number;
  totalCount: number;
  onCreate: () => void;
  trailingActions?: ReactNode;
  className?: string;
  view?: TasksView;
  onViewChange?: (variant: TasksView) => void;
};

function WorkspaceTaskSubheader({
  doneCount,
  totalCount,
  onCreate,
  className,
  view,
  onViewChange,
}: WorkspaceTaskSubheaderProps) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 flex-col gap-2 border-border/80 bg-muted/15 py-2.5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Задачи
          </span>
          <span className="rounded-lg bg-muted px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">
            {doneCount}/{totalCount}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label="Команда"
              >
                <Users className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Команда</TooltipContent>
          </Tooltip>

          <div
            className="mx-1 hidden h-4 w-px bg-border sm:block"
            aria-hidden
          />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="Экспорт задач"
                  >
                    <Grid2X2Icon className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Вид</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Вид
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={view || "line"}
                onValueChange={(v) => onViewChange?.(v as TasksView)}
              >
                <DropdownMenuRadioItem value="square">
                  Компактный
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="line">
                  Расширенный
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="Экспорт задач"
                  >
                    <Download className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Скачать</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Экспорт
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                Скачать как .txt
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                Скачать как .pdf
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className="mx-1 hidden h-4 w-px bg-border sm:block"
            aria-hidden
          />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="Фильтр"
                  >
                    <Filter className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Фильтрация</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Фильтрация
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                Все задачи
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                Только активные
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                Только выполненные
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="Сортировка"
                  >
                    <ArrowUpDown className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Сортировка</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Сортировка
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                По дате добавления
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                По названию
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                Сначала активные
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className="mx-1 hidden h-4 w-px bg-border sm:block"
            aria-hidden
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 gap-1 px-2 text-xs"
                onClick={onCreate}
                aria-label="Добавить задачу"
              >
                <Plus className="size-3" />
                Добавить
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Новая задача</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceTaskSubheader;
