import type { ReactNode } from "react";

import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { cn } from "@/shared/lib/utils";

type WorkspaceMemberRowProps = {
  name: string;
  muted?: boolean;
  className?: string;
  children?: ReactNode;
};

export function WorkspaceMemberRow({
  name,
  muted = false,
  className,
  children,
}: WorkspaceMemberRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-1 py-1.5",
        className,
      )}
    >
      <UserAvatar name={name} size={32} />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          muted ? "text-muted-foreground" : "font-medium text-foreground",
        )}
      >
        {name}
      </span>
      {children ? (
        <div className="flex shrink-0 items-center">{children}</div>
      ) : null}
    </div>
  );
}
