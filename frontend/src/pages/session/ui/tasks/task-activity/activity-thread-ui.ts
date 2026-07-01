/** 24px — ширина Reddit threadline-strip */
export const THREADLINE_WIDTH_CLASS = "w-6";
export const THREADLINE_TOP_CLASS = "top-7";
export const THREADLINE_INDENT_CLASS = "ps-6";

export const THREAD_GRID = "grid grid-cols-[24px_minmax(0,1fr)] gap-x-2";
export const MAX_THREAD_DEPTH = 8;
export const THREAD_GUTTER_PX = 24;

export function formatHiddenReplies(count: number) {
  if (count === 1) return "1 ответ скрыт";
  if (count >= 2 && count <= 4) return `${count} ответа скрыто`;
  return `${count} ответов скрыто`;
}

export function formatReplyCount(count: number) {
  if (count === 1) return "1 ответ";
  if (count >= 2 && count <= 4) return `${count} ответа`;
  return `${count} ответов`;
}