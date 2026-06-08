const AVATAR_COLORS = [
  "bg-violet-500 text-white",
  "bg-indigo-500 text-white",
  "bg-sky-500 text-white",
  "bg-teal-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-rose-500 text-white",
] as const;

export function avatarColorClass(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash += label.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
