import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { Activity, KeyRound, Plug2, Shield, Users } from "lucide-react";

import {
  useDeleteAllLlmKeysMutation,
  useLlmKeysQuery,
} from "@/hooks/use-llm-key-query";
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
} from "@/shared/ui/sidebar";
import { useAdminAccessQuery } from "@/hooks/use-admin-query";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { McpLogo } from "@/shared/ui/icons/McpLogo";
import {
  isMembersHubPath,
  isAdminPath,
  isConnectorsPath,
  isLlmKeysPath,
  isMcpPath,
  isWorkspaceMembersPath,
  isSystemStatusPath,
  SESSION_PATHS,
} from "../../model/sessionPaths";
import {
  sessionSidebarGroupLabel,
  sessionSidebarLogoButton,
  sessionSidebarNavButton,
} from "../../lib/session-styles";
import { KonoIcon } from "@/shared/ui/kono-logo";
import { SessionSidebarFooter } from "./SessionSidebarFooter";
import { AppSidebarProjectsTree } from "./AppSidebarProjectsTree";
import { AppSidebarNavItem } from "./AppSidebarNavItem";
import {
  SidebarLlmKeysNavContextMenuItems,
  SidebarMembersNavContextMenuItems,
} from "./sidebar-context-menus";


function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const membersHref = SESSION_PATHS.membersHub;
  const { data: isAdmin = false } = useAdminAccessQuery(
    (access) => access.isAdmin === true,
  );

  const { data: llmKeysCount = 0 } = useLlmKeysQuery(undefined, {
    select: (data) => data.keys.length,
  });
  const deleteAllLlmKeys = useDeleteAllLlmKeysMutation();

  const membersRouteMatch = matchPath(
    { path: "/workspaces/:publicKey/members", end: true },
    pathname,
  );
  const membersPublicKey = membersRouteMatch?.params.publicKey;

  async function handleDeleteAllLlmKeys() {
    if (llmKeysCount === 0) return;

    const confirmed = await notifyConfirm({
      title: "Удалить все ключи?",
      description: `Будет удалено ключей: ${llmKeysCount}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });
    if (!confirmed) return;
    deleteAllLlmKeys.mutate();
  }

  return (
    <Sidebar collapsible="offcanvas" variant="inset" className="session-main-sidebar">
      <SidebarHeader className="gap-2 px-2 pb-1 pt-3">
        <div className="flex items-center gap-1">
          <Link
            to={SESSION_PATHS.root}
            aria-label="Kono"
            className={sessionSidebarLogoButton}
          >
            <KonoIcon size={32} />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="minimal-scrollbar gap-5 px-2 py-1 pt-2">
        <AppSidebarProjectsTree />

        <SidebarGroup className="gap-0.5 p-0 pt-3 first:pt-0">
          <SidebarGroupLabel className={sessionSidebarGroupLabel}>
            Настройки
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <AppSidebarNavItem
                to={SESSION_PATHS.llmKeys}
                isActive={isLlmKeysPath(pathname)}
                icon={<KeyRound />}
                label="API ключи"
                menu={
                  <SidebarLlmKeysNavContextMenuItems
                    onOpen={() => navigate(SESSION_PATHS.llmKeys)}
                    onCreate={() =>
                      navigate(`${SESSION_PATHS.llmKeys}?create=1`)
                    }
                    onDeleteAll={() => void handleDeleteAllLlmKeys()}
                    canDeleteAll={llmKeysCount > 0}
                  />
                }
              />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isConnectorsPath(pathname)}
                  className={sessionSidebarNavButton}
                >
                  <Link to={SESSION_PATHS.connectors}>
                    <Plug2 />
                    <span>Коннекторы</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isMcpPath(pathname)}
                  className={sessionSidebarNavButton}
                >
                  <Link to={SESSION_PATHS.mcp}>
                    <McpLogo className="size-4" />
                    <span>MCP</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="gap-0.5 p-0 pt-3 first:pt-0">
          <SidebarGroupLabel className={sessionSidebarGroupLabel}>
            Команда
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <AppSidebarNavItem
                to={membersHref}
                isActive={
                  isMembersHubPath(pathname) || isWorkspaceMembersPath(pathname)
                }
                icon={<Users />}
                label="Участники"
                menu={
                  <SidebarMembersNavContextMenuItems
                    onOpen={() => navigate(membersHref)}
                    onOpenProjects={() => navigate(SESSION_PATHS.sessionRoot)}
                    onInvite={
                      membersPublicKey
                        ? () =>
                            navigate(
                              `${SESSION_PATHS.workspaceMembers(membersPublicKey)}?invite=1`,
                            )
                        : undefined
                    }
                  />
                }
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="gap-0.5 p-0 pt-3 first:pt-0">
          <SidebarGroupLabel className={sessionSidebarGroupLabel}>
            Система
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isSystemStatusPath(pathname)}
                  className={sessionSidebarNavButton}
                >
                  <Link to={SESSION_PATHS.systemStatus}>
                    <Activity />
                    <span>Статус</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdmin ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isAdminPath(pathname)}
                    className={sessionSidebarNavButton}
                  >
                    <Link to={SESSION_PATHS.admin}>
                      <Shield />
                      <span>Админка</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-2">
        <SessionSidebarFooter pathname={pathname} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
