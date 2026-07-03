export type TaskForPrompt = {
  id?: string;
  title: string;
  done: boolean;
  description?: string;
};

export type SubtasksForPrompt = {
  id?: string;
  title: string;
  done: boolean;
  description?: string;
};

export type AssistantUiContext = {
  workspaceId?: string;
  workspaceName?: string;
  taskId?: string;
  taskTitle?: string;
};

export type AssistantWorkspaceForPrompt = {
  id: string;
  name: string;
  publicKey: string;
};

const DEFAULT_SYSTEM_PROMPT = `Ты AI-ассистент в таск-трекере Kono.
У тебя есть рабочие MCP-инструменты для проектов, задач, подзадач и комментариев.
Отвечай по-русски, кратко и по делу.
Пиши обычным текстом: без LaTeX и формул ($...$). Стрелки только как -> (не $\\rightarrow$).`;

function buildContextLayer(context?: AssistantUiContext): string {
  if (!context) return "";

  const lines: string[] = [];

  if (context.workspaceId && context.workspaceName) {
    lines.push(
      `Пользователь сейчас в проекте «${context.workspaceName}» (workspaceId: ${context.workspaceId}).`,
      "Если не указан другой проект — используй этот workspaceId для create_task и list_tasks.",
    );
  }

  if (context.taskId && context.taskTitle) {
    lines.push(
      `Открыта задача «${context.taskTitle}» (taskId: ${context.taskId}).`,
      "Если пользователь говорит «эту задачу», «здесь», «к ней» — используй этот taskId.",
    );
  }

  return lines.length > 0 ? `Контекст UI:\n${lines.join("\n")}` : "";
}

function buildWorkspacesLayer(workspaces: AssistantWorkspaceForPrompt[]): string {
  if (workspaces.length === 0) return "";

  return `Проекты пользователя (из UI):\n${workspaces
    .map(
      (workspace, index) =>
        `${index + 1}. «${workspace.name}» — id: ${workspace.id}, key: ${workspace.publicKey}`,
    )
    .join("\n")}`;
}

export function buildSystemPrompt(
  tasks: TaskForPrompt[],
  subtasks: SubtasksForPrompt[],
  context?: AssistantUiContext,
  workspaces: AssistantWorkspaceForPrompt[] = [],
): string {
  const contextLayer = buildContextLayer(context);
  const workspacesLayer = buildWorkspacesLayer(workspaces);

  const tasksLayer =
    tasks.length > 0
      ? `Задачи в текущем проекте:\n${tasks
          .map((t, i) => {
            const idPart = t.id ? `, id: ${t.id}` : "";
            return `${i + 1}. [${t.done ? "✓" : " "}] ${t.title}${idPart}`;
          })
          .join("\n")}`
      : "";

  const subtasksLayer =
    subtasks.length > 0
      ? `Подзадачи открытой задачи:\n${subtasks
          .map((t, i) => {
            const idPart = t.id ? `, id: ${t.id}` : "";
            return `${i + 1}. [${t.done ? "✓" : " "}] ${t.title}${idPart}`;
          })
          .join("\n")}`
      : "";

  return [
    DEFAULT_SYSTEM_PROMPT,
    workspacesLayer,
    contextLayer,
    tasksLayer,
    subtasksLayer,
  ]
    .filter(Boolean)
    .join("\n\n");
}