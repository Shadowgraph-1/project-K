import { create } from "zustand";

/**
 * История toast-уведомлений в UI (панель). Только память, без localStorage.
 */

type Notify = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: number;
};

type NotifyStore = {
  notifys: Notify[];
  addNotify: (
    id: string,
    title: string,
    description: string,
    status: string,
  ) => void;
  removeNotify: (id: string) => void;
  clearNotifys: () => void;
};

export const useNotifys = create<NotifyStore>()((set) => ({
  notifys: [],
  addNotify: (id, title, description, status) => {
    set((state) => ({
      notifys: [
        { id, title, description, status, createdAt: Date.now() },
        ...state.notifys,
      ],
    }));
  },
  removeNotify: (id) =>
    set((state) => ({
      notifys: state.notifys.filter((n) => n.id !== id),
    })),
  clearNotifys: () => set({ notifys: [] }),
}));
