import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { avatarColorClass } from "@/shared/lib/avatar-colors";
import { cn } from "@/shared/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return (parts[0] ?? "?").slice(0, 2).toUpperCase();
}

type WorkspaceMemberRowProps = {
  name: string;
  muted?: boolean;
  className?: string;
  trailing?: ReactNode;
};

export function WorkspaceMemberRow({
  name,
  muted = false,
  className,
  trailing,
}: WorkspaceMemberRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-1 py-1.5",
        className,
      )}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-[11px] font-medium",
            avatarColorClass(name),
          )}
        >
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          muted ? "text-muted-foreground" : "font-medium text-foreground",
        )}
      >
        {name}
      </span>
      {trailing ? (
        <div className="flex shrink-0 items-center">{trailing}</div>
      ) : null}
    </div>
  );
}
