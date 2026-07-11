import type { ReactNode } from "react";

import type { Workspace } from "@/entities/workspace/model/workspace";
import { cn } from "@/shared/lib/utils";

import WorkspaceCard, { type WorkspaceTaskStats } from "./WorkspaceCard";
import { WORKSPACE_LIST_GRID } from "./workspaceListLayout";

type WorkspaceListSectionProps = {
  title: string;
  description?: string;
  items: Workspace[];
  taskStatsByWorkspaceId: ReadonlyMap<string, WorkspaceTaskStats>;
  showColumnHeader?: boolean;
  headerAction?: ReactNode;
  count?: number;
};

const EMPTY_TASK_STATS: WorkspaceTaskStats = { total: 0, completed: 0 };

export function WorkspaceListSection({
  title,
  description,
  items,
  taskStatsByWorkspaceId,
  showColumnHeader = false,
  headerAction,
  count,
}: WorkspaceListSectionProps) {
  if (items.length === 0 && !headerAction) return null;

  const itemCount = count ?? items.length;

  return (
    <section className="overflow-hidden rounded-xl border border-border/60 text-left text-card-foreground">
      <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <h2 className="text-xs text-primary">{title}</h2>
            {itemCount > 0 ? (
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {itemCount}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>

      {showColumnHeader && items.length > 0 ? (
        <div
          className={cn(
            WORKSPACE_LIST_GRID,
            "hidden border-b border-border/40 px-4 py-2 text-[11px] text-muted-foreground sm:grid",
          )}
        >
          <span>Название</span>
          <span className="text-right">Задачи</span>
          <span className="text-right">Готово</span>
          <span />
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="flex list-none flex-col divide-y divide-border/40">
          {items.map((item) => (
            <WorkspaceCard
              key={item.id}
              item={item}
              taskStats={
                taskStatsByWorkspaceId.get(item.id) ?? EMPTY_TASK_STATS
              }
            />
          ))}
        </ul>
      ) : (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          Пока пусто
        </p>
      )}
    </section>
  );
}

type WorkspaceHubGroupProps = {
  title: string;
  description?: string;
  items: Workspace[];
  renderItem: (workspace: Workspace) => ReactNode;
};

export function WorkspaceHubGroup({
  title,
  description,
  items,
  renderItem,
}: WorkspaceHubGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-xs font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">{items.map(renderItem)}</div>
    </div>
  );
}
