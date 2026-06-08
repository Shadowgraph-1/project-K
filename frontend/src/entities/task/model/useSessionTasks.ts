import { create } from "zustand";

export {
  DEFAULT_TASK_STATUS,
  TASK_STATUSES,
  type TaskStatus,
} from "@/shared/constants/task-statuses";
import { DEFAULT_TASK_STATUS, type TaskStatus } from "@/shared/constants/task-statuses";

export type SubTask = {
  id: string;
  title: string;
  done: boolean;
};

export type Tasks = {
  id: string;
  title: string;
  description: string;
  workspaceId: string;
  startDate?: string;
  dueDate?: string;
  creator?: string;
  tags?: TaskPriority;
  status?: TaskStatus;
  checked?: boolean;
};

export function getTaskStatus(task: Tasks): TaskStatus {
  return task.status ?? DEFAULT_TASK_STATUS;
}


function sameTaskId(a: string, b: string) {
  return String(a) === String(b);
}

type TasksStore = {
  tasks: Tasks[];
  addTask: (tasks: Tasks) => void;
  removeTask: (id: string) => void;
  removeTasksInWorkspace: (workspaceId: string) => void;
  toggleTaskChecked: (id: string) => void;
  clearCheckedInWorkspace: (workspaceId: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setTasksForWorkspace: (workspaceId: string, task: Tasks[]) => void;
  updateTask: (id: string, patch:Partial<Tasks>) => void;
  clearTasks: () => void;
};

export const TASK_PRIORITIES = [
  "Срочный",
  "Высокий",
  "Средний",
  "Низкий",
] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/** @deprecated use TASK_PRIORITIES */
export const TASK_TAGS = TASK_PRIORITIES;
export type TaskTag = TaskPriority;

export const useSessionTasks = create<TasksStore>()(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => {
          const status = task.status ?? DEFAULT_TASK_STATUS;
          return {
            tasks: [
              ...state.tasks,
              {
                ...task,
                id: String(task.id),
                status,
                checked: false,
              },
            ],
          };
        }),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => !sameTaskId(t.id, id)),
        })),
      removeTasksInWorkspace: (workspaceId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.workspaceId !== workspaceId),
        })),
      setTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            sameTaskId(t.id, id) ? { ...t, status } : t,
          ),
        })),
      toggleTaskChecked: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            sameTaskId(t.id, id) ? { ...t, checked: !t.checked } : t,
          ),
        })),
      clearCheckedInWorkspace: (workspaceId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.workspaceId === workspaceId && t.checked
              ? { ...t, checked: false }
              : t,
          ),
        })),
      setTasksForWorkspace: (workspaceId, incoming) =>
        set((state) => {
          const existingInWorkspace = state.tasks.filter(
            (t) => t.workspaceId === workspaceId,
          );
          const checkedById = new Map(
            existingInWorkspace.map((t) => [String(t.id), Boolean(t.checked)]),
          );
          const normalized = incoming.map((t) => ({
            ...t,
            id: String(t.id),
            description: t.description ?? "",
            status: t.status ?? DEFAULT_TASK_STATUS,
            checked: checkedById.get(String(t.id)) ?? false,
          }));

          if (
            existingInWorkspace.length === normalized.length &&
            normalized.every((task) => {
              const prev = existingInWorkspace.find((t) => t.id === task.id);
              if (!prev) return false;
              return (
                prev.title === task.title &&
                prev.description === task.description &&
                prev.status === task.status &&
                prev.checked === task.checked &&
                prev.startDate === task.startDate &&
                prev.dueDate === task.dueDate &&
                prev.creator === task.creator &&
                prev.tags === task.tags
              );
            })
          ) {
            return state;
          }

          return {
            tasks: [
              ...state.tasks.filter((t) => t.workspaceId !== workspaceId),
              ...normalized,
            ],
          };
        }),
        updateTask: (id, patch) =>
          set((state) => ({
            tasks: state.tasks.map((t) => {
              if (!sameTaskId(t.id, id)) return t;
              const rest = { ...patch };
              delete rest.checked;
              return { ...t, ...rest, checked: t.checked };
            }),
          })),
        clearTasks: () => set({ tasks: [] }),
    }),
  )
