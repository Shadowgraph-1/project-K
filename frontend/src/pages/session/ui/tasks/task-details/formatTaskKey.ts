export function formatTaskKey(id: string) {
  const compact = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `K-${compact}`;
}
