import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MonitorCloud, Plus } from "lucide-react";
import { partitionWorkspaces } from "@/entities/workspace/lib/partition-workspaces";
import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import { Button } from "@/shared/ui/button";
import EmptySession from "./EmptySession";
import { WorkspaceGridSkeleton } from "./WorkspaceGridSkeleton";
import { WorkspaceListSection } from "./WorkspaceListSection";
import { SESSION_PATHS } from "../../model/sessionPaths";

function Session() {
  const { data: workspaces = [], isLoading } = useWorkspaceQuery();
  const navigate = useNavigate();

  const { owned, shared } = useMemo(
    () => partitionWorkspaces(workspaces),
    [workspaces],
  );

  if (isLoading) {
    return <WorkspaceGridSkeleton />;
  }

  return (
    <>
      <header className="mb-6 border-b border-border pb-5">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Kono · Проекты
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Рабочие пространства
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Создавай проекты, приглашай команду и управляй задачами в одном месте.
        </p>
      </header>

      {workspaces.length === 0 ? (
        <EmptySession
          titleName="Рабочая зона пуста"
          descriptionName="Создайте новую"
          icon={<MonitorCloud />}
          buttonName="Создать"
          action={() => navigate(SESSION_PATHS.workspaceNew)}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-auto">
            <WorkspaceListSection
              title="Мои проекты"
              description="Проекты, которые вы создали"
              items={owned}
              showColumnHeader={owned.length > 0}
              headerAction={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 gap-1.5 rounded-none px-2.5 text-xs"
                  onClick={() => navigate(SESSION_PATHS.workspaceNew)}
                >
                  <Plus className="size-3.5" aria-hidden />
                  Создать проект
                </Button>
              }
            />
            <WorkspaceListSection
              title="Совместная работа"
              description="Проекты, куда вас пригласили"
              items={shared}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Session;
