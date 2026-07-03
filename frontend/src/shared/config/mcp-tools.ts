import {
  CheckCircle2,
  FolderKanban,
  ListTodo,
  MessageSquarePlus,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export type McpToolCategory = "projects" | "tasks" | "subtasks" | "search" | "activity";

export type McpToolDefinition = {
  name: string;
  description: string;
  category: McpToolCategory;
  icon?: LucideIcon;
  destructive?: boolean;
};

export const MCP_TOOL_CATEGORIES: Record<McpToolCategory, string> = {
  projects: "Проекты",
  tasks: "Задачи",
  subtasks: "Подзадачи",
  search: "Поиск",
  activity: "Комментарии",
};

export const MCP_TOOLS: readonly McpToolDefinition[] = [
  {
    name: "list_projects",
    description: "Список проектов пользователя (свои и shared)",
    category: "projects",
    icon: FolderKanban,
  },
  {
    name: "create_project",
    description: "Создать новый проект (workspace)",
    category: "projects",
    icon: FolderKanban,
  },
  {
    name: "list_tasks",
    description: "Задачи в проекте по workspaceId, опционально фильтр по статусу",
    category: "tasks",
    icon: ListTodo,
  },
  {
    name: "create_task",
    description: "Создать задачу в указанном проекте",
    category: "tasks",
    icon: Sparkles,
  },
  {
    name: "update_task",
    description: "Обновить задачу: название, описание, статус, приоритет, дедлайн",
    category: "tasks",
    icon: Pencil,
  },
  {
    name: "delete_task",
    description: "Удалить задачу вместе с подзадачами и activity",
    category: "tasks",
    icon: Trash2,
    destructive: true,
  },
  {
    name: "list_subtasks",
    description: "Подзадачи конкретной задачи по taskId",
    category: "subtasks",
    icon: ListTodo,
  },
  {
    name: "create_subtask",
    description: "Добавить подзадачу (шаг декомпозиции) к задаче",
    category: "subtasks",
    icon: Sparkles,
  },
  {
    name: "update_subtask",
    description: "Изменить название или статус подзадачи (в т.ч. отметить выполненной)",
    category: "subtasks",
    icon: CheckCircle2,
  },
  {
    name: "delete_subtask",
    description: "Удалить подзадачу",
    category: "subtasks",
    icon: Trash2,
    destructive: true,
  },
  {
    name: "add_task_comment",
    description: "Добавить комментарий в ленту задачи (можно ответить в ветку)",
    category: "activity",
    icon: MessageSquarePlus,
  },
  {
    name: "search_kono",
    description: "Поиск проектов и задач по названию",
    category: "search",
    icon: Search,
  },
] as const;

export const MCP_TOOL_NAMES = MCP_TOOLS.map((tool) => tool.name);