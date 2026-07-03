export type SessionShortcut = {
  id: string;
  keys: string[];
  label: string;
};

export const SESSION_SHORTCUTS: SessionShortcut[] = [
  { id: "search", keys: ["Ctrl + K"], label: "Поиск" },
  { id: "sidebar", keys: ["Ctrl + B"], label: "Боковая панель" },
  { id: "new-task", keys: ["Ctrl + N"], label: "Новая задача" },
  { id: "agent", keys: ["Ctrl + J"], label: "Агент" },
];

export const SESSION_CREATE_TASK_EVENT = "session:create-task";

export function dispatchSessionCreateTask() {
  window.dispatchEvent(new CustomEvent(SESSION_CREATE_TASK_EVENT));
}
