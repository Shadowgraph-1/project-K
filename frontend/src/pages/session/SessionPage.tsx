import { TooltipProvider } from "@/shared/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from "react";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { useModalStore } from "@/shared/model/useModalStore";
import { useAssistantChat } from "@/widgets/assistant/model/useAssistantChat";
import {
  getTaskStatus,
  useSessionTasks,
} from "@/entities/task/model/useSessionTasks";
import AppSidebar from "./ui/layout/AppSidebar";
import { SessionPageHeader } from "./ui/layout/SessionPageHeader";
import { SessionMainArea } from "./ui/layout/SessionMainArea";
import { AssistantFloatingPanel } from "./ui/widgets/AssistantFloatingPanel";
import {
  isMembersHubPath,
  isProjectMembersPath,
  isSessionTasksPath,
  SESSION_PATHS,
} from "./model/sessionPaths";
import { useSessionSecondarySidebarStore } from "@/shared/model/useSessionSecondarySidebarStore";
import without_login from "@/assets/wo_login.jpg";
import { Button } from "@/shared/ui/button";
import "./ui/session-shell.css";

const EMPTY_TASK: { title: string; done: boolean; description?: string }[] =
  [];

function SessionPage() {
  const [withTask, setWithTask] = useState(false);

  const openLogin = useModalStore((state) => state.openLogin);
  const openRegister = useModalStore((state) => state.openRegister);

  const tasks = useSessionTasks((state) => state.tasks);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const location = useLocation();
  const isNewWorkspace = location.pathname === SESSION_PATHS.workspaceNew;
  const onTasksPage = isSessionTasksPath(location.pathname);
  const onMembersPage = isProjectMembersPath(location.pathname);
  const onMembersHub = isMembersHubPath(location.pathname);
  const setSecondaryOpen = useSessionSecondarySidebarStore((s) => s.setOpen);

  useEffect(() => {
    if (!onTasksPage) setSecondaryOpen(false);
  }, [onTasksPage, setSecondaryOpen]);
  const inWorkspaceFlow =
    isNewWorkspace ||
    Boolean(workspaceId) ||
    onTasksPage ||
    onMembersPage ||
    onMembersHub;

  const {
    question,
    setQuestion,
    answer,
    error,
    askAssistant,
    history,
    loading,
  } = useAssistantChat({
    tasks: withTask
      ? tasks.map((t) => ({
          title: t.title,
          done: getTaskStatus(t) === "Выполнено",
          description: t.description || undefined,
        }))
      : EMPTY_TASK,
  });

  return (
    <div className="session-shell h-dvh overflow-hidden">
      <TooltipProvider>
        <SidebarProvider
          defaultOpen
          keyboardShortcut={false}
          className="h-full min-h-0"
          style={{ "--sidebar-width": "244px" } as CSSProperties}
        >
          <AppSidebar />
          <SidebarInset className="session-panel-scroll flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-background md:m-2 md:ml-0 md:rounded-none md:border md:shadow-none">
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <SessionPageHeader
                  isAuthenticated={isAuthenticated}
                  hasUser={Boolean(user)}
                  onOpenLogin={openLogin}
                  onOpenRegister={openRegister}
                />

                {isAuthenticated && user ? (
                  <SessionMainArea
                    inWorkspaceFlow={inWorkspaceFlow}
                    isNewWorkspace={isNewWorkspace}
                  />
                ) : (
                  <div className="session-panel-scroll flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10">
                    <div className="session-empty-state flex w-full max-w-md flex-col items-center gap-8 bg-card p-8 text-center">
                      <div className="space-y-3">
                        <p className="text-[15px] font-semibold tracking-tight text-foreground">
                          Войдите, чтобы продолжить
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Создайте учётную запись или войдите в существующую —
                          так сохранятся проекты и задачи.
                        </p>
                      </div>
                      <img
                        src={without_login}
                        alt=""
                        className="w-full max-w-[280px] rounded-none border border-border bg-card object-cover shadow-sm"
                      />
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button
                          type="button"
                          className="min-w-[140px] rounded-none"
                          onClick={openLogin}
                        >
                          Войти
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="min-w-[140px] rounded-none"
                          onClick={openRegister}
                        >
                          Регистрация
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            {onTasksPage ? (
              <AssistantFloatingPanel
                chat={
                  isAuthenticated && user
                    ? {
                        error,
                        answer,
                        history,
                        question,
                        onQuestionChange: setQuestion,
                        onSend: () => void askAssistant(),
                        withTask,
                        onToggleWithTask: () => setWithTask((v) => !v),
                        loading,
                        userLabel:
                          user.name?.trim() ||
                          user.email.split("@")[0] ||
                          "Вы",
                      }
                    : null
                }
              />
            ) : null}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}

export default SessionPage;
