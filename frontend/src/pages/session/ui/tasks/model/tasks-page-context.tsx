import { createContext, use, type ReactNode } from "react";

import {
  useSessionTasksPage,
  type SessionTasksPageModel,
} from "./use-session-tasks-page";

const TasksPageContext = createContext<SessionTasksPageModel | null>(null);

export function TasksPageProvider({ children }: { children: ReactNode }) {
  const value = useSessionTasksPage();

  return (
    <TasksPageContext.Provider value={value}>
      {children}
    </TasksPageContext.Provider>
  );
}

export function useTasksPage() {
  const context = use(TasksPageContext);
  if (!context) {
    throw new Error("useTasksPage must be used within TasksPageProvider");
  }
  return context;
}
