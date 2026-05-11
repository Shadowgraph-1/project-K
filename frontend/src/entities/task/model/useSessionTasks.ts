import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubTask = {
  id: string;
  title: string;
  done: boolean;
};

export type Tasks = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  workspaceId: string;
  startDate?: string;
  dueDate?: string;
  creator?: string; 
  tags?: "Срочно" | "Работа" | "Фокус" | "Личное" | "Быстрый";
};

type TasksStore = {
  tasks: Tasks[];
  reorderTask: (task: Tasks[]) => void;
  addTask: (tasks: Tasks) => void;
  removeTask: (id: string) => void;
  renameTask: (id: string, title: string) => void;
  toggleTask: (id: string) => void;
  tagsTask: (id: string, tags: Tasks["tags"] | undefined) => void;
  updateDescription: (id: string, description: string) => void;
  updateDueDate: (id: string, dueDate: string | undefined) => void;
  updateStartDate: (id: string, startDate: string | undefined) => void;
  creator: (id: string, creator: string) => void;
};

export const useSessionTasks = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      renameTask: (id, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, title } : t)),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t,
          ),
        })),
      reorderTask: (tasks) => set({ tasks }),
      tagsTask: (id, tags) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, tags } : t)),
        })),
      updateDescription: (id, description) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, description } : t,
          ),
        })),
      updateDueDate: (id, dueDate) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, dueDate } : t,
          ),
        })),
      updateStartDate: (id, startDate) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, startDate } : t,
          ),
        })),
      creator: (id, creator) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, creator } : t,
          ),
        })),
    }),
    { name: "tasks" },
  ),
);