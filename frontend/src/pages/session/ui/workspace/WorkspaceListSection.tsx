import type { ReactNode } from "react";

import type { Workspace } from "@/entities/workspace/model/workspace";
import { sessionSurface } from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";

import WorkspaceCard from "./WorkspaceCard";
import { WORKSPACE_LIST_GRID } from "./workspaceListLayout";

type WorkspaceListSectionProps = {
  title: string;
  description?: string;
  items: Workspace[];
  showColumnHeader?: boolean;
  headerAction?: ReactNode;
};

export function WorkspaceListSection({
  title,
  description,
  items,
  showColumnHeader = false,
  headerAction,
}: WorkspaceListSectionProps) {
  if (items.length === 0 && !headerAction) return null;

  return (
    <section className={cn(sessionSurface, "overflow-hidden text-card-foreground")}>
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
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
            "bg-muted/20 px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
          )}
        >
          <span>Название</span>
          <span>Задачи</span>
          <span>Готово</span>
          <span />
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="flex list-none flex-col divide-y divide-border/25">
          {items.map((item) => (
            <WorkspaceCard key={item.id} item={item} />
          ))}
        </ul>
      ) : null}
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
