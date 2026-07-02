export type SessionShortcut = {
  keys: string[];
  label: string;
};

export const SESSION_SHORTCUTS: SessionShortcut[] = [
  { keys: ["Ctrl + K"], label: "Поиск" },
  { keys: ["Ctrl + B"], label: "Боковая панель" },
  { keys: ["Ctrl + N"], label: "Новая задача" },
  { keys: ["Ctrl + J"], label: "Kono AI" },
];

export const SESSION_CREATE_TASK_EVENT = "session:create-task";

export function dispatchSessionCreateTask() {
  window.dispatchEvent(new CustomEvent(SESSION_CREATE_TASK_EVENT));
}
