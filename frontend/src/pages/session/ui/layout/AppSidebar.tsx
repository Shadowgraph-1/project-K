import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { SESSION_PATHS } from "../../model/sessionPaths";
import {
  sessionSidebarGroupLabel,
  sessionSidebarLogoButton,
  sessionSidebarNavButton,
} from "../../lib/session-styles";
import {
  useMembersNavActive,
  useRouteActive,
  useWorkspaceMembersRoutePublicKey,
} from "../../lib/use-session-nav-active";
import { KonoIcon } from "@/shared/ui/kono-logo";
import { SessionSidebarFooter } from "./SessionSidebarFooter";
import { AppSidebarProjectsTree } from "./AppSidebarProjectsTree";
import { AppSidebarNavItem } from "./AppSidebarNavItem";
import {
  SidebarLlmKeysNavContextMenuItems,
  SidebarMembersNavContextMenuItems,
} from "./sidebar-context-menus";

function SidebarNavLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) {
  const isActive = useRouteActive(to);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={sessionSidebarNavButton}
      >
        <Link to={to}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AppSidebar() {
  const navigate = useNavigate();
  const membersActive = useMembersNavActive();
  const membersPublicKey = useWorkspaceMembersRoutePublicKey();
  const { data: isAdmin = false } = useAdminAccessQuery(
    (access) => access.isAdmin === true,
  );

  const { data: llmKeysCount = 0 } = useLlmKeysQuery(undefined, {
    select: (data) => data.keys.length,
  });
  const deleteAllLlmKeys = useDeleteAllLlmKeysMutation();

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
              <SidebarNavLink
                to={SESSION_PATHS.connectors}
                icon={<Plug2 />}
                label="Коннекторы"
              />
              <SidebarNavLink
                to={SESSION_PATHS.mcp}
                icon={<McpLogo className="size-4" />}
                label="MCP"
              />
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
                to={SESSION_PATHS.membersHub}
                active={membersActive}
                icon={<Users />}
                label="Участники"
                menu={
                  <SidebarMembersNavContextMenuItems
                    onOpen={() => navigate(SESSION_PATHS.membersHub)}
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
              <SidebarNavLink
                to={SESSION_PATHS.systemStatus}
                icon={<Activity />}
                label="Статус"
              />
              {isAdmin ? (
                <SidebarNavLink
                  to={SESSION_PATHS.admin}
                  icon={<Shield />}
                  label="Админка"
                />
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-2">
        <SessionSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;