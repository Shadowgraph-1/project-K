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

type AppSidebarNavItemProps = {
  to: string;
  isActive: boolean;
  icon: ReactNode;
  label: string;
  menu: ReactNode;
};

export function AppSidebarNavItem({
  to,
  isActive,
  icon,
  label,
  menu,
}: AppSidebarNavItemProps) {
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
