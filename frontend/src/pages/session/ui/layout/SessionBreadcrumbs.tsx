import { Link, useLocation, useParams } from "react-router-dom";

import { useTaskTitleQuery } from "@/entities/task/model/use-tasks-query";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import {
  isWorkspaceMembersPath,
  isWorkspaceTaskDetailsPath,
  isWorkspaceDetailPath,
  isLlmKeysPath,
  isConnectorsPath,
  isMcpPath,
  isSettingsPath,
  isAdminPath,
  SESSION_PATHS,
} from "../../model/sessionPaths";

export function SessionBreadcrumbs() {
  const { pathname } = useLocation();
  const { publicKey, taskId } = useParams<{
    publicKey?: string;
    taskId?: string;
  }>();
  const { data: activeWorkspace } = useWorkspaceQuery((workspaces) => {
    if (!publicKey) return null;
    const workspace = workspaces.find((item) => item.publicKey === publicKey);
    return workspace
      ? { id: workspace.id, title: workspace.title }
      : null;
  });
  const workspaceTitle = activeWorkspace?.title ?? "Проект";

  const { data: taskTitle } = useTaskTitleQuery(activeWorkspace?.id, taskId);

  if (isAdminPath(pathname)) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">Админка</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isSettingsPath(pathname)) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">Настройки</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isLlmKeysPath(pathname)) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">API ключи</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isConnectorsPath(pathname)) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">Коннекторы</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isMcpPath(pathname)) {
    return (
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="text-xs sm:text-sm">
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">MCP</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isWorkspaceTaskDetailsPath(pathname) && publicKey) {
    const resolvedTaskTitle = taskTitle ?? "Задача";

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
              <Link to={SESSION_PATHS.workspace(publicKey)} title={workspaceTitle}>
                {workspaceTitle}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0 flex-1">
            <BreadcrumbPage className="block truncate" title={resolvedTaskTitle}>
              {resolvedTaskTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (isWorkspaceMembersPath(pathname) && publicKey) {
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

  if (isWorkspaceDetailPath(pathname) && publicKey) {
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
