import { create } from "zustand"

type AuthModalMode = 'login' | 'register' | null

type ModalStore = {
  authModalMode: AuthModalMode
  openLogin: () => void
  openRegister: () => void
  closeAuthModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  authModalMode: null,

  openLogin: () => set({ authModalMode: 'login' }),
  openRegister: () => set({ authModalMode: 'register' }),
  closeAuthModal: () => set({ authModalMode: null }),
}))