import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { linearContextMenuContentClass } from "@/pages/session/ui/tasks/task-context-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar";
import { sessionSidebarNavButton } from "../../lib/session-styles";
import { useRouteActive } from "../../lib/use-session-nav-active";

type AppSidebarNavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  menu: ReactNode;
  end?: boolean;
  active?: boolean;
};

export function AppSidebarNavItem({
  to,
  icon,
  label,
  menu,
  end = true,
  active,
}: AppSidebarNavItemProps) {
  const routeActive = useRouteActive(to, end);
  const isActive = active ?? routeActive;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
      </ContextMenuTrigger>
      <ContextMenuContent className={linearContextMenuContentClass}>
        {menu}
      </ContextMenuContent>
    </ContextMenu>
  );
}