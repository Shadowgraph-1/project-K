import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bot,
  CalendarRange,
  Columns3,
  FolderKanban,
  Home,
  LayoutDashboard,
  ListTodo,
  Settings,
  UserRoundIcon,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/shared/ui/sidebar";
import { SESSION_PATHS } from "../model/sessionPaths";
import { useSessionCompanionChatStore } from "@/shared/model/useSessionCompanionChatStore";
import { useSessionNotificationStore } from "@/shared/model/useSessionNotificationStore";
import { cn } from "@/shared/lib/utils";

function isSessionHubPath(pathname: string) {
  return (
    pathname === SESSION_PATHS.sessionRoot ||
    pathname.startsWith(`${SESSION_PATHS.sessionRoot}/workspace`)
  );
}

function isPathActive(pathname: string, href: string) {
  if (href === SESSION_PATHS.sessionRoot) {
    return isSessionHubPath(pathname);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AppSidebar() {
  const { pathname } = useLocation();

  const showChat = useSessionCompanionChatStore((s) => s.showChat);
  const toggleChat = useSessionCompanionChatStore((s) => s.toggleChat);

  const unread = useSessionNotificationStore((s) => s.unreadCount);
  const setUnread = useSessionNotificationStore((s) => s.setUnreadCount);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Основная навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Домой">
                  <Link to={SESSION_PATHS.root}>
                    <Home className="size-4" />
                    <span>Домой</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Рабочие области"
                  isActive={isSessionHubPath(pathname)}
                >
                  <Link to={SESSION_PATHS.sessionRoot}>
                    <LayoutDashboard className="size-4" />
                    <span>Рабочие области</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Задачи"
                  isActive={isPathActive(pathname, SESSION_PATHS.tasks)}
                >
                  <Link to={SESSION_PATHS.tasks}>
                    <ListTodo className="size-4" />
                    <span>Задачи</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Проекты"
                  isActive={isPathActive(pathname, SESSION_PATHS.projects)}
                >
                  <Link to={SESSION_PATHS.projects}>
                    <FolderKanban className="size-4" />
                    <span>Проекты</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Канбан"
                  isActive={isPathActive(pathname, SESSION_PATHS.kanban)}
                >
                  <Link to={SESSION_PATHS.kanban}>
                    <Columns3 className="size-4" />
                    <span>Канбан</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Команда</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Участники"
                  isActive={isPathActive(pathname, SESSION_PATHS.teamMembers)}
                >
                  <Link to={SESSION_PATHS.teamMembers}>
                    <Users className="size-4" />
                    <span>Участники</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Спринты"
                  isActive={isPathActive(pathname, SESSION_PATHS.teamSprints)}
                >
                  <Link to={SESSION_PATHS.teamSprints}>
                    <CalendarRange className="size-4" />
                    <span>Спринты</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  tooltip="Компаньон"
                  isActive={showChat}
                  onClick={() => toggleChat()}
                >
                  <Bot className="size-4" />
                  <span>Компаньон</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Уведомления"
              className="relative"
              onClick={() => setUnread(0)}
            >
              <Bell className="size-4" />
              <span>Уведомления</span>
              {unread > 0 ? (
                <span
                  className={cn(
                    "absolute right-1.5 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground",
                    "group-data-[collapsible=icon]:right-0.5 group-data-[collapsible=icon]:top-0.5",
                  )}
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" tooltip="Настройки">
              <Settings className="size-4" />
              <span>Настройки</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Профиль">
              <Link to="/profile">
                <UserRoundIcon className="size-4" />
                <span>Профиль</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
