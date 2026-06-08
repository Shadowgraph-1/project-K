import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, ChevronRight, Users } from "lucide-react";

import { partitionWorkspaces } from "@/entities/workspace/lib/partition-workspaces";
import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import type { Workspace } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import { SESSION_PATHS } from "../../model/sessionPaths";
import EmptySession from "../placeholders/EmptySession";
import { WorkspaceGridSkeleton } from "../workspace/WorkspaceGridSkeleton";

type MembersHubRowProps = {
  workspace: Workspace;
  onSelect: (workspaceId: string) => void;
};

function MembersHubRow({ workspace, onSelect }: MembersHubRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(workspace.id)}
      className="flex w-full items-center gap-3 border-b border-border/40 px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/40"
    >
      <span className="flex size-8 shrink-0 items-center justify-center border border-border/60 bg-muted/30 text-muted-foreground">
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
  );
}

type MembersHubSectionProps = {
  title: string;
  description?: string;
  items: Workspace[];
  onSelect: (workspaceId: string) => void;
};

function MembersHubSection({
  title,
  description,
  items,
  onSelect,
}: MembersHubSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col border border-border bg-card">
      <div className="border-b border-border bg-muted/40 px-3 py-2.5">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div>
        {items.map((workspace) => (
          <MembersHubRow
            key={workspace.id}
            workspace={workspace}
            onSelect={onSelect}
          />
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

  const handleSelect = (workspaceId: string) => {
    navigate(SESSION_PATHS.projectMembers(workspaceId));
  };

  if (isLoading) {
    return <WorkspaceGridSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="border-b border-border pb-5">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Kono · Команда
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Участники
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Выберите проект — у каждого своя команда
        </p>
      </header>

      {workspaces.length === 0 ? (
        <EmptySession
          titleName="Нет проектов"
          descriptionName="Сначала создайте проект"
          icon={<Users />}
          buttonName="К проектам"
          action={() => navigate(SESSION_PATHS.sessionRoot)}
        />
      ) : (
        <div className="flex flex-col gap-4">
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
      )}
    </div>
  );
}

export default MembersHubPage;
