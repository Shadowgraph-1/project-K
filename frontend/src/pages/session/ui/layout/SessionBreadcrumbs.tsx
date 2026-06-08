import { Link, useLocation, useParams } from "react-router-dom";

import { useSessionTasks } from "@/entities/task/model/useSessionTasks";
import { useWorkspaceQuery } from "@/entities/workspace/model/useWorkspaceStoreQuery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import {
  isProjectMembersPath,
  isProjectTaskDetailsPath,
  isProjectWorkspacePath,
  SESSION_PATHS,
} from "../../model/sessionPaths";

export function SessionBreadcrumbs() {
  const { pathname } = useLocation();
  const { workspaceId, taskId } = useParams<{
    workspaceId?: string;
    taskId?: string;
  }>();
  const { data: workspaces = [] } = useWorkspaceQuery();
  const task = useSessionTasks((state) =>
    taskId ? state.tasks.find((item) => item.id === taskId) : undefined,
  );

  const workspace = workspaceId
    ? workspaces.find((item) => item.id === workspaceId)
    : undefined;
  const workspaceTitle = workspace?.title ?? "Проект";

  if (isProjectTaskDetailsPath(pathname) && workspaceId) {
    const taskTitle = task?.title ?? "Задача";

    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap text-xs sm:text-sm">
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild>
              <Link to={SESSION_PATHS.sessionRoot}>Проекты</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0 max-w-[28%] shrink sm:max-w-[36%]">
            <BreadcrumbLink asChild className="block truncate">
              <Link to={SESSION_PATHS.project(workspaceId)} title={workspaceTitle}>
                {workspaceTitle}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0 flex-1">
            <BreadcrumbPage className="block truncate" title={taskTitle}>
              {taskTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isProjectMembersPath(pathname) && workspaceId) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={SESSION_PATHS.membersHub}>Участники</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate" title={workspaceTitle}>
              {workspaceTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isProjectWorkspacePath(pathname) && workspaceId) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={SESSION_PATHS.sessionRoot}>Проекты</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate" title={workspaceTitle}>
              {workspaceTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return null;
}
