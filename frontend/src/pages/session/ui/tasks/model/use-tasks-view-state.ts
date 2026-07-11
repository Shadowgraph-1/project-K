import { useCallback, useRef, useState } from "react";

import type { TaskStatus } from "@/shared/constants/task-statuses";

import type {
  TaskSort,
  TaskSortDirection,
  TasksView,
} from "./sessionWorkspaceTypes";

export function useTasksViewState() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [sortBy, setSortBy] = useState<TaskSort>("created");
  const [sortDirection, setSortDirection] =
    useState<TaskSortDirection>("desc");
  const [view, setView] = useState<TasksView>("line");
  const [creating, setCreating] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const targetWorkspaceIdRef = useRef<string | null>(null);

  const clearStatusFilter = useCallback(() => setStatusFilter(null), []);

  const openCreateForWorkspace = useCallback((workspaceId: string) => {
    targetWorkspaceIdRef.current = workspaceId;
    setCreateModalKey((key) => key + 1);
    setCreating(true);
  }, []);

  return {
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    view,
    setView,
    creating,
    setCreating,
    createModalKey,
    targetWorkspaceIdRef,
    clearStatusFilter,
    openCreateForWorkspace,
  };
}
