/** Стандартный аватар для всех пользователей (`frontend/public/user_avatar.jpg`). */
export const DEFAULT_USER_AVATAR_URL = "/user_avatar.jpg";

export function resolveUserAvatarUrl(avatarUrl?: string | null) {
  const trimmed = avatarUrl?.trim();
  return trimmed || DEFAULT_USER_AVATAR_URL;
}
