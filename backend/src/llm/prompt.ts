export type TaskForPrompt = {
  title: string;
  done: boolean;
  description?: string;
};

const DEFAULT_SYSTEM_PROMPT = `Ты AI-ассистент в таск-трекере Kono.
Помогай пользователю управлять задачами: приоритизировать, разбивать на шаги, планировать день.
Отвечай по-русски, кратко и по делу.`;

export function buildSystemPrompt(tasks: TaskForPrompt[]): string {
  const tasksLayer =
    tasks.length > 0
      ? `Задачи пользователя:\n${tasks
          .map((t, i) => `${i + 1}. [${t.done ? "✓" : " "}] ${t.title}`)
          .join("\n")}`
      : "";
  return [DEFAULT_SYSTEM_PROMPT, tasksLayer].filter(Boolean).join("\n\n");
}
