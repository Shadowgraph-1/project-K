export type TaskForPrompt = {
  title: string;
  done: boolean;
  description?: string;
};

export type SubtasksForPrompt = {
  title: string;
  done: boolean;
  description?: string;
};

const DEFAULT_SYSTEM_PROMPT = `Ты AI-ассистент в таск-трекере Kono.
Помогай пользователю управлять задачами: приоритизировать, разбивать на шаги, планировать день.
Отвечай по-русски, кратко и по делу.
Пиши обычным текстом: без LaTeX и формул ($...$). Стрелки только как -> (не $\\rightarrow$).`;

export function buildSystemPrompt(
  tasks: TaskForPrompt[],
  subtasks: SubtasksForPrompt[],
): string {
  const tasksLayer =
    tasks.length > 0
      ? `Задачи пользователя:\n${tasks
          .map((t, i) => `${i + 1}. [${t.done ? "✓" : " "}] ${t.title}`)
          .join("\n")}`
      : "";
  const subtasksLayer =
    subtasks.length > 0
      ? `Подзадачи пользователя (задача -> подзадача):\n${subtasks
          .map((t, i) => `${i + 1}. [${t.done ? "✓" : " "}] ${t.title}`)
          .join("\n")}`
      : "";
  return [DEFAULT_SYSTEM_PROMPT, tasksLayer, subtasksLayer]
    .filter(Boolean)
    .join("\n\n");
}
