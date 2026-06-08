import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { avatarColorClass } from "@/shared/lib/avatar-colors";
import { cn } from "@/shared/lib/utils";

function userInitials(name: string, email?: string) {
  const label = name.trim() || email?.trim() || "?";
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return label.slice(0, 2).toUpperCase();
}

export type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({
  name,
  email,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const displayName = name?.trim() || email?.trim() || "Гость";

  return (
    <Avatar className={cn("size-8 shrink-0", className)}>
      <AvatarFallback
        className={cn(
          "text-xs font-semibold",
          avatarColorClass(displayName),
          fallbackClassName,
        )}
      >
        {userInitials(name?.trim() ?? "", email ?? undefined)}
      </AvatarFallback>
    </Avatar>
  );
}
