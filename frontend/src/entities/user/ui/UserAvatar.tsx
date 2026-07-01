import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { avatarColorClass } from "@/shared/lib/avatar-colors";
import { resolveUserAvatarUrl } from "@/shared/constants/default-user-avatar";
import { cn } from "@/shared/lib/utils";

const SIZE_CLASS = {
  16: { avatar: "size-4", text: "text-[8px]" },
  20: { avatar: "size-5", text: "text-[9px]" },
  24: { avatar: "size-6", text: "text-[10px]" },
  32: { avatar: "size-8", text: "text-xs" },
} as const;

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
  /** Короткая подпись — первые 2 символа (без логики имени/фамилии). */
  label?: string;
  avatarUrl?: string | null;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({
  name,
  email,
  label,
  avatarUrl,
  size = 32,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const colorKey = label?.trim() || name?.trim() || email?.trim() || "Гость";
  const initials = label?.trim()
    ? label.trim().slice(0, 2).toUpperCase()
    : userInitials(name?.trim() ?? "", email ?? undefined);
  const { avatar: sizeClass, text: textClass } =
    SIZE_CLASS[size] ?? SIZE_CLASS[32];
  const src = resolveUserAvatarUrl(avatarUrl);

  return (
    <Avatar className={cn(sizeClass, "shrink-0", className)}>
      <AvatarImage src={src} alt="" />
      <AvatarFallback
        className={cn(
          textClass,
          "font-semibold",
          avatarColorClass(colorKey),
          fallbackClassName,
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
