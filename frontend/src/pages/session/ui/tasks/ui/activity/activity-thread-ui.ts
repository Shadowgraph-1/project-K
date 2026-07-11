/** 24px — ширина Reddit threadline-strip */
export const THREAD_GRID = "grid grid-cols-[24px_minmax(0,1fr)] gap-x-2";
export const MAX_THREAD_DEPTH = 8;

export function formatReplyCount(count: number) {
  if (count === 1) return "1 ответ";
  if (count >= 2 && count <= 4) return `${count} ответа`;
  return `${count} ответов`;
}