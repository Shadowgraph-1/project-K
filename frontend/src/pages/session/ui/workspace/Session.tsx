import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { SortableList } from "@/shared/sortable";
import SortableCard from "./SortableCard";

import { useWorkspaceStore } from "@/entities/workspace/model/useWorkspaceStore";
import EmptySession from "./EmptySession";
import { MonitorCloud, Plus } from "lucide-react";

function Session() {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const reorderWorkspaces = useWorkspaceStore(
    (state) => state.reorderWorkspaces,
  );
  const navigate = useNavigate();

  return (
    <>
      {workspaces.length === 0 ? (
        <EmptySession
          titleName="Рабочая область пуста"
          descriptionName="Создайте новую"
          icon={<MonitorCloud />}
          action={() => navigate("/session/workspace/new")}
        />
      ) : (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Рабочие области</h2>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => navigate("/session/workspace/new")}
            >
              <Plus className="size-4" />
              Создать
            </Button>
          </div>

          <SortableList
            items={workspaces}
            onReorder={reorderWorkspaces}
            className="grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-4"
          >
            {(item, index) => (
              <SortableCard key={item.id} item={item} index={index} />
            )}
          </SortableList>
        </div>
      )}
    </>
  );
}

export default Session;
