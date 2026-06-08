import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Home,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/shared/ui/sidebar";
import {
  isMembersHubPath,
  isProjectMembersPath,
  SESSION_PATHS,
} from "../../model/sessionPaths";
import { SettingsDialog } from "@/features/settings/ui/settings-dialog";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { cn } from "@/shared/lib/utils";

function isSessionHubPath(pathname: string) {
  return pathname === SESSION_PATHS.sessionRoot;
}

const navButtonClass =
  "rounded-none text-[13px] font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-sidebar-accent data-active:text-sidebar-foreground data-active:shadow-none";

function AppSidebar() {
  const user = useAuthStore((state) => state.user);

  const { pathname } = useLocation();
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const membersHref = SESSION_PATHS.membersHub;

  return (
    <Sidebar collapsible="offcanvas" variant="inset" className="session-main-sidebar border-border">
      <SidebarContent className="gap-2 px-2.5 pb-2 pt-3">
        <div className="px-2.5 pb-1">
          <Link
            to={SESSION_PATHS.root}
            className="text-sm font-semibold tracking-tight text-sidebar-foreground transition hover:text-sidebar-foreground/70"
          >
            Kono
          </Link>
        </div>
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-7 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/45">
            Основная навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" className={navButtonClass}>
                  <Link to={SESSION_PATHS.root}>
                    <Home className="size-4 opacity-80" />
                    <span>Домой</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  isActive={isSessionHubPath(pathname)}
                  className={navButtonClass}
                >
                  <Link to={SESSION_PATHS.sessionRoot}>
                    <Box className="size-4 opacity-80" />
                    <span>Проекты</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-7 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/45">
            Команда
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  isActive={
                    isMembersHubPath(pathname) || isProjectMembersPath(pathname)
                  }
                  className={navButtonClass}
                >
                  <Link to={membersHref}>
                    <Users className="size-4 opacity-80" />
                    <span>Участники</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-2.5 pt-0">
        <SidebarSeparator className="bg-sidebar-border/80" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              size="lg"
              className={cn(navButtonClass, "h-11 px-2")}
              onClick={() => setCabinetOpen(true)}
            >
              <UserAvatar
                name={user?.name}
                email={user?.email}
                className="size-8 rounded-none ring-1 ring-sidebar-border"
              />
              <div className="grid min-w-0 flex-1 gap-0.5 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium text-foreground">
                  {user?.name ?? "Гость"}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user?.email ?? ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SettingsDialog open={cabinetOpen} onOpenChange={setCabinetOpen} />
    </Sidebar>
  );
}

export default AppSidebar;
