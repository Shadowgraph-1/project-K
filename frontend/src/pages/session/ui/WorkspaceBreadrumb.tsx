import { useWorkspaceStore } from "@/entities/workspace/model/useWorkspaceStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { Link, useLocation, useParams } from "react-router-dom";
import { memo } from "react";

type WorkspaceBreadrumbProps = {
  onSessionHomeClick?: () => void;
};

function WorkspaceBreadrumb({ onSessionHomeClick }: WorkspaceBreadrumbProps) {
  const { cardId } = useParams();
  const location = useLocation();
  const isNewWorkspace = location.pathname === "/session/workspace/new";
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const workspace = cardId
    ? workspaces.find((w) => w.id === cardId)
    : undefined;

  const currentLabel = isNewWorkspace
    ? "Новая рабочая область"
    : workspace?.title?.trim() || "Без названия";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/session" onClick={() => onSessionHomeClick?.()}>
              Сессия
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default memo(WorkspaceBreadrumb);
