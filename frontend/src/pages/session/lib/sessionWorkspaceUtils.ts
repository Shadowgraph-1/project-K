export function suggestedCreatorLabel(user: { name: string; email: string } | null) {
  if (!user) return "";
  const name = user.name?.trim();
  return name || user.email || "";
}

export function resolveCreatorField(
  fromForm: string | undefined,
  user: { name: string; email: string } | null,
) {
  const trimmed = fromForm?.trim();
  if (trimmed) return trimmed;
  if (!user) return undefined;
  return user.name?.trim() || user.email || undefined;
}
