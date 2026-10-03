import { create } from "zustand";

let nextId = 1;

/** Notificações breves (não persistidas). Use `toast("texto")` fora de componentes ou `useToastStore` nos componentes. */
const useToastStore = create((set) => ({
  toasts: [],
  push: (message, tone = "success") => set((s) => ({ toasts: [...s.toasts, { id: nextId++, message, tone }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message, tone) => useToastStore.getState().push(message, tone);

export default useToastStore;
