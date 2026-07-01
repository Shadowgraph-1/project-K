import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, ChevronRight, LayoutGrid, Users } from "lucide-react";

import { partitionWorkspaces } from "@/entities/workspace/lib/partition-workspaces";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import type { Workspace } from "@/entities/workspace/model/workspace";
import {
  sessionRowHover,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { SessionPageHeader } from "../layout/SessionPageHeader";
import EmptySession from "../placeholders/EmptySession";
import { WorkspaceGridSkeleton } from "../workspace/WorkspaceGridSkeleton";
import { cn } from "@/shared/lib/utils";

type MembersHubSectionProps = {
  title: string;
  description?: string;
  items: Workspace[];
  onSelect: (publicKey: string) => void;
};

function MembersHubSection({
  title,
  description,
  items,
  onSelect,
}: MembersHubSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn(sessionSurface, "overflow-hidden")}>
      <div className="px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="divide-y divide-border/25">
        {items.map((workspace) => (
          <button
            key={workspace.id}
            type="button"
            onClick={() => onSelect(workspace.publicKey)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left last:rounded-b-2xl",
              sessionRowHover,
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-background/60 ring-1 ring-border/25 text-muted-foreground">
              {workspace.kind === "shared" ? (
                <Users className="size-4" />
              ) : (
                <Box className="size-4" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {workspace.title}
              </span>
              {workspace.hint?.trim() ? (
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {workspace.hint.trim()}
                </span>
              ) : null}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        ))}
      </div>
    </section>
  );
}

export function MembersHubPage() {
  const navigate = useNavigate();
  const { data: workspaces = [], isLoading } = useWorkspaceQuery();
  const { owned, shared } = useMemo(
    () => partitionWorkspaces(workspaces),
    [workspaces],
  );

  const handleSelect = (publicKey: string) => {
    navigate(SESSION_PATHS.workspaceMembers(publicKey));
  };

  if (isLoading) {
    return <WorkspaceGridSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col gap-3">
      {workspaces.length === 0 ? (
        <EmptySession
          titleName="Нет проектов"
          descriptionName="Создайте проект или дождитесь приглашения"
          suggestions={[
            {
              title: "К проектам",
              description: "Создайте новый или откройте существующий",
              icon: <LayoutGrid />,
              iconClassName:
                "bg-[#EBEDFC] text-[#525CD1] dark:bg-indigo-500/15 dark:text-indigo-400",
              onClick: () => navigate(SESSION_PATHS.sessionRoot),
            },
          ]}
          footerAction={{
            label: "К проектам",
            onClick: () => navigate(SESSION_PATHS.sessionRoot),
          }}
        />
      ) : (
        <>
          <SessionPageHeader title="Участники" />
          <div className="flex flex-col gap-3">
            <MembersHubSection
              title="Мои проекты"
              description="Проекты, которые вы создали"
              items={owned}
              onSelect={handleSelect}
            />
            <MembersHubSection
              title="Совместная работа"
              description="Проекты, куда вас пригласили"
              items={shared}
              onSelect={handleSelect}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default MembersHubPage;
