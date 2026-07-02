import { ChevronDown } from "lucide-react";

import type { WorkspaceRole } from "@/shared/lib/workspace-permissions";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: "Владелец",
  ADMIN: "Админ",
  EDITOR: "Редактор",
  COMMENTER: "Комментатор",
  VIEWER: "Наблюдатель",
};

type MemberRoleBadgeProps = {
  memberRole: WorkspaceRole;
  interactive?: boolean;
};

export function MemberRoleBadge({
  memberRole,
  interactive = false,
}: MemberRoleBadgeProps) {
  return (
    <span
      className={
        interactive
          ? "inline-flex h-7 min-w-[7.5rem] items-center justify-between gap-1 rounded-full bg-muted/35 px-2.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/35"
          : "inline-flex h-7 items-center rounded-full bg-muted/25 px-2.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/30"
      }
    >
      {ROLE_LABELS[memberRole]}
      {interactive ? (
        <ChevronDown className="size-3 opacity-60" aria-hidden />
      ) : null}
    </span>
  );
}
